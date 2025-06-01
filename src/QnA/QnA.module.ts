import { Module } from '@nestjs/common';
import { QnAService } from './QnA.service';
import { QnAController } from './QnA.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSession, Question, Answer])],
  controllers: [QnAController],
  providers: [QnAService],
})
export class QnAModule {}
