import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from './firebase-init';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../company/company.schema';
import { User } from './user.schema';
import axios, { AxiosError } from 'axios';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

interface RequestingUser {
  uid: string;
  email: string;
  admin: boolean;
  companyId: string;
  role: 'admin' | 'user';
}

interface SignupBody {
  email: string;
  password: string;
  companyName: string;
  fullName?: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

interface CreateUserBody {
  email: string;
  role?: 'admin' | 'user';
  employeeCode?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async signup(body: SignupBody) {
    this.logger.log(`Signup attempt for email: ${body.email}`);

    // 1. Validate input
    this.validateSignupInput(body);

    // 2. Check if email already exists in MongoDB
    const existingUser = await this.userModel
      .findOne({ email: body.email })
      .exec();

    if (existingUser !== null) {
      this.logger.warn(`Signup failed - email already exists: ${body.email}`);
      throw new ConflictException('Email already exists');
    }

    let userRecord: admin.auth.UserRecord | null = null;
    let userDoc: User | null = null;
    let company: Company | null = null;

    try {
      // 3. Create user in Firebase
      try {
        userRecord = await admin.auth().createUser({
          email: body.email,
          password: body.password,
          displayName: body.fullName,
        });
        this.logger.log(`Firebase user created: ${userRecord.uid}`);
      } catch (firebaseError: any) {
        this.logger.error(
          `Firebase user creation failed: ${firebaseError.message}`,
          firebaseError.stack,
        );
        throw new InternalServerErrorException(
          'Failed to create user account. Please try again.',
        );
      }

      // 4. Create user document in MongoDB
      try {
        userDoc = await this.userModel.create({
          uid: userRecord.uid,
          email: userRecord.email,
          admin: true,
          role: 'admin',
          disabled: false,
          deletedAt: null,
        });
        this.logger.log(
          `MongoDB user document created for UID: ${userRecord.uid}`,
        );
      } catch (mongoError: any) {
        this.logger.error(
          `MongoDB user creation failed: ${mongoError.message}`,
          mongoError.stack,
        );
        // Rollback: Delete Firebase user
        await this.rollbackFirebaseUser(userRecord.uid);
        throw new InternalServerErrorException(
          'Failed to create user profile. Please try again.',
        );
      }

      // 5. Create company in MongoDB
      try {
        company = await this.companyModel.create({
          companyName: body.companyName,
        });
        this.logger.log(`Company created: ${company._id}`);
      } catch (companyError: any) {
        this.logger.error(
          `Company creation failed: ${companyError.message}`,
          companyError.stack,
        );
        // Rollback: Delete Firebase user and MongoDB user
        await this.rollbackFirebaseUser(userRecord.uid);
        await this.rollbackMongoUser(userDoc._id);
        throw new InternalServerErrorException(
          'Failed to create company. Please try again.',
        );
      }

      // 6. Link company to user in MongoDB
      try {
        userDoc.companyId = String(company._id);
        await userDoc.save();
      } catch (linkError: any) {
        this.logger.error(
          `Failed to link user to company: ${linkError.message}`,
          linkError.stack,
        );
        // Rollback all
        await this.rollbackFirebaseUser(userRecord.uid);
        await this.rollbackMongoUser(userDoc._id);
        await this.rollbackCompany(company._id);
        throw new InternalServerErrorException(
          'Failed to complete account setup. Please try again.',
        );
      }

      // 7. Set custom claims (admin, companyId)
      try {
        const companyId = String(company._id);
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          admin: true,
          role: 'admin',
          companyId,
        });
        this.logger.log(`Custom claims set for user: ${userRecord.uid}`);
      } catch (claimsError: any) {
        this.logger.error(
          `Failed to set custom claims: ${claimsError.message}`,
          claimsError.stack,
        );
        // Don't rollback - user can still login, just without claims
        // Admin can manually fix this
      }

      // 8. Send welcome email to user (non-blocking)
      this.sendWelcomeEmailAsync(body.email, body.companyName);

      // 9. Send notification email to admin (non-blocking)
      this.sendAdminNotificationAsync(
        body.email,
        body.companyName,
        body.fullName,
      );

      this.logger.log(`Signup completed successfully for: ${body.email}`);

