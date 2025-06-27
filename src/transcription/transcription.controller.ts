import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { TransciptionDto } from './dto/transciption';

@Controller('transcription')
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post('audio-transcribe')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async transcribe(@UploadedFile() file: Express.Multer.File, @Body() dto: TransciptionDto) {
    const response = await this.transcriptionService.transcribeAudio(file, dto);
    return response;
  }
}
