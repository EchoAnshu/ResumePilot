import type { ParsedResume } from '../types/index.js'

export function buildTonePrompt(resume: ParsedResume): string {
  return `You are a professional writing coach. Assess the professional tone of the following resume and suggest improvements.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "assessment": "overall assessment of the resume's professional tone",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`
}
