import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, Res } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewDto } from './dto/interview.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @ApiQuery({ name: 'sessionId', required: false, type: String })
  @Post('start-with-groq')
  async startInterviewSessionWithGroq(@Body() dto: InterviewDto, @Req() req, @Query('sessionId') sessionId?: string) {
  
    const { sub } = req.user;
    dto.sessionId = sessionId;
    return await this.interviewsService.startInterviewSessionWithGroq(dto, sub);
  }

  @ApiQuery({ name: 'sessionId', required: false, type: String })
  @Post('start')
  async startInterviewSession(@Body() dto: InterviewDto, @Req() req, @Query('sessionId') sessionId?: string) {
  
    const { sub } = req.user;
    dto.sessionId = sessionId;
    return await this.interviewsService.startInterview(dto, sub);
  }

  @Post('submit-answer')
  async submitAnswer(@Body() dto: InterviewDto, @Req() req, @Query('sessionId') sessionId?: string) {
  
    const { sub } = req.user;
    dto.sessionId = sessionId;
    return await this.interviewsService.submitAnswer(dto, sub);
  }
  
  @ApiBody({ type: InterviewDto, required: false })
  @Post('next-question')
  async nextQuestion(@Req() req, @Body() dto?: InterviewDto, @Query('sessionId') sessionId?: string) {

    const { sub } = req.user;
    dto.sessionId = sessionId;
    return await this.interviewsService.nextQuestion(dto, sub);
  }





 
}
