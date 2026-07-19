import type { ParsedResume } from '../types/index.js'

export function buildProjectsPrompt(resume: ParsedResume): string {
  return `You are a project description expert. Improve the project descriptions to be more compelling, technical, and impact-focused.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, no extra text:
{
  "improvements": [
    {
      "projectName": "project name",
      "original": "original description",
      "improved": "improved description with metrics and impact",
      "suggestedTechnologies": ["tech1", "tech2"]
    }
  ]
}`
}
