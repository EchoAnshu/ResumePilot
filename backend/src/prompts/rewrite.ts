import type { ParsedResume } from '../types/index.js'

export function buildRewritePrompt(resume: ParsedResume): string {
  return `You are a professional resume writer. Rewrite the following resume to be more impactful, ATS-friendly, and professionally formatted.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "rewrittenResume": "the complete rewritten resume text",
  "changes": ["change1", "change2", "change3"]
}`
}
