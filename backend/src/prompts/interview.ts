import type { ParsedResume } from '../types/index.js'

export function buildInterviewPrompt(resume: ParsedResume): string {
  return `You are an interview coach. Based on the following resume, generate relevant interview questions that the candidate is likely to face.

For each section (general, technical, behavioral, experience-based), provide questions that test the candidate's knowledge based on their specific skills, projects, and experience.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "general": [
    { "question": "Tell me about yourself.", "focus": "Overall background and career narrative" }
  ],
  "technical": [
    { "question": "Specific technical question based on resume skills", "focus": "Skill or technology being assessed" }
  ],
  "behavioral": [
    { "question": "Behavioral question based on experience", "focus": "Competency being evaluated" }
  ],
  "experienceBased": [
    { "question": "Question about a specific project or role", "focus": "Project or experience being discussed" }
  ]
}

Generate at least 2 questions per category, more if the resume has extensive details.`
}
