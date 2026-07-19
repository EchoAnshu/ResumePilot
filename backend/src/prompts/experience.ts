import type { ParsedResume } from '../types/index.js'

export function buildExperiencePrompt(resume: ParsedResume): string {
  return `You are a career coach. Improve the experience descriptions to better highlight achievements, leadership, and impact.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "improvements": [
    {
      "role": "job role",
      "original": "original description",
      "improved": "improved description with quantified impact and leadership"
    }
  ]
}`
}
