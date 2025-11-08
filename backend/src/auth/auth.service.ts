import { Injectable, HttpException } from '@nestjs/common';
import admin from './firebase-init';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../company/company.schema';
import { User } from './user.schema';

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
}
