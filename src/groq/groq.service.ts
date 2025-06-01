import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class GroqService {
  
  private readonly groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async getChatCompletion(prompt: string, systemPrompt: string, history: any ): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        ...history,
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-70b-8192',
    });
    console.log(completion.choices[0]?.message);

    return completion.choices[0]?.message?.content || '';
  }
}
