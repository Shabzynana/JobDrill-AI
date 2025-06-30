export const generaterolePrompt = (role: string, skill?: string[]): string => {
    const skillText = skill?.length
      ? ` Focus on incorporating the following skills or competencies into the question: ${skill.join(', ')}.`
      : '';
  
    return `Generate a thoughtful and relevant interview question tailored specifically this role: ${role}.${skillText} The question should evaluate the candidate's suitability for this position.`.trim();
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

    return `Generate a thoughtful and relevant interview question: ${jobDescText}${skillText} The question should assess the candidate’s fit for the role.`.trim();
};


export const nextQuestionPrompt = (
    history: string,
    role?: string,
    jobResponsibilities?: string[],
    skills?: string[],
  ): string => {
  
    const roleText = role
      ? `\n\nThe role you are interviewing for is: ${role}.`
      : '';
  
    const responsibilitiesText = jobResponsibilities?.length
      ? `\n\nThe job responsibilities you are interviewing for includes: ${jobResponsibilities.join(', ')}.`
      : '';
  
    const skillsText = skills?.length
      ? `\n\nKey skills or competencies required includes: ${skills.join(', ')}.`
      : '';
  
    return `
      You are conducting a technical interview, ${roleText}.${responsibilitiesText}${skillsText}
      
      Here is the conversation history so far:
      
      ${history}
      
      Based on this context, decide whether to ask a follow-up question (if the last answer needs deeper exploration), or move to a new topic relevant to the role, responsibilities, or skills provided.
      
      Generate the most relevant and insightful question next. The question should be clear, concise, and focused on evaluating the candidate’s knowledge or problem-solving skills.
      
      Respond with only the question — no commentary, no explanation.
    `.trim();
};

export const evaluateAnswerPrompt = (question: string, answer: string) =>
  `
Question: "${question}"
Answer: "${answer}"

Give a score out of 10 and short feedback.

Format:
Score: <number>
Feedback: <text>
    `.trim();

  