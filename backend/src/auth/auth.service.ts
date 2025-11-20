import { Injectable, HttpException } from '@nestjs/common';
import admin from './firebase-init';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../company/company.schema';
import { User } from './user.schema';
import axios from 'axios';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

type RequestingUser = {
  uid?: string;
  admin?: boolean;
  companyId?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async signup(body: { email: string; password: string; companyName: string }) {
    // 1. Check if email already exists in MongoDB
    const existingUser = await this.userModel
      .findOne({ email: body.email })
      .exec();
    // Debug logs removed for production
    if (existingUser !== null) {
      throw new HttpException('Email already exists', 409);
    }

    // 2. Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email: body.email,
      password: body.password,
    });

    // 3. Create user document in MongoDB (without companyId yet)
    const userDoc = await this.userModel.create({
      uid: userRecord.uid,
      email: userRecord.email,
      admin: true,
      role: 'admin',
      disabled: false,
      deletedAt: null,
    });

    // 4. Create company in MongoDB
    const company = await this.companyModel.create({
      companyName: body.companyName,
    });

    // 5. Link company to user in MongoDB
    userDoc.companyId = String(company._id);
    await userDoc.save();

    // 6. Set custom claims (admin, companyId)
    const companyId = String(company._id);
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin',
      companyId,
    });

    // 7. Return user and company info
    return {
      user: userRecord,
      company,
      userDoc,
    };
  }

  async changePassword(
    user: any,
    body: { currentPassword: string; newPassword: string },
  ) {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      throw new HttpException(
        'Current password and new password are required',
        400,
      );
    }

    if (newPassword.length < 6) {
      throw new HttpException(
        'New password must be at least 6 characters',
        400,
      );
    }

    // Get the user's email from the decoded token
    const email = user.email;
    if (!email) {
      throw new HttpException('User email not found in token', 401);
    }

    // Verify the current password by attempting to sign in
    try {
      const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
      if (!FIREBASE_API_KEY) {
        throw new HttpException('Firebase API key not configured', 500);
      }

      // Use Firebase Auth REST API to verify current password
      const signInResponse = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email,
          password: currentPassword,
          returnSecureToken: true,
        },
      );

      if (!signInResponse.data.idToken) {
        throw new HttpException('Current password is incorrect', 401);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.data?.error?.message === 'INVALID_LOGIN_CREDENTIALS' ||
          error.response?.data?.error?.message === 'INVALID_PASSWORD'
        ) {
          throw new HttpException('Current password is incorrect', 401);
        }
      }
      throw new HttpException('Failed to verify current password', 500);
    }

    // Update the password using Firebase Admin SDK
    try {
      await admin.auth().updateUser(user.uid, {
        password: newPassword,
      });

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new HttpException('Failed to update password', 500);
    }
  }

  async createUser(
    requestingUser: RequestingUser,
    body: { email: string; role?: 'admin' | 'user'; employeeCode?: string },
  ) {
    const companyId = this.ensureAdmin(requestingUser);

    if (!body.email) {
      throw new HttpException('Email is required', 400);
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
        throw new HttpException('User with this email already exists', 409);
      }

      if (!existingUser.deletedAt) {
        throw new HttpException('User with this email already exists', 409);
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

    const company = await this.companyModel
      .findById(companyId)
      .lean();

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

  private ensureAdmin(requestingUser?: RequestingUser) {
    if (!requestingUser?.admin) {
      throw new HttpException('Only admins can perform this action', 403);
    }

    if (!requestingUser.companyId) {
      throw new HttpException('Company information missing', 400);
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
          employeeCode: user.employeeCode ?? null,
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
      throw new HttpException('User not found', 404);
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
      throw new HttpException('You cannot remove your own account', 400);
    }

    const userDoc = await this.userModel.findOne({
      uid,
      companyId,
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!userDoc) {
      throw new HttpException('User not found', 404);
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
      throw new HttpException('User not found', 404);
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
