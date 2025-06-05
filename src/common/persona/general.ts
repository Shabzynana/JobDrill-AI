export const generalPersona = ` You are an interviewer.`;

// export const generaterolePrompt = (role, skill?) => `Ask a technical interview question for the role: ${role}`;
export const generaterolePrompt = (role: string, skill?: string[]): string => {
    const skillText = skill?.length
      ? ` Focus on the following skills: ${skill.join(', ')}.`
      : '';
    
    return `Ask a technical interview question for the role: ${role}.${skillText}`;
  };
// export const generateJobDescriptionPrompt = (jobDescription, skill?) => `You are an interviewee. Your job description is "${jobDescription}".`;
export const generateJobDescriptionPrompt = (jobDescription: string[], skill?: string[]): string => {
    const jobDescText = jobDescription?.length
    ? `Your job description includes: ${jobDescription.join(', ')}.`
    : '';
    const skillText = skill?.length
    ? ` Focus on your skills related to: ${skill.join(', ')}.`
    : '';
    return `Ask a technical interview question for this job description: ${jobDescText}${skillText}`.trim();
  };
export const evaluateAnswerPerosna = 'You are an evaluator.';

export const nextQuestionPersona = (history: any) => `You are conducting a technical interview. Based on this conversation: ${history} Ask the another or next relevant technical question. Only return the question.`

export const evaluateAnswerPrompt = (question: string, answer: string) => `
Question: "${question}"
Answer: "${answer}"

Give a score out of 10 and short feedback.

Format:
Score: <number>
Feedback: <text>
    `.trim();
