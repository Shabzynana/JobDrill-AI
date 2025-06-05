import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroqService } from 'src/groq/groq.service';
import { Repository } from 'typeorm';
import { InterviewDto } from './dto/interview.dto';
import { Answer } from '../QnA/entities/answer.entity';
import { InterviewSession } from './entities/interview.entity';
import { Question } from '../QnA/entities/question.entity';
import { generateSessionHistory, generateInterviewSessionHistory, Role } from 'src/common/chat/chatHistory';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { QnAService } from 'src/QnA/QnA.service';
import { generalPersona, generaterolePrompt } from 'src/common/persona/general';

@Injectable()
export class InterviewsService {

    constructor (
        @InjectRepository(InterviewSession)
        private readonly interviewRepository: Repository<InterviewSession>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        private readonly groqService: GroqService,
        private readonly userService: UserService,
        private readonly qnAService: QnAService
    ) {}

    // async startInterviewSessionWithGroq(dto: InterviewDto, userId: string):Promise<{ role: Role; content: string }[]> {
        
    //     let interview: InterviewSession;
    //     const user = await this.userService.getUserById(userId);
    //     if (!user) {
    //         throw new NotFoundException('User not found');
    //     }    

    //     if (dto.sessionId) {
    //         interview = await this.getInterviewSession(dto.sessionId);
    //     } else {
    //         interview = await this.startInterview(dto, userId);
    //     }
  
    //     const sessionHistory = generateSessionHistory(interview.questions || []);
    //     const response = await this.groqService.getChatCompletion(dto.prompt, generalPersona, sessionHistory);
    //     if (response) {
    //         const question = await this.qnAService.createQuestion(dto.prompt, interview);
    //         await this.qnAService.createAnswer(response, question);
    //     }
    
    //     const chatHistory = await this.getInterviewSession(interview.id);
    //     return generateInterviewSessionHistory(chatHistory);
        
    // }

    async startInterviewSessionWithGroq(dto: InterviewDto, userId: string):Promise<{ role: Role; content: string }[]> {
        
        let interview: InterviewSession;
        let question: Question;
        let answer: Answer;
        let response: string;
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }    

        if (dto.sessionId) {
            interview = await this.getInterviewSession(dto.sessionId);
        } else {
            interview = await this.createInterview(dto, userId);
        }
  
        const sessionHistory = generateSessionHistory(interview.questions || []);
        if (dto.role) {
            response = await this.groqService.getChatCompletion(generaterolePrompt(dto.role), generalPersona, sessionHistory);
        }
        
        if (response) {
            question = await this.qnAService.createQuestion(response, interview);
        } else {
            const lastQuestion = interview.questions.find(q => !q.answer);
            if (lastQuestion) {
                question = lastQuestion;
            }
        }
        if (dto.answer) {
            answer = await this.qnAService.createAnswer(dto.answer, question);
            const grade = await this.qnAService.evaluateAnswer(question.content, answer.content, sessionHistory);
            if (grade) {
                await this.qnAService.updateAnswer({ score: grade.score, feedback: grade.feedback }, answer);
                const next = await this.qnAService.nextQuestion(interview.id, sessionHistory);
                console.log(next, 'next')
            }            
        }
        
        const chatHistory = await this.getInterviewSession(interview.id);
        
        const me = generateInterviewSessionHistory(chatHistory);
        return me;
        
    }

    async startInterview(dto: InterviewDto, userId: string) {

        let interview : InterviewSession;
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (dto.sessionId) {
            interview = await this.getInterviewSession(dto.sessionId);
        } else {
            interview = await this.createInterview(dto, userId);
        }
        
        if (dto.role) {
            const response = await this.groqService.generateQuestion(generaterolePrompt(dto.role), generalPersona);
            if (response) {
                const question = await this.qnAService.createQuestion(response, interview);
            }
        }
        const chatHistory = await this.getInterviewSession(interview.id);

        return {
            id: interview.id,
            role: interview.role,
            history: generateInterviewSessionHistory(chatHistory),
        }
        
    }

    async submitAnswer(dto: InterviewDto, userId: string) {

        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const interview = await this.getInterviewSession(dto.sessionId);
        if (!interview) {
            throw new NotFoundException('Interview not found');
        }

        const lastQuestion = interview.questions.find(q => !q.answer);
        if (!lastQuestion) {
            throw new NotFoundException('No more questions');
        }
        
        const sessionHisory = generateSessionHistory(interview.questions || []);
        if (dto.answer) {
            const answer = await this.qnAService.createAnswer(dto.answer, lastQuestion);
            const grade = await this.qnAService.evaluateAnswer(lastQuestion.content, answer.content, sessionHisory);
            if (grade) {
                await this.qnAService.updateAnswer({ score: grade.score, feedback: grade.feedback }, answer);
            }
        }
        
        const chatHistory = await this.getInterviewSession(interview.id);
        return {
            id: interview.id,
            role: interview.role,
            history: generateInterviewSessionHistory(chatHistory),
        }
        
    }

    async nextQuestion(dto: InterviewDto, userId: string) {
        
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const interview = await this.getInterviewSession(dto.sessionId);
        if (!interview) {
            throw new NotFoundException('Interview not found');
        }
        
        const sessionHisory = generateSessionHistory(interview.questions || []);
        const next = await this.qnAService.nextQuestion(interview.id, sessionHisory);
        if (!next) {
            throw new NotFoundException('No more questions');
        }
        
        const chatHistory = await this.getInterviewSession(interview.id);
        return {
            id: interview.id,
            role: interview.role,
            history: generateInterviewSessionHistory(chatHistory),
        }
    }
        

    async getInterviewSession(id: string): Promise<InterviewSession> {
       return  await this.interviewRepository.findOne({ 
            where: { id: id },
            relations: ['user', 'questions', 'questions.answer'],
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                }
            } 
        });
    }

    async getAllInterviews(): Promise<InterviewSession[]> {
        return await this.interviewRepository.find();
    }

    async getAllUserInterviews(userId: string): Promise<InterviewSession[]> {
        
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }    
        return await this.interviewRepository.find({ 
            where: { user: user },
            relations: ['user', 'questions', 'questions.answer'],
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                }
            } 
        });
    }

    async createInterview(dto: InterviewDto, userId: string) {

        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }    
        const interview = new InterviewSession();
        interview.user = user as User;
        interview.role = dto.role || null;
        interview.jobDescription = [];
        interview.skills = [];
        return await this.interviewRepository.save(interview);

    }

    


  
}
