import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from '../auth/firebase-init';

@Injectable()
export class FirebaseStorageService {
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'FIREBASE_STORAGE_BUCKET',
    )!;
  }

  async uploadFile(
    fileBuffer: Buffer,
    filePath: string,
    contentType: string,
  ): Promise<string> {
    try {
      const bucket = admin.storage().bucket(this.bucketName);
      const file = bucket.file(filePath);
      await file.save(fileBuffer, {
        metadata: { contentType },
        public: true,
      });
      console.log('File uploaded to Firebase Storage:', filePath);
      return file.publicUrl();
    } catch (error: unknown) {
      let errorMessage = '';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message?: unknown }).message);
      }
      throw new InternalServerErrorException(
        'Failed to upload file to Firebase Storage',
        errorMessage,
      );
    }
  }
}
