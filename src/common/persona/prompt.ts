export const generaterolePrompt = (
  role: string, 
  jobResponsibility?: string[], 
  skill?: string[],
  experienceLevel?: string,
  difficulty?: string,
): string => {
    
    const jobDescText = jobResponsibility?.length
      ? `The job responsibilities include: ${jobResponsibility.join(', ')}.`
      : '';

    const skillText = skill?.length
      ? `Focus on incorporating the following skills or competencies into the question: ${skill.join(', ')}.`
      : '';

    const experienceText = experienceLevel
      ? `Target the question at a ${experienceLevel}-level candidate.`
      : '';
      
    const difficultyText = difficulty
      ? `The question should be of ${difficulty} difficulty.`
      : '';  
  
    return (
      `Generate an interview question for the role of ${role}.${experienceText}${difficultyText}${skillText}${jobDescText} The question should assess the candidate's suitability for the position.`
    ).trim();
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
    experienceLevel?: string,
    difficulty?: string,
  ): string => {
  
    const context = [
      role ? `Role: ${role}` : '',
      jobResponsibilities?.length ? `Responsibilities: ${jobResponsibilities.join(', ')}` : '',
      skills?.length ? `Skills: ${skills.join(', ')}` : '',
      experienceLevel ? `Level: ${experienceLevel}` : '',
      difficulty ? `Difficulty: ${difficulty}` : '',
    ].filter(Boolean).join('\n');

    return `
      You are conducting a technical interview.

      ${context}

      Here is the conversation history so far:
      ${history}

      Based on the history and context, do one of the following:
      - Ask a relevant follow-up question if the last answer was unclear, shallow, or missed important aspects.
      - Otherwise, move on to a new topic aligned with the role, responsibilities, or skills.

      Generate the **next best** interview question. Keep it clear, concise, and focused on evaluating the candidate’s knowledge or problem-solving ability.
      Respond with **only the question** — no explanations, no commentary.
    `.trim();
};


export const evaluateAnswerPrompt = (question: string, answer: string) =>
  `
    Question: "${question}"
    Answer: "${answer}"

    Evaluate the answer for relevance, clarity, completeness, and correctness.

    Give a score out of 10 and brief feedback.

    Format:
    Score: <number>
    Feedback: <text>
  `.trim();


export const shouldFollowUpPrompt = (question: string, answer: string) => `
  Based on the following:

  Question: ${question}
  Answer: ${answer}

  Should the interviewer ask a follow-up question or move on?

  Respond with one word only: "follow-up" or "move-on"
`.trim();

export const generateFollowUpPrompt = (
  question: string,
  answer: string,
  role?: string,
  experienceLevel?: 'entry' | 'mid' | 'senior',
  difficulty?: 'basic' | 'intermediate' | 'advanced',
  ): string => `
  The interviewer previously asked:
  "${question}"

  The candidate responded:
  "${answer}"

  Ask a follow-up question to dig deeper or clarify.

  Role: ${role ?? 'N/A'}
  Level: ${experienceLevel ?? 'N/A'}
  Difficulty: ${difficulty ?? 'N/A'}

  Respond with only the follow-up question.
`.trim();


  