import type { ParsedResume, EducationEntry, ExperienceEntry, ProjectEntry } from '../types/index.js'

const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/g
const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
const URL_RE = /https?:\/\/[^\s]+/g
const LINKEDIN_RE = /linkedin\.com\/[^\s]+/i
const GITHUB_RE = /github\.com\/[^\s]+/i

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

const DEGREE_KEYWORDS = [
  'bachelor', 'b.s.', 'b.a.', 'b.e.', 'b.tech',
  'master', 'm.s.', 'm.a.', 'm.b.a.', 'm.tech', 'm.e.',
  'phd', 'ph.d.', 'doctorate', 'doctor',
  'associate', 'a.s.', 'a.a.',
  'high school', 'diploma',
]

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december'
const MONTHS_SHORT = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
const DATE_RE = new RegExp(
  `(${MONTHS}|${MONTHS_SHORT})\\s*(20\\d{2}|\\d{2})|(20\\d{2}|\\d{2})`,
  'gi',
)

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_RE)
  return matches || []
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_RE)
  return matches || []
}

function extractUrls(text: string): string[] {
  const matches = text.match(URL_RE)
  return matches || []
}

function extractLinkedIn(text: string): string | null {
  const match = text.match(LINKEDIN_RE)
  return match ? match[0].replace(/[^a-zA-Z0-9/.:-]/g, '') : null
}

function extractGithub(text: string): string | null {
  const match = text.match(GITHUB_RE)
  return match ? match[0].replace(/[^a-zA-Z0-9/.:-]/g, '') : null
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase()
  const found = new Set<string>()

  for (const skill of COMMON_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(lower)) {
      found.add(skill)
    }
  }

  return Array.from(found).sort()
}

function splitIntoSections(text: string): Map<string, string> {
  const sections = new Map<string, string>()
  const sectionHeaders = [
    'education', 'experience', 'work experience', 'employment',
    'projects', 'skills', 'technical skills', 'certifications',
    'languages', 'achievements', 'awards', 'publications',
    'summary', 'objective', 'profile', 'about me',
  ]

  const headerPattern = new RegExp(
    `^(${sectionHeaders.join('|')})\\s*:?\\s*$`,
    'im',
  )

  let currentHeader = 'header'
  let currentContent: string[] = []

  const lines = text.split('\n')
  for (const line of lines) {
    const match = line.match(headerPattern)
    if (match) {
      if (currentContent.length > 0) {
        sections.set(currentHeader, currentContent.join('\n').trim())
      }
      currentHeader = match[1].trim().toLowerCase()
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }

  if (currentContent.length > 0) {
    sections.set(currentHeader, currentContent.join('\n').trim())
  }

  return sections
}

function extractEducation(text: string): EducationEntry[] {
  const entries: EducationEntry[] = []
  const sections = splitIntoSections(text)
  const eduText = sections.get('education') || text
  const lines = eduText.split('\n').filter((l) => l.trim())

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const hasDegree = DEGREE_KEYWORDS.some((d) => line.toLowerCase().includes(d))

    if (hasDegree || line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('school')) {
      const entry: EducationEntry = {
        institution: line,
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      }

      if (hasDegree) {
        const degreeMatch = DEGREE_KEYWORDS.find((d) => line.toLowerCase().includes(d))
        if (degreeMatch) {
          entry.degree = degreeMatch
          entry.field = line.replace(new RegExp(degreeMatch, 'i'), '').replace(/[,\s]+/g, ' ').trim()
        }
      }

      const dateMatch = eduText.match(DATE_RE)
      if (dateMatch) {
        const dates = dateMatch.filter((d) => d.length >= 4)
        if (dates.length > 0) entry.startDate = dates[0]
        if (dates.length > 1) entry.endDate = dates[1]
      }

      const gpaMatch = eduText.match(/(\d\.\d{1,2})\s*\/?\s*(4\.0|5\.0)?/g)
      if (gpaMatch) {
        entry.gpa = gpaMatch[0].trim()
      }

      entries.push(entry)
    }
  }

  return entries
}

