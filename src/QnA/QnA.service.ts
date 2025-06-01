import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QnAService {

    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
    ) {}

    async createQuestion(prompt: string, interview: InterviewSession) {

        const question = new Question();
        question.content = prompt;
        question.session = interview;
        return await this.questionRepository.save(question);
    }

    async createAnswer(response: string, question: Question) {

        const answer = new Answer();
        answer.content = response;
        answer.question = question;
        const savedAnswer = await this.answerRepository.save(answer);

        question.answer = savedAnswer;
        await this.questionRepository.save(question);
        return savedAnswer;
    }



}
