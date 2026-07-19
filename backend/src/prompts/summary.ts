import type { ParsedResume } from '../types/index.js'

export function buildSummaryPrompt(resume: ParsedResume): string {
  return `You are an expert resume reviewer. Analyze the following resume and provide a professional summary, strengths, weaknesses, and improvement suggestions.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "summary": "2-3 sentence professional summary of the candidate",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`
}
