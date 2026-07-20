import type { ParsedResume, JdMatchResult } from '../../types/index.js'

const COMMON_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
  'swift', 'kotlin', 'php', 'scala', 'react', 'angular', 'vue', 'node.js', 'express',
  'django', 'flask', 'spring', 'rails', 'laravel', 'next.js', 'nuxt', 'svelte',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd',
  'git', 'github', 'gitlab', 'bitbucket',
  'rest', 'graphql', 'grpc', 'api',
  'agile', 'scrum', 'jira', 'confluence',
  'machine learning', 'deep learning', 'nlp', 'data science', 'ai',
  'communication', 'leadership', 'teamwork', 'problem solving',
]

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
  'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'it', 'its',
  'we', 'you', 'they', 'he', 'she', 'him', 'her', 'his', 'their', 'them',
  'our', 'your', 'my', 'me', 'all', 'each', 'every', 'both', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'above',
  'after', 'again', 'against', 'below', 'between', 'during', 'out',
  'over', 'through', 'under', 'up', 'while', 'because', 'before',
  'if', 'also', 'into', 'like', 'then', 'there', 'where', 'which',
  'who', 'whom', 'why', 'how', 'what', 'when', 'here', 'well',
])

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractKeywords(text: string): Set<string> {
  const words = normalize(text).split(/\s+/)
  const keywords = new Set<string>()

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.length < 2 || STOP_WORDS.has(word) || /^\d+$/.test(word)) continue

    keywords.add(word)

    if (i + 1 < words.length) {
      const bigram = `${word} ${words[i + 1]}`
      if (!STOP_WORDS.has(words[i + 1])) {
        keywords.add(bigram)
      }
    }
  }

  return keywords
}

function findSkills(text: string): Set<string> {
  const lower = text.toLowerCase()
  const found = new Set<string>()

  for (const skill of COMMON_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(lower)) {
      found.add(skill)
    }
  }

  return found
}

function generateSuggestions(
  missingSkills: string[],
  matchingSkills: string[],
  matchPercentage: number,
  resume: ParsedResume,
): string[] {
  const suggestions: string[] = []

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5)
    suggestions.push(`Add these missing skills to your resume: ${topMissing.join(', ')}`)
  }

  if (matchPercentage < 50) {
    suggestions.push('Your resume has low match with this job description. Consider highlighting relevant experience.')
  }

  const resumeSkillsLower = resume.skills.map((s) => s.toLowerCase())
  const missingFromResume = missingSkills.filter((s) => !resumeSkillsLower.includes(s.toLowerCase()))
  if (missingFromResume.length > 0) {
    suggestions.push(`Consider gaining experience in: ${missingFromResume.slice(0, 3).join(', ')}`)
  }

  if (matchingSkills.length > 0 && matchingSkills.length < 3) {
    suggestions.push('Tailor your skills section to better match the job requirements.')
  }

  if (resume.experience.length === 0) {
    suggestions.push('Add work experience relevant to the job description.')
  }

  return suggestions
}

export function matchResumeWithJd(
  resume: ParsedResume,
  jdText: string,
): JdMatchResult {
  const jdSkills = findSkills(jdText)
  const resumeSkills = new Set(resume.skills.map((s) => s.toLowerCase()))

  resume.education.forEach((e) => {
    const skills = findSkills(`${e.institution} ${e.degree} ${e.field}`)
    skills.forEach((s) => resumeSkills.add(s))
  })

  resume.experience.forEach((e) => {
    const text = `${e.company} ${e.role} ${e.description.join(' ')}`
    const skills = findSkills(text)
    skills.forEach((s) => resumeSkills.add(s))
  })

  resume.projects.forEach((p) => {
    const text = `${p.name} ${p.description} ${p.technologies.join(' ')}`
    const skills = findSkills(text)
    skills.forEach((s) => resumeSkills.add(s))
  })

  resume.certifications.forEach((c) => {
    const skills = findSkills(c)
    skills.forEach((s) => resumeSkills.add(s))
  })

  const matchingSkills = [...jdSkills].filter((s) => resumeSkills.has(s)).sort()
  const missingSkills = [...jdSkills].filter((s) => !resumeSkills.has(s)).sort()

  const jdKeywords = extractKeywords(jdText)
  const resumeText = [
    resume.name || '',
    ...resume.skills,
    ...resume.education.map((e) => `${e.institution} ${e.degree} ${e.field}`),
    ...resume.experience.flatMap((e) => [e.company, e.role, ...e.description]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
    ...resume.certifications,
    ...resume.languages,
    ...resume.achievements,
  ].join(' ')
  const resumeKeywords = extractKeywords(resumeText)

  const matchingKeywords = [...jdKeywords].filter((k) => resumeKeywords.has(k)).sort()
  const missingKeywords = [...jdKeywords].filter((k) => !resumeKeywords.has(k)).sort()

  const skillMatch = jdSkills.size > 0
    ? Math.round((matchingSkills.length / jdSkills.size) * 100)
    : 0

  const keywordMatch = jdKeywords.size > 0
    ? Math.round((matchingKeywords.length / jdKeywords.size) * 100)
    : 0

  const matchPercentage = Math.round(skillMatch * 0.6 + keywordMatch * 0.4)

  const suggestions = generateSuggestions(missingSkills, matchingSkills, matchPercentage, resume)

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    matchingKeywords: matchingKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    keywordMatchPercentage: keywordMatch,
    suggestions,
    jdText,
    createdAt: new Date().toISOString(),
  }
}
