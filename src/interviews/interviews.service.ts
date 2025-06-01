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
import { generalPersona } from 'src/common/persona/general';

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
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }    

        if (dto.sessionId) {
            interview = await this.getInterviewSession(dto.sessionId);
        } else {
            interview = await this.startInterview(dto, userId);
        }
  
        const sessionHistory = generateSessionHistory(interview.questions || []);
        const response = await this.groqService.getChatCompletion(dto.prompt, generalPersona, sessionHistory);
        if (response) {
            const question = await this.qnAService.createQuestion(dto.prompt, interview);
            await this.qnAService.createAnswer(response, question);
        }
    
        const chatHistory = await this.getInterviewSession(interview.id);
        return generateInterviewSessionHistory(chatHistory);
        
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

    async startInterview(dto: InterviewDto, userId: string) {

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
