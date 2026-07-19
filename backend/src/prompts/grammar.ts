import type { ParsedResume } from '../types/index.js'

export function buildGrammarPrompt(resume: ParsedResume): string {
  return `You are a professional grammar reviewer. Review the following resume text for grammar, spelling, and punctuation errors.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "issues": [
    { "original": "text with error", "correction": "corrected text", "explanation": "why it was wrong" }
  ],
  "overallAssessment": "brief assessment of overall grammar quality"
}`
}