function extractExperience(text: string): ExperienceEntry[] {
  const entries: ExperienceEntry[] = []
  const sections = splitIntoSections(text)
  const expText = sections.get('experience') || sections.get('work experience') || sections.get('employment') || text
  const lines = expText.split('\n').filter((l) => l.trim())

  let current: ExperienceEntry | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const hasDate = /\b(20\d{2}|19\d{2})\b/.test(trimmed)
    const looksLikeHeader = hasDate || /^(at|@)\s/i.test(trimmed) || current === null

    if (looksLikeHeader && (trimmed.length > 5 || hasDate)) {
      if (current) entries.push(current)

      current = {
        company: trimmed,
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        description: [],
      }

      const dateMatches = trimmed.match(/(20\d{2}|19\d{2})/g)
      if (dateMatches) {
        current.startDate = dateMatches[0] || ''
        current.endDate = dateMatches[1] || (trimmed.toLowerCase().includes('present') ? 'Present' : '')
      }
    } else if (current && trimmed.length > 0) {
      if (!current.role && trimmed.length < 100) {
        current.role = trimmed
      } else {
        current.description.push(trimmed)
      }
    }
  }

  if (current) entries.push(current)

  return entries
}

function extractProjects(text: string): ProjectEntry[] {
  const entries: ProjectEntry[] = []
  const sections = splitIntoSections(text)
  const projText = sections.get('projects') || text
  const lines = projText.split('\n').filter((l) => l.trim())

  let current: ProjectEntry | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.length < 100 && /^[A-Z]/.test(trimmed) && !trimmed.endsWith('.') && !trimmed.startsWith('http')) {
      if (current) entries.push(current)
      current = {
        name: trimmed.replace(/^[•\-*]\s*/, ''),
        description: '',
        technologies: [],
        url: '',
      }
    } else if (current) {
      if (!current.description) {
        current.description = trimmed
      }
      const urls = extractUrls(trimmed)
      if (urls.length > 0 && !current.url) {
        current.url = urls[0]
      }
    }
  }

  if (current) entries.push(current)

  return entries
}

function extractCertifications(text: string): string[] {
  const sections = splitIntoSections(text)
  const certText = sections.get('certifications') || ''
  if (!certText) return []
  return certText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !l.startsWith('certification'))
}

function extractLanguages(text: string): string[] {
  const sections = splitIntoSections(text)
  const langText = sections.get('languages') || ''
  if (!langText) return []
  return langText
    .split('\n')
    .map((l) => l.trim().replace(/^[•\-*\d.]+\s*/, '').split(/[,(]/)[0].trim())
    .filter((l) => l.length > 1)
}

function extractAchievements(text: string): string[] {
  const sections = splitIntoSections(text)
  const achText = sections.get('achievements') || sections.get('awards') || ''
  if (!achText) return []
  return achText
    .split('\n')
    .map((l) => l.trim().replace(/^[•\-*\d.]+\s*/, ''))
    .filter((l) => l.length > 5)
}

function extractName(text: string): string | null {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l)

  for (const line of lines.slice(0, 5)) {
    if (
      line.length > 2 &&
      line.length < 60 &&
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !URL_RE.test(line) &&
      /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line)
    ) {
      return line
    }
  }

  return null
}

function extractLocation(text: string): string | null {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l)
  for (const line of lines.slice(0, 10)) {
    if (
      (line.includes(',') || /\b(CA|NY|TX|FL|IL|WA|MA|OR|CO|GA|PA|OH|MI|NC|NJ|VA|AZ|MN|IN|MO|WI|MD|TN|AL|SC|LA|KY|OR|OK|CT|IA|MS|AR|KS|UT|NV|NM|WV|NE|ID|HI|ME|NH|MT|RI|DE|SD|ND|VT|DC|AK|WY)\b/.test(line)) &&
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line)
    ) {
      return line
    }
  }
  return null
}

export function parseResumeText(text: string): ParsedResume {
  const emails = extractEmails(text)
  const phones = extractPhones(text)
  const urls = extractUrls(text)

  return {
    name: extractName(text),
    email: emails[0] || null,
    phone: phones[0] || null,
    location: extractLocation(text),
    linkedIn: extractLinkedIn(text) || urls.find((u) => u.toLowerCase().includes('linkedin')) || null,
    github: extractGithub(text) || urls.find((u) => u.toLowerCase().includes('github')) || null,
    portfolio: urls.find((u) => !u.toLowerCase().includes('linkedin') && !u.toLowerCase().includes('github')) || null,
    skills: extractSkills(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    projects: extractProjects(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
    achievements: extractAchievements(text),
  }
}
