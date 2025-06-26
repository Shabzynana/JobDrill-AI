import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TransciptionDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file to transcribe',
  })
  file: any;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Language code (ISO-639-1)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  language?: string;
}
