import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class GroqService {
  private readonly groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async getChatCompletion(
    prompt: string,
    systemPrompt: string,
    history: any[] = [],
  ): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...history,
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-70b-8192',
    });
    // console.log(completion.choices[0]?.message);

    const response = completion.choices[0]?.message?.content || '';
    return AppUtilities.cleanText(response);
  }

  async generateQuestion(prompt: string, systemPrompt: string, history?: any) {
    return await this.getChatCompletion(prompt, systemPrompt, history);
  }

  // async generateNextQuestion(prompt: string, systemPrompt: string, history?: any) {
  //   return await this.getChatCompletion(prompt, systemPrompt, history);
  // }

  async generateAnswer(prompt: string, systemPrompt: string, history?: any) {
    return await this.getChatCompletion(prompt, systemPrompt, history);
  }

  a;
}
