import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { Record, RecordSchema } from './schemas/record.schema';
import { UploadModule } from '../upload/upload.module';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    UploadModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService, FirebaseStorageService],
  exports: [RecordsService],
})
export class RecordsModule {}
