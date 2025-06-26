import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QnAService } from './QnA.service';

@Controller('qn-a')
export class QnAController {
  constructor(private readonly qnAService: QnAService) {}
}
