import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        path: {
          type: 'string',
          example: 'company-logos/mylogo.png',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Body('path') path: string) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!path) throw new BadRequestException('No path provided');
    const url = await this.firebaseStorageService.uploadFile(
      file.buffer,
      path,
      file.mimetype,
    );
    return { url };
  }
}
