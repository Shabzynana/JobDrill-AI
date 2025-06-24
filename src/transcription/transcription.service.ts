import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import * as FormData from 'form-data';
import axios, { Axios } from 'axios';
import { file_type } from 'src/common/constants';
import { TransciptionDto } from './dto/transciption';

@Injectable()
export class TranscriptionService {

    private openai = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
    });
    private GROQ_API_URL: string;
    private API_KEY: string;

    constructor (
        private configService: ConfigService,
    ){  
        this.API_KEY = this.configService.get('groq.apiKey');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        this.GROQ_API_URL = this.configService.get('groq.transcription_url');
    }

    async transcribeAudio(file: Express.Multer.File, dto: TransciptionDto) {
        
        if (!file) throw new BadRequestException('No file uploaded');
        if (!file_type.includes(file.mimetype)) {
            throw new BadRequestException('File type not supported');
        }

        try {
            const formData = new FormData();
        
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            if (dto.language) {
                formData.append('language', dto.language);
            }
            formData.append('model', 'whisper-large-v3-turbo');
            formData.append('response_format', 'verbose_json');

            const response = await axios.post(this.GROQ_API_URL, formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${this.API_KEY}`,
                },
            });

            return {
                text: response.data.text || response.data,
                language: response.data.language
            }    
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 413) {
                throw new Error('File too large. Maximum file size is 25MB.');
            }
            throw error;
        }
    }
  
}
