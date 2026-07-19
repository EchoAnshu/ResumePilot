import type { ParsedResume } from '../types/index.js'

export function buildCareerPrompt(resume: ParsedResume): string {
  return `You are a career advisor. Based on the following resume, suggest potential career paths, identify skill gaps, and provide career recommendations.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "suggestedRoles": ["role1", "role2", "role3"],
  "skillGaps": ["gap1", "gap2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`
}
