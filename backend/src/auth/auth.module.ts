import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CompanyModule } from '../company/company.module';

import { Company, CompanySchema } from '../company/company.schema';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    CompanyModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
