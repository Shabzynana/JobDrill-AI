import { Module } from '@nestjs/common';
import { QnAService } from './QnA.service';
import { QnAController } from './QnA.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { GroqService } from 'src/groq/groq.service';
import { InterviewsService } from 'src/interviews/interviews.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSession, Question, Answer, User])],
  controllers: [QnAController],
  providers: [QnAService, GroqService, InterviewsService, UserService],
})
export class QnAModule {}
