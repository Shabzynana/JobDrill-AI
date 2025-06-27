import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroqService } from 'src/groq/groq.service';
import { Repository } from 'typeorm';
import { InterviewDto, nextQuestionDto, startInterviewDto, SubmitAnswerDto } from './dto/interview.dto';
import { Answer } from '../QnA/entities/answer.entity';
import { InterviewSession } from './entities/interview.entity';
import { Question } from '../QnA/entities/question.entity';
import { generateSessionHistory, generateInterviewSessionHistory, Role } from 'src/common/chat/chatHistory';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { QnAService } from 'src/QnA/QnA.service';
import { generalPersona, generateJobResponsibilityPrompt, generaterolePrompt } from 'src/common/persona/general';

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

    async startInterview(dto: startInterviewDto, userId: string) {

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
        
        if (dto.role || dto.jobSkills) {
            const response = await this.groqService.generateQuestion(generaterolePrompt(dto.role, dto.jobSkills), generalPersona);
            if (response) {
                const question = await this.qnAService.createQuestion(response, interview);
            }
        } else if (dto.jobResponsibilities || dto.jobSkills) {
            const response = await this.groqService.generateQuestion(generateJobResponsibilityPrompt(dto.jobResponsibilities, dto.jobSkills), generalPersona);
            if (response) {
                const question = await this.qnAService.createQuestion(response, interview);
            } 
        }

        const chatHistory = await this.getInterviewSession(interview.id);
        return {
            id: interview.id,
            role: interview.role,
            jobResponsibilities: interview.jobResponsibilities,
            jobSkills: interview.jobSkills,
            history: generateInterviewSessionHistory(chatHistory),
        }
        
    }

    async submitAnswer(dto: SubmitAnswerDto, userId: string) {

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
            jobResponsibilities: interview.jobResponsibilities,
            jobSkills: interview.jobSkills,
            history: generateInterviewSessionHistory(chatHistory),
        }
        
    }

    async nextQuestion(dto: nextQuestionDto, userId: string) {
        
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
            jobResponsibilities: interview.jobResponsibilities,
            jobSkills: interview.jobSkills,
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

    async getInterviewChatHistory(id: string) {
        
        const interview = await this.getInterviewSession(id);
        if (!interview) {
            throw new NotFoundException('Interview not found');
        }
        return generateInterviewSessionHistory(interview);
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
        interview.jobResponsibilities = dto.jobResponsibilities || null;
        interview.jobSkills = dto.jobSkills || null;
        return await this.interviewRepository.save(interview);

    }

    


  
}
