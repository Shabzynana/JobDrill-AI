export const generalPersona = `You are a seasoned hiring manager, and I need your expertise to craft a set of insightful interview questions that effectively assess candidates' skills, experience, and cultural fit for a high-performance team. Only return the question without any additional commentary or explanation.`;

export const generaterolePrompt = (role: string, skill?: string[]): string => {
  const skillText = skill?.length
    ? ` Incorporate the following skills or expertise into the question: ${skill.join(', ')}.`
    : '';

  return `Generate a thoughtful and relevant interview question tailored specifically this role: ${role}.${skillText}`;
};

export const generateJobResponsibilityPrompt = (
  jobResponsibility: string[],
  skill?: string[],
): string => {
  const jobDescText = jobResponsibility?.length
    ? `the job Responsibilities includes: ${jobResponsibility.join(', ')}.`
    : '';

  const skillText = skill?.length
    ? ` Incorporate the following skills or expertise into the question: ${skill.join(', ')}.`
    : '';

  return `Generate a thoughtful and relevant interview question: ${jobDescText}${skillText}`.trim();
};

export const evaluateAnswerPerosna = `You are an expert interviewer with deep experience in evaluating responses. Please assess this candidate's answer for clarity, relevance, and depth, and provide constructive feedback to improve their performance and do not make the feedback sound like a question.`;

export const nextQuestionPersona = (history: any) =>
  `You are conducting a technical interview. Based on the conversation history provided: ${history}, analyze the candidate's previous answers and ask the next most relevant and insightful technical question that advances the interview. Ensure the question is clear, concise, and focused on assessing the candidate’s knowledge and problem-solving skills in the relevant technical domain. Only return the question without any additional commentary or explanation.`;

export const evaluateAnswerPrompt = (question: string, answer: string) =>
  `
Question: "${question}"
Answer: "${answer}"

Give a score out of 10 and short feedback.

Format:
Score: <number>
Feedback: <text>
    `.trim();
