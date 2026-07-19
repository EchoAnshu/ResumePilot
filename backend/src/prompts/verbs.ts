import type { ParsedResume } from '../types/index.js'

export function buildVerbsPrompt(resume: ParsedResume): string {
  return `You are a resume writing expert. Review the following resume and suggest stronger action verbs to replace weak or passive language.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "suggestions": [
    { "original": "weak verb or phrase", "suggested": "stronger action verb or phrase" }
  ]
}`
}
