import type { ParsedResume, AtsScore } from '../../types/index.js'
import { ATS_WEIGHTS } from '../../constants/index.js'

const ACTION_VERBS = new Set([
  'achieved', 'improved', 'trained', 'managed', 'created', 'developed',
  'led', 'designed', 'implemented', 'increased', 'reduced', 'built',
  'delivered', 'established', 'launched', 'optimized', 'generated',
  'resolved', 'coordinated', 'conducted', 'performed', 'produced',
  'published', 'negotiated', 'organized', 'directed', 'oversaw',
  'supervised', 'spearheaded', 'transformed', 'accelerated', 'strengthened',
  'expanded', 'initiated', 'introduced', 'pioneered', 'restructured',
  'consolidated', 'streamlined', 'automated', 'deployed', 'migrated',
  'architected', 'configured', 'facilitated', 'mentored', 'presented',
])

function scoreContact(resume: ParsedResume): number {
  let count = 0
  if (resume.name) count++
  if (resume.email) count++
  if (resume.phone) count++
  if (resume.location) count++
  if (resume.linkedIn) count++
  if (resume.github) count++
  if (resume.portfolio) count++
  return Math.round((count / 7) * 100)
}

function scoreSkills(resume: ParsedResume): number {
  const count = resume.skills.length
  if (count >= 10) return 100
  if (count >= 7) return 80
  if (count >= 5) return 60
  if (count >= 3) return 40
  if (count >= 1) return 20
  return 0
}

function scoreExperience(resume: ParsedResume): number {
  const entries = resume.experience
  if (entries.length === 0) return 0

  const scores = entries.map((entry) => {
    let score = 0
    if (entry.role) score += 25
    if (entry.company) score += 25
    if (entry.startDate) score += 15
    if (entry.endDate) score += 10
    if (entry.description.length > 0) {
      score += Math.min(entry.description.length * 10, 25)
    }
    return Math.min(score, 100)
  })

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const bonus = Math.min(entries.length - 1, 2) * 5
  return Math.min(Math.round(avg + bonus), 100)
}

function scoreProjects(resume: ParsedResume): number {
  const entries = resume.projects
  if (entries.length === 0) return 0

  const scores = entries.map((entry) => {
    let score = 0
    if (entry.name) score += 30
    if (entry.description) score += 30
    if (entry.technologies.length > 0) score += 20
    if (entry.url) score += 20
    return Math.min(score, 100)
  })

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const bonus = Math.min(entries.length - 1, 2) * 5
  return Math.min(Math.round(avg + bonus), 100)
}

function scoreEducation(resume: ParsedResume): number {
  const entries = resume.education
  if (entries.length === 0) return 0

  const scores = entries.map((entry) => {
    let score = 0
    if (entry.institution) score += 30
    if (entry.degree) score += 30
    if (entry.field) score += 15
    if (entry.startDate || entry.endDate) score += 15
    if (entry.gpa) score += 10
    return Math.min(score, 100)
  })

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg)
}

