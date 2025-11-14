import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinesModule } from './lines/lines.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MachinesModule } from './machines/machines.module';
import { OperatorsModule } from './operators/operators.module';
import { RecordsModule } from './records/records.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { FirebaseAuthMiddleware } from './auth/firebase-auth.middleware';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      retryAttempts: 5,
    }),
    LinesModule,
    MachinesModule,
    OperatorsModule,
    RecordsModule,
    AppModule,
    DashboardModule,
    CompanyModule,
    AuthModule,
    AnalyticsModule,
    UploadModule,
    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes(
        { path: '/records', method: RequestMethod.ALL },
        { path: '/records/*', method: RequestMethod.ALL },
        { path: '/lines', method: RequestMethod.ALL },
        { path: '/machines', method: RequestMethod.ALL },
        { path: '/operators', method: RequestMethod.ALL },
        { path: '/dashboard/*', method: RequestMethod.ALL },
        { path: '/company', method: RequestMethod.ALL },
        { path: '/analytics/*', method: RequestMethod.ALL },
      );
  }
}
