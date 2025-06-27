import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionController } from './transcription.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  ],
  controllers: [TranscriptionController],
  providers: [TranscriptionService],
})
export class TranscriptionModule {}
