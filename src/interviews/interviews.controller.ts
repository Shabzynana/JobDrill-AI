import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewDto } from './dto/interview.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@ApiBearerAuth()
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'sessionId', required: false, type: String })
  @Post('start-with-groq')
  async startInterviewSessionWithGroq(@Body() dto: InterviewDto,  @Req() req, @Query('sessionId') sessionId?: string) {
  
    const { sub } = req.user;
    dto.sessionId = sessionId;
    return await this.interviewsService.startInterviewSessionWithGroq(dto, sub);
  }

 
}
