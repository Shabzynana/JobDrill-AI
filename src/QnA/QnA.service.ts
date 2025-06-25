import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateSessionHistory } from 'src/common/chat/chatHistory';
import { MAX_QUESTIONS_PER_SESSION } from 'src/common/constants';
import { evaluateAnswerPerosna, evaluateAnswerPrompt, generalPersona, nextQuestionPersona } from 'src/common/persona/general';
import { GroqService } from 'src/groq/groq.service';
import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { InterviewsService } from 'src/interviews/interviews.service';
import { Repository } from 'typeorm';
import { updateQuestionDto } from './dto/qna.dto';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QnAService {

    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        private groqService: GroqService,
        @Inject(forwardRef(() => InterviewsService))
        private interviewService: InterviewsService,
    ) {}

    async getQuestionById(Id: string) {
        const question = await this.questionRepository.findOne({
            where: {
                id: Id
            },
            relations: {
                answer: true
            }
        });
        return question;
    }

    async getAnswerById(Id: string) {
        const answer = await this.answerRepository.findOne({
            where: {
                id: Id
            }
        });
        return answer;
    }

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

    async updateQuestion(dto: updateQuestionDto, question: Question) {
        
        const existingQuestion = await this.getQuestionById(question.id);
        if (!existingQuestion) {
            throw new NotFoundException('Question not found');
        }
        const updateQuestion = Object.assign(existingQuestion, dto);
        return await this.questionRepository.save(updateQuestion);
    }

    async updateAnswer(dto: updateQuestionDto, answer: Answer) {

        const existingAnswer = await this.getAnswerById(answer.id);
        if (!existingAnswer) {
            throw new NotFoundException('Answer not found');
        }
        const updateAnswer = Object.assign(existingAnswer, dto);
        return await this.answerRepository.save(updateAnswer);        
    }

    async evaluateAnswer(question: string, answer: string, history: any) {

        const prompt = evaluateAnswerPrompt(question, answer);
        const response = await this.groqService.generateAnswer(prompt, evaluateAnswerPerosna, history);
    
        const scoreMatch = response.match(/Score:\s*(\d+)/i);
        const feedbackMatch = response.match(/Feedback:\s*([\s\S]*)/i);
        
        const score = scoreMatch ? Number(scoreMatch[1]) : 0;
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback';
    
        return { score, feedback };
    }

    private buildNextQuestionPrompt(history: { question: string; answer: string }[]) {
        const historyText = history
          .map(q => `Q: ${q.question}\nA: ${q.answer}`)
          .join('\n\n');
    
        return nextQuestionPersona(historyText);
    }

    async nextQuestion(sessionId: string, history: any) {
        const session = await this.interviewService.getInterviewSession(sessionId);
        if (!session) throw new NotFoundException('Session not found');

        if (session.questions.length >= MAX_QUESTIONS_PER_SESSION) {
            throw new BadRequestException('Maximum questions reached');
        }
        const allQnA = session.questions.map(q => ({
          question: q.content,
          answer: q.answer?.content || '',
        }));

        const sessionHistory = generateSessionHistory(session.questions || []);

        const prompt = this.buildNextQuestionPrompt(allQnA);
        const newQuestion = await this.groqService.generateQuestion(prompt, generalPersona, sessionHistory);
        const savedQuestion = await this.createQuestion(newQuestion, session);
    
        return { 
            id: savedQuestion.id,
            question: savedQuestion.content
        };
    }



}
