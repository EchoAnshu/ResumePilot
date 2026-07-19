import type { ParsedResume } from '../types/index.js'

export function buildBulletsPrompt(resume: ParsedResume): string {
  return `You are a resume writing expert. Improve the following experience bullet points to be more impactful, quantified, and professional.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "improvements": [
    { "original": "original bullet text", "improved": "improved bullet text", "reason": "why this is better" }
  ]
}`
}
