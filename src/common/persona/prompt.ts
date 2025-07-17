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

      Your job is to decide whether a follow-up question is necessary or not based on the candidate's most recent answer.
      If the last answer requires clarification or deeper insight, ask one follow-up question.

      However:
      - Ask **only one follow-up** per topic.
      - If a follow-up has already been asked for that topic, move on.
      - Do not stay on the same topic for more than one follow-up, even if the candidate's response is weak.
      - If no follow-up is necessary, ask a question that introduces a new topic based on the job role, responsibilities, or skills.

      Your response should be **only the next question**, clearly worded, and technically relevant. Do not explain or add commentary.
    `.trim();
};

// Based on the history and context, do one of the following:
//       - Ask a relevant follow-up question if the last answer was unclear, shallow, or missed important aspects.
//       - Otherwise, move on to a new topic aligned with the role, responsibilities, or skills.

//       Generate the **next best** interview question. Keep it clear, concise, and focused on evaluating the candidate’s knowledge or problem-solving ability.
//       Respond with **only the question** — no explanations, no commentary.


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


  export const finalSummaryPrompt = (history: string) => `
  Here is a transcript of an interview between a candidate and an interviewer:
  Analyze each answer to question and feedback well in the interview transcript.
  
  ${history}
  
  Give a summary of the conversation in the following format:
  - Candidate's strengths
  - Candidate's weaknesses
  - Topics they performed well on
  - Topics they need to improve
  - Final score out of 100

  Use a friendly and helpful tone.

  Title your summary "Interview Aseessment Summary"
  
  `.trim();




  