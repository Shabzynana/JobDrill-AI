import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Question } from 'src/QnA/entities/question.entity';

export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
}

interface ChatPair {
  prompt: string;
  response: any;
}

export const generateSessionHistory = (questions: Question[]) => {
  const chatPairs: ChatPair[] = [];

  for (const q of questions) {
    if (q.answer) {
      chatPairs.push({
        prompt: q.content,
        response: q.answer.content,
      });
    }
  }

  const formattedMessages = chatPairs.flatMap((pair) => [
    { role: Role.USER, content: pair.prompt },
    { role: Role.ASSISTANT, content: pair.response },
  ]);

  return formattedMessages;
};

export const generateInterviewSessionHistory = (session: Partial<InterviewSession>) => {
  const chatPairs: ChatPair[] = [];
  if (!Array.isArray(session.questions)) return [];

  for (const q of session.questions) {
    if (q.answer) {
      chatPairs.push({
        prompt: q.content,
        response: {
          answer: q.answer.content,
          feedback: q.answer.feedback || '',
          score: typeof q.answer.score === 'number' ? `${q.answer.score}/10` : null,
        },
      });
    } else {
      chatPairs.push({
        prompt: q.content,
        response: '',
      });
    }
  }

  const formattedMessages = chatPairs.flatMap((pair) => [
    { role: Role.ASSISTANT, content: pair.prompt },
    { role: Role.USER, content: pair.response || '' },
  ]);

  return formattedMessages;
};
