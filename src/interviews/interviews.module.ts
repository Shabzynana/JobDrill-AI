import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSession } from './entities/interview.entity';
import { Question } from '../QnA/entities/question.entity';
import { Answer } from '../QnA/entities/answer.entity';
import { GroqService } from 'src/groq/groq.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { QnAService } from 'src/QnA/QnA.service';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSession, Question, Answer, User, Token])],
  controllers: [InterviewsController],
  providers: [InterviewsService, GroqService, UserService, QnAService],
})
export class InterviewsModule {}
