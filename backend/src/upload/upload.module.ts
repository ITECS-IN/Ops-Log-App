import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [FirebaseStorageService],
  exports: [],
})
export class UploadModule {}
