import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroqService } from './groq.service';

@Controller('groq')
export class GroqController {
  constructor(private readonly groqService: GroqService) {}
}