function scoreKeywords(resume: ParsedResume): number {
  const totalWords = [
    resume.name || '',
    ...resume.skills,
    ...resume.education.map((e) => [e.institution, e.degree, e.field].join(' ')),
    ...resume.experience.flatMap((e) => [e.company, e.role, ...e.description]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
    ...resume.certifications,
    ...resume.languages,
  ].join(' ').split(/\s+/).length

  const skillScore = Math.min(resume.skills.length * 7, 60)
  const densityScore = totalWords > 0
    ? Math.min(Math.round((resume.skills.length / totalWords) * 500), 40)
    : 0

  return Math.min(skillScore + densityScore, 100)
}

function scoreFormatting(resume: ParsedResume): number {
  let score = 0
  if (resume.education.length > 0) score += 15
  if (resume.experience.length > 0) score += 20
  if (resume.projects.length > 0) score += 15
  if (resume.skills.length > 0) score += 15
  const hasSections = resume.education.length > 0 || resume.experience.length > 0
    || resume.projects.length > 0 || resume.skills.length > 0
  if (hasSections) score += 20

  const allText = JSON.stringify(resume).toLowerCase()
  const hasBullets = allText.includes('•') || allText.includes('- ') || /•|-/.test(allText)
  if (hasBullets) score += 15
  return Math.min(score, 100)
}

function scoreReadability(resume: ParsedResume): number {
  const allDescriptions = resume.experience.flatMap((e) => e.description).join(' ')
  const words = allDescriptions.split(/\s+/)
  const totalWords = words.length

  if (totalWords === 0 && resume.projects.length === 0) return 10

  if (totalWords === 0) {
    const projDesc = resume.projects.filter((p) => p.description).length
    return Math.min(projDesc * 25, 50)
  }

  let score = 10

  const verbCount = words.filter((w) => ACTION_VERBS.has(w.toLowerCase())).length
  score += Math.min(verbCount * 10, 30)

  const quantified = allDescriptions.match(/\d+/g)
  if (quantified) {
    score += Math.min(quantified.length * 5, 20)
  }

  const bulletCount = (allDescriptions.match(/[•\-]/g) || []).length
  score += Math.min(bulletCount * 5, 20)

  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / totalWords
  if (avgWordLength > 3 && avgWordLength < 8) score += 10

  const bulletLines = resume.experience.filter((e) =>
    e.description.some((d) => d.startsWith('•') || d.startsWith('-')),
  ).length
  if (bulletLines > 0) score += 10

  return Math.min(score, 100)
}

function identifyWeakAreas(
  resume: ParsedResume,
  scores: Record<string, number>,
): string[] {
  const weak: string[] = []
  if (!resume.name) weak.push('Missing name')
  if (!resume.email) weak.push('Missing email')
  if (!resume.phone) weak.push('Missing phone number')
  if (!resume.linkedIn) weak.push('Missing LinkedIn profile')
  if (!resume.github) weak.push('Missing GitHub profile')
  if (resume.skills.length < 5) weak.push('Less than 5 skills listed')
  if (resume.experience.length === 0) weak.push('No work experience listed')
  if (resume.education.length === 0) weak.push('No education listed')
  if (resume.projects.length === 0) weak.push('No projects listed')
  if (resume.certifications.length === 0) weak.push('No certifications listed')

  const hasQuantifiedExp = resume.experience.some((e) =>
    e.description.some((d) => /\d+/.test(d)),
  )
  if (!hasQuantifiedExp && resume.experience.length > 0) {
    weak.push('Experience descriptions lack quantified achievements')
  }

  const actionVerbExp = resume.experience.filter((e) =>
    e.description.some((d) => ACTION_VERBS.has(d.split(/\s+/)[0]?.toLowerCase() || '')),
  ).length
  if (actionVerbExp < Math.ceil(resume.experience.length / 2) && resume.experience.length > 0) {
    weak.push('Few action verbs in experience descriptions')
  }

  for (const [key, score] of Object.entries(scores)) {
    if (score < 50 && key !== 'overall' && key !== 'keywords' && key !== 'formatting' && key !== 'readability') {
      const labels: Record<string, string> = {
        contact: 'Contact information is incomplete',
        skills: 'Skills section needs improvement',
        experience: 'Experience section is lacking detail',
        projects: 'Projects section is incomplete',
        education: 'Education section is lacking detail',
        keywords: 'Keyword density is low',
        formatting: 'Resume formatting needs improvement',
        readability: 'Resume readability needs improvement',
      }
      if (labels[key]) {
        weak.push(labels[key])
      }
    }
  }

  return [...new Set(weak)]
}

function identifyStrongAreas(
  resume: ParsedResume,
  scores: Record<string, number>,
): string[] {
  const strong: string[] = []
  if (resume.email) strong.push('Email provided')
  if (resume.phone) strong.push('Phone number provided')
  if (resume.linkedIn) strong.push('LinkedIn profile included')
  if (resume.github) strong.push('GitHub profile included')
  if (resume.skills.length >= 8) strong.push('Strong skills section')
  if (resume.experience.length >= 2) strong.push('Solid work experience')
  if (resume.projects.length >= 2) strong.push('Good project portfolio')

  const hasQuantifiedExp = resume.experience.some((e) =>
    e.description.some((d) => /\d+/.test(d)),
  )
  if (hasQuantifiedExp) strong.push('Quantified achievements in experience')

  const actionVerbExp = resume.experience.filter((e) =>
    e.description.some((d) => ACTION_VERBS.has(d.split(/\s+/)[0]?.toLowerCase() || '')),
  ).length
  if (actionVerbExp > 0) strong.push('Strong action verbs used')

  for (const [key, score] of Object.entries(scores)) {
    if (score >= 80 && key !== 'overall') {
      const labels: Record<string, string> = {
        contact: 'Contact information is complete',
        skills: 'Excellent skills coverage',
        experience: 'Well detailed experience section',
        projects: 'Well documented projects',
        education: 'Strong education background',
        keywords: 'Good keyword density',
        formatting: 'Good resume formatting',
        readability: 'Highly readable resume',
      }
      if (labels[key]) {
        strong.push(labels[key])
      }
    }
  }

  return [...new Set(strong)]
}

function generateRecommendations(
  weakAreas: string[],
  scores: Record<string, number>,
): string[] {
  const recs: string[] = []

  if (scores.contact < 70) {
    recs.push('Add missing contact details (phone, LinkedIn, GitHub)')
  }
  if (scores.skills < 60) {
    recs.push('Add more relevant skills (aim for 10+)')
  }
  if (scores.experience < 60) {
    recs.push('Add more detail to experience descriptions with measurable outcomes')
  }
  if (scores.projects < 60) {
    recs.push('Add projects with descriptions and technologies used')
  }
  if (scores.education < 60) {
    recs.push('Add education details including degree, field, and GPA')
  }
  if (scores.keywords < 60) {
    recs.push('Increase keyword density by adding more industry-specific terms')
  }
  if (scores.formatting < 60) {
    recs.push('Improve formatting with clear section headers and bullet points')
  }
  if (scores.readability < 60) {
    recs.push('Use more action verbs and quantify achievements with numbers')
  }

  if (weakAreas.some((w) => w.includes('action verbs'))) {
    recs.push('Start experience descriptions with strong action verbs (built, led, designed)')
  }
  if (weakAreas.some((w) => w.includes('quantified'))) {
    recs.push('Add metrics and numbers to experience descriptions (e.g., "increased efficiency by 20%")')
  }

  return [...new Set(recs)]
}

export function calculateAtsScore(resume: ParsedResume): AtsScore {
  const contact = scoreContact(resume)
  const skills = scoreSkills(resume)
  const experience = scoreExperience(resume)
  const projects = scoreProjects(resume)
  const education = scoreEducation(resume)
  const keywords = scoreKeywords(resume)
  const formatting = scoreFormatting(resume)
  const readability = scoreReadability(resume)

  const rawOverall = Math.round(
    (contact * ATS_WEIGHTS.contact +
      skills * ATS_WEIGHTS.skills +
      experience * ATS_WEIGHTS.experience +
      projects * ATS_WEIGHTS.projects +
      education * ATS_WEIGHTS.education +
      keywords * ATS_WEIGHTS.keywords +
      formatting * ATS_WEIGHTS.formatting +
      readability * ATS_WEIGHTS.readability)
    / Object.values(ATS_WEIGHTS).reduce((a, b) => a + b, 0) * 100
    / 100
  )

  const scoreMap = { contact, skills, experience, projects, education, keywords, formatting, readability }
  const weakAreas = identifyWeakAreas(resume, { ...scoreMap, overall: rawOverall })
  const strongAreas = identifyStrongAreas(resume, { ...scoreMap, overall: rawOverall })
  const recommendations = generateRecommendations(weakAreas, { ...scoreMap, overall: rawOverall })

  return {
    overall: rawOverall,
    contact,
    skills,
    experience,
    projects,
    education,
    keywords,
    formatting,
    readability,
    weakAreas,
    strongAreas,
    recommendations,
  }
}