      // 10. Return user and company info
      return {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
        },
        company: {
          id: String(company._id),
          companyName: company.companyName,
        },
      };
    } catch (error) {
      // If error is already a NestJS HttpException, re-throw it
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Otherwise, log and throw generic error
      this.logger.error(
        `Unexpected error during signup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again.',
      );
    }
  }

  /**
   * Validates signup input
   */
  private validateSignupInput(body: SignupBody): void {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Password validation
    if (!body.password || body.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    // Company name validation
    if (!body.companyName || body.companyName.trim().length === 0) {
      throw new BadRequestException('Company name is required');
    }

    if (body.companyName.trim().length > 100) {
      throw new BadRequestException(
        'Company name must not exceed 100 characters',
      );
    }

    // Full name validation (optional field)
    if (body.fullName && body.fullName.trim().length > 100) {
      throw new BadRequestException('Full name must not exceed 100 characters');
    }
  }

  /**
   * Rollback Firebase user creation
   */
  private async rollbackFirebaseUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      this.logger.warn(`Rolled back Firebase user: ${uid}`);
    } catch (error) {
      this.logger.error(
        `Failed to rollback Firebase user ${uid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Rollback MongoDB user creation
   */
  private async rollbackMongoUser(userId: any): Promise<void> {
    try {
      await this.userModel.findByIdAndDelete(userId);
      this.logger.warn(`Rolled back MongoDB user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to rollback MongoDB user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Rollback company creation
   */
  private async rollbackCompany(companyId: any): Promise<void> {
    try {
      await this.companyModel.findByIdAndDelete(companyId);
      this.logger.warn(`Rolled back company: ${companyId}`);
    } catch (error) {
      this.logger.error(
        `Failed to rollback company ${companyId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Send welcome email asynchronously (non-blocking)
   */
  private sendWelcomeEmailAsync(email: string, companyName: string): void {
    this.emailService
      .sendSignupWelcomeEmail({ to: email, companyName })
      .then(() => {
        this.logger.log(`Welcome email sent to: ${email}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to send welcome email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error instanceof Error ? error.stack : undefined,
        );
      });
  }

  /**
   * Send admin notification email asynchronously (non-blocking)
   */
  private sendAdminNotificationAsync(
    userEmail: string,
    companyName: string,
    fullName?: string,
  ): void {
    this.emailService
      .sendSignupNotificationToAdmin({ userEmail, companyName, fullName })
      .then(() => {
        this.logger.log(`Admin notification sent for signup: ${userEmail}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to send admin notification for ${userEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error instanceof Error ? error.stack : undefined,
        );
      });
  }

  async changePassword(user: RequestingUser, body: ChangePasswordBody) {
    this.logger.log(`Password change attempt for user: ${user.uid}`);

    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new BadRequestException(
        'Current password and new password are required',
      );
    }

    if (newPassword.length < 6) {
      throw new BadRequestException(
        'New password must be at least 6 characters',
      );
    }

    // Get user email from token
    const email = user.email;
    if (!email) {
      this.logger.error(`User email not found in token for UID: ${user.uid}`);
      throw new UnauthorizedException('User email not found in token');
    }

    // Verify the current password
    try {
      const FIREBASE_API_KEY =
        this.configService.get<string>('FIREBASE_API_KEY');

      if (!FIREBASE_API_KEY) {
        this.logger.error('Firebase API key not configured');
        throw new InternalServerErrorException(
          'Authentication service is not properly configured',
        );
      }

      // Use Firebase Auth REST API to verify current password
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email,
          password: currentPassword,
          returnSecureToken: true,
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message;

        if (
          errorMessage === 'INVALID_LOGIN_CREDENTIALS' ||
          errorMessage === 'INVALID_PASSWORD' ||
          errorMessage === 'EMAIL_NOT_FOUND'
        ) {
          this.logger.warn(`Invalid current password for user: ${user.uid}`);
          throw new UnauthorizedException('Current password is incorrect');
        }
      }

      this.logger.error(
        `Failed to verify current password: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Failed to verify current password',
      );
    }

    // Update the password
    try {
      await admin.auth().updateUser(user.uid, {
        password: newPassword,
      });

      this.logger.log(`Password updated successfully for user: ${user.uid}`);

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update password for user ${user.uid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async createUser(
    requestingUser: RequestingUser,
    body: { email: string; role?: 'admin' | 'user'; employeeCode?: string },
  ) {
    const companyId = this.ensureAdmin(requestingUser);

    if (!body.email) {
      throw new BadRequestException('Email is required');
    }

    const normalizedEmail = body.email.trim().toLowerCase();
    const role: 'admin' | 'user' = body.role === 'admin' ? 'admin' : 'user';
    const employeeCode =
      role === 'user' && body.employeeCode
        ? body.employeeCode.trim() || undefined
        : undefined;

    const existingUser = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    const temporaryPassword = this.generateRandomPassword();
    let userRecord;

    if (existingUser) {
      if (existingUser.companyId && existingUser.companyId !== companyId) {
        throw new ConflictException('User with this email already exists');
      }

      if (!existingUser.deletedAt) {
        throw new ConflictException('User with this email already exists');
      }

      try {
        await admin.auth().updateUser(existingUser.uid, {
          password: temporaryPassword,
          disabled: false,
        });
        userRecord = await admin.auth().getUser(existingUser.uid);
      } catch (error) {
        userRecord = await admin.auth().createUser({
          email: normalizedEmail,
          password: temporaryPassword,
        });
        existingUser.uid = userRecord.uid;
      }

      existingUser.companyId = companyId;
      existingUser.role = role;
      existingUser.admin = role === 'admin';
      existingUser.disabled = false;
      existingUser.deletedAt = null;
      if (employeeCode !== undefined) {
        existingUser.employeeCode = employeeCode;
      }
      await existingUser.save();
    } else {
      userRecord = await admin.auth().createUser({
        email: normalizedEmail,
        password: temporaryPassword,
      });

      await this.userModel.create({
        uid: userRecord.uid,
        email: normalizedEmail,
        companyId,
        admin: role === 'admin',
        role,
        disabled: false,
        deletedAt: null,
        employeeCode,
      });
    }

    const claims = {
      admin: role === 'admin',
      role,
      companyId,
    };
    await admin.auth().setCustomUserClaims(userRecord.uid, claims);

    const company = await this.companyModel.findById(companyId).lean();

    await this.emailService.sendUserWelcomeEmail({
      to: normalizedEmail,
      temporaryPassword,
      companyName: company?.companyName ?? 'Ops-log',
      role,
    });

    return {
      uid: userRecord.uid,
      email: normalizedEmail,
      role,
      disabled: false,
      employeeCode: employeeCode ?? null,
    };
  }

  private generateRandomPassword(length = 12) {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$';
    const bytes = randomBytes(length);
    const password = Array.from(bytes)
      .map((byte) => chars[byte % chars.length])
      .join('');
    return password;
  }

  private ensureAdmin(requestingUser?: Partial<RequestingUser>): string {
    if (!requestingUser) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!requestingUser.admin) {
      throw new ForbiddenException('Only admins can perform this action');
    }

    if (!requestingUser.companyId) {
      throw new BadRequestException('Company information missing');
    }

    return requestingUser.companyId;
  }

  private formatUserResponse(
    user: Pick<
      User,
      'uid' | 'email' | 'role' | 'admin' | 'disabled' | 'employeeCode'
    > & {
      deletedAt?: Date | null;
    },
  ) {
    return {
      uid: user.uid,
      email: user.email,
      role: user.role,
      admin: user.admin,
      disabled: user.disabled ?? false,
      deletedAt: user.deletedAt ?? null,
      employeeCode: user.employeeCode ?? null,
    };
  }

  async listUsers(requestingUser: RequestingUser) {
    const companyId = this.ensureAdmin(requestingUser);
    const users = await this.userModel.find({ companyId }).lean();

    return users
      .filter((user) => !user.deletedAt)
      .map((user) =>
        this.formatUserResponse({
          uid: user.uid,
          email: user.email,
          role: user.role,
          admin: user.admin,
          disabled: user.disabled ?? false,
          deletedAt: user.deletedAt ?? null,
          employeeCode: user.employeeCode,
        }),
      );
  }

  async listCompanyUsers(companyId: string) {
    const users = await this.userModel
      .find({
        companyId,
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        disabled: { $ne: true },
      })
      .lean();

    return users.map((user) =>
      this.formatUserResponse({
        uid: user.uid,
        email: user.email,
        role: user.role,
        admin: user.admin,
        disabled: user.disabled ?? false,
        employeeCode: user.employeeCode,
        deletedAt: user.deletedAt ?? null,
      }),
    );
  }

  async updateUser(
    requestingUser: RequestingUser,
    uid: string,
    body: { role?: 'admin' | 'user'; disabled?: boolean },
  ) {
    const companyId = this.ensureAdmin(requestingUser);
    const userDoc = await this.userModel.findOne({
      uid,
      companyId,
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!userDoc) {
      throw new NotFoundException('User not found');
    }

    let claimsNeedUpdate = false;

    if (body.role && ['admin', 'user'].includes(body.role)) {
      userDoc.role = body.role;
      userDoc.admin = body.role === 'admin';
      claimsNeedUpdate = true;
    }

    if (typeof body.disabled === 'boolean') {
      userDoc.disabled = body.disabled;
      await admin.auth().updateUser(uid, { disabled: body.disabled });
    }

    await userDoc.save();

    if (claimsNeedUpdate) {
      await admin.auth().setCustomUserClaims(uid, {
        admin: userDoc.admin,
        role: userDoc.role,
        companyId,
      });
    }

    return this.formatUserResponse(userDoc);
  }

  async deleteUser(requestingUser: RequestingUser, uid: string) {
    const companyId = this.ensureAdmin(requestingUser);

    if (requestingUser.uid === uid) {
      throw new BadRequestException('You cannot remove your own account');
    }

    const userDoc = await this.userModel.findOne({
      uid,
      companyId,
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!userDoc) {
      throw new NotFoundException('User not found');
    }

    userDoc.deletedAt = new Date();
    userDoc.disabled = true;
    await userDoc.save();

    await admin.auth().updateUser(uid, { disabled: true });

    return { success: true };
  }

  async resetUserPassword(requestingUser: RequestingUser, uid: string) {
    const companyId = this.ensureAdmin(requestingUser);

    const userDoc = await this.userModel.findOne({
      uid,
      companyId,
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!userDoc) {
      throw new NotFoundException('User not found');
    }

    const temporaryPassword = this.generateRandomPassword();

    await admin.auth().updateUser(uid, {
      password: temporaryPassword,
      disabled: false,
    });

    const company = await this.companyModel.findById(companyId).lean();

    await this.emailService.sendUserPasswordResetEmail({
      to: userDoc.email,
      temporaryPassword,
      companyName: company?.companyName ?? 'Ops-log',
      role: userDoc.role,
    });

    return { success: true };
  }
}
