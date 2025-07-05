import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroqService } from 'src/groq/groq.service';
import { Repository } from 'typeorm';
import {
  InterviewDto,
  nextQuestionDto,
  startInterviewDto,
  SubmitAnswerDto,
} from './dto/interview.dto';
import { Answer } from '../QnA/entities/answer.entity';
import { InterviewSession } from './entities/interview.entity';
import { Question } from '../QnA/entities/question.entity';
import {
  generateSessionHistory,
  generateInterviewSessionHistory,
  Role,
} from 'src/common/chat/chatHistory';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { QnAService } from 'src/QnA/QnA.service';
import {
  generalPersona,
} from 'src/common/persona/general';
import { generateJobResponsibilityPrompt, generaterolePrompt } from 'src/common/persona/prompt';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(InterviewSession)
    private readonly interviewRepository: Repository<InterviewSession>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly groqService: GroqService,
    private readonly userService: UserService,
    private readonly qnAService: QnAService,
  ) {}

  async startInterviewSessionWithGroq(
    dto: InterviewDto,
    userId: string,
  ) {
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
      response = await this.groqService.getChatCompletion(
        generaterolePrompt(dto.role),
        generalPersona,
        sessionHistory,
      );
    }

    if (response) {
      question = await this.qnAService.createQuestion(response, interview);
    } else {
      const lastQuestion = interview.questions.find((q) => !q.answer);
      if (lastQuestion) {
        question = lastQuestion;
      }
    }
    if (dto.answer) {
      answer = await this.qnAService.createAnswer(dto.answer, question);
      const grade = await this.qnAService.evaluateAnswer(
        question.content,
        answer.content,
        sessionHistory,
      );
      if (grade) {
        await this.qnAService.updateAnswer(
          { score: grade.score, feedback: grade.feedback },
          answer,
        );
        const next = await this.qnAService.nextQuestion(interview.id);
        console.log(next, 'next');
      }
    }

    const chatHistory = await this.getInterviewSession(interview.id);

    const me = generateInterviewSessionHistory(chatHistory);
    return me;
  }

  async startInterview(dto: startInterviewDto, userId: string) {
    let interview: InterviewSession;
    let question: Question;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.sessionId) {
      interview = await this.getInterviewSession(dto.sessionId);
    } else {
      interview = await this.createInterview(dto, user.id);
    }

    if (dto.role || dto.jobResponsibilities || dto.jobSkills) {
      const response = await this.groqService.generateQuestion(
        generaterolePrompt(dto.role, dto.jobResponsibilities, dto.jobSkills),
        generalPersona,
      );
      if (response) {
        question = await this.qnAService.createQuestion(response, interview);
      }
    }

    const chatHistory = await this.getInterviewSession(interview.id);
    return {
      sessionId: interview.id,
      role: interview.role,
      jobResponsibilities: interview.jobResponsibilities,
      jobSkills: interview.jobSkills,
      question: {
        id: question.id,
        content: question.content,
      }
    };
  }

  async submitAnswer(dto: SubmitAnswerDto, userId: string) {
    let question: Question;
    let answer: Answer;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const interview = await this.getInterviewSession(dto.sessionId);
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    question = interview.questions.find((q) => q.id === dto.questionId);
    if (!question) {
      question = await this.qnAService.getQuestionById(dto.questionId);
    }

    const sessionHisory = generateSessionHistory(interview.questions || []);
    if (dto.answer) {
      answer = await this.qnAService.createAnswer(dto.answer, question);
      const grade = await this.qnAService.evaluateAnswer(
        question.content,
        answer.content,
        sessionHisory,
      );
      if (grade) {
        answer = await this.qnAService.updateAnswer(
          { score: grade.score, feedback: grade.feedback },
          answer,
        );
      }
    }

    const chatHistory = await this.getInterviewSession(interview.id);
    return {
      sessionId: interview.id,
      role: interview.role,
      jobResponsibilities: interview.jobResponsibilities,
      jobSkills: interview.jobSkills,
      question: {
        id: question.id,
        content: question.content,
      },
      answer: {
        id: answer.id,
        content: answer.content,
        score: answer.score,
        feedback: answer.feedback,
      }
    };
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

    const next = await this.qnAService.nextQuestion(interview.id);
    if (!next) {
      throw new NotFoundException('No more questions');
    }

    const chatHistory = await this.getInterviewSession(interview.id);
    return {
      sessionId: interview.id,
      role: interview.role,
      jobResponsibilities: interview.jobResponsibilities,
      jobSkills: interview.jobSkills,
      question: {
        id: next.id,
        content: next.question,
      }
    };
  }

  async getInterviewSession(id: string): Promise<InterviewSession> {
    return await this.interviewRepository.findOne({
      where: { id: id },
      relations: ['user', 'questions', 'questions.answer'],
      select: {
        id: true,
        role: true,
        jobResponsibilities: true,
        jobSkills: true,
        questions: {
          id: true,
          content: true,
          answer: {
            id: true,
            content: true,
            score: true,
            feedback: true,
          },
        },
        user: {
          id: true,
        },
      },
    });
  }

  async getInterviewSessionFormatted(id: string) {
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
        id: true,
        role: true,
        jobResponsibilities: true,
        jobSkills: true,
        created_at: true,
        questions: {
          id: true,
          content: true,
          answer: {
            id: true,
            content: true,
            score: true,
            feedback: true,
          },
        },
        user: {
          id: true,
        },
      },
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

  async deleteInterview(id: string, userId: string) {

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const interview = await this.getInterviewSession(id);
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this interview');
    }
    return await this.interviewRepository.remove(interview);
  }
}
