import { Injectable, HttpException } from '@nestjs/common';
import admin from './firebase-init';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../company/company.schema';
import { User } from './user.schema';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
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
    });

    // 4. Create company in MongoDB
    const company = await this.companyModel.create({
      companyName: body.companyName,
    });

    // 5. Link company to user in MongoDB
    userDoc.companyId = String(company._id);
    await userDoc.save();

    // 6. Set custom claims (admin, companyId)
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      companyId: String(company._id),
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
}
