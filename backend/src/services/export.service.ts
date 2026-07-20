import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'
import { logger } from '../config/logger.js'
import { AppError } from '../middleware/errorHandler.js'
import { ERROR_CODES } from '../constants/index.js'
import * as resumeRepository from '../repositories/resume.repository.js'
import * as analysisRepository from '../repositories/analysis.repository.js'
import * as jdRepository from '../repositories/jd.repository.js'
import { parseResume } from '../parsers/resumeParser.js'
import { calculateAtsScore } from './ats/atsCalculator.js'
import type {
  ParsedResume,
  AtsScore,
  JdMatchResult,
  AiTaskResult,
  AiSummaryResult,
} from '../types/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const reportsDir = path.resolve(__dirname, '../../', '../storage/reports')

async function getResumeData(id: string): Promise<{
  resume: { id: string; originalName: string; filename: string }
  parsed: ParsedResume
  atsScore: AtsScore
  jdMatch: JdMatchResult | null
  aiSummary: AiSummaryResult | null
}> {
  const resume = await resumeRepository.findResumeById(id)
  if (!resume) throw new AppError(404, 'Resume not found.', ERROR_CODES.NOT_FOUND)

  let parsedData = resume.parsedData
  if (!parsedData) {
    const p = await parseResume(resume.filename, resume.mimeType)
    parsedData = JSON.stringify(p)
    await resumeRepository.updateResumeParsedData(resume.id, parsedData)
  }
  const parsed = JSON.parse(parsedData) as ParsedResume

  const analysis = await analysisRepository.findAnalysisByResumeId(id)
  let atsScore: AtsScore
  if (analysis?.atsScore) {
    atsScore = JSON.parse(analysis.atsScore) as AtsScore
  } else {
    atsScore = calculateAtsScore(parsed)
  }

  const jd = await jdRepository.findLatestJdMatch(id)
  let jdMatch: JdMatchResult | null = null
  if (jd?.matchData) {
    try { jdMatch = JSON.parse(jd.matchData) as JdMatchResult } catch {}
  }

  let aiSummary: AiSummaryResult | null = null
  if (resume.aiResults) {
    try {
      const aiData = JSON.parse(resume.aiResults) as Record<string, AiTaskResult>
      if (aiData.summary) {
        aiSummary = aiData.summary as AiSummaryResult
      }
    } catch {}
  }

  return { resume: { id: resume.id, originalName: resume.originalName, filename: resume.filename }, parsed, atsScore, jdMatch, aiSummary }
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function generateJson(data: Awaited<ReturnType<typeof getResumeData>>): string {
  return JSON.stringify({
    generatedAt: formatDate(),
    resumeName: data.resume.originalName,
    contact: {
      name: data.parsed.name,
      email: data.parsed.email,
      phone: data.parsed.phone,
      location: data.parsed.location,
      linkedIn: data.parsed.linkedIn,
      github: data.parsed.github,
      portfolio: data.parsed.portfolio,
    },
    atsScore: data.atsScore,
    skills: data.parsed.skills,
    education: data.parsed.education,
    experience: data.parsed.experience,
    projects: data.parsed.projects,
    certifications: data.parsed.certifications,
    languages: data.parsed.languages,
    achievements: data.parsed.achievements,
    jdMatch: data.jdMatch,
    aiSummary: data.aiSummary,
  }, null, 2)
}

function generateMarkdown(data: Awaited<ReturnType<typeof getResumeData>>): string {
  const { parsed, atsScore, jdMatch, aiSummary } = data
  const lines: string[] = []

  lines.push(`# Resume Analysis Report`)
  lines.push(`**Generated:** ${formatDate()}`)
  lines.push(`**Resume:** ${data.resume.originalName}`)
  lines.push('')

  if (parsed.name) {
    lines.push(`## Resume: ${parsed.name}`)
    lines.push('')
  }

  lines.push('## Contact Information')
  lines.push('')
  if (parsed.name) lines.push(`- **Name:** ${parsed.name}`)
  if (parsed.email) lines.push(`- **Email:** ${parsed.email}`)
  if (parsed.phone) lines.push(`- **Phone:** ${parsed.phone}`)
  if (parsed.location) lines.push(`- **Location:** ${parsed.location}`)
  if (parsed.linkedIn) lines.push(`- **LinkedIn:** ${parsed.linkedIn}`)
  if (parsed.github) lines.push(`- **GitHub:** ${parsed.github}`)
  if (parsed.portfolio) lines.push(`- **Portfolio:** ${parsed.portfolio}`)
  lines.push('')

  lines.push('## ATS Score')
  lines.push('')
  lines.push(`**Overall Score: ${atsScore.overall}/100**`)
  lines.push('')
  lines.push('### Category Breakdown')
  lines.push('')
  lines.push(`| Category | Score | Weight |`)
  lines.push(`|----------|-------|--------|`)
  const cats = [
    ['Contact', atsScore.contact, 10],
    ['Skills', atsScore.skills, 20],
    ['Experience', atsScore.experience, 20],
    ['Projects', atsScore.projects, 15],
    ['Education', atsScore.education, 10],
    ['Keywords', atsScore.keywords, 15],
    ['Formatting', atsScore.formatting, 5],
    ['Readability', atsScore.readability, 5],
  ]
  for (const [name, score, weight] of cats) {
    lines.push(`| ${name} | ${score}/100 | ${weight}% |`)
  }
  lines.push('')

  if (atsScore.strongAreas.length > 0) {
    lines.push('### Strong Areas')
    lines.push('')
    for (const area of atsScore.strongAreas) {
      lines.push(`- ✅ ${area}`)
    }
    lines.push('')
  }

  if (atsScore.weakAreas.length > 0) {
    lines.push('### Areas to Improve')
    lines.push('')
    for (const area of atsScore.weakAreas) {
      lines.push(`- ⚠️ ${area}`)
    }
    lines.push('')
  }

  if (atsScore.recommendations.length > 0) {
    lines.push('### Recommendations')
    lines.push('')
    for (const rec of atsScore.recommendations) {
      lines.push(`- 💡 ${rec}`)
    }
    lines.push('')
  }

  if (parsed.skills.length > 0) {
    lines.push('## Skills')
    lines.push('')
    lines.push(parsed.skills.join(', '))
    lines.push('')
  }

  if (parsed.experience.length > 0) {
    lines.push('## Experience')
    lines.push('')
    for (const exp of parsed.experience) {
      lines.push(`### ${exp.role || ''} at ${exp.company || ''}`)
      if (exp.startDate || exp.endDate) {
        lines.push(`*${exp.startDate || ''} - ${exp.endDate || 'Present'}*`)
      }
      for (const desc of exp.description) {
        lines.push(`- ${desc}`)
      }
      lines.push('')
    }
  }

  if (parsed.education.length > 0) {
    lines.push('## Education')
    lines.push('')
    for (const edu of parsed.education) {
      lines.push(`- **${edu.institution}** — ${edu.degree || ''} ${edu.field || ''}`)
      if (edu.gpa) lines.push(`  - GPA: ${edu.gpa}`)
    }
    lines.push('')
  }

  if (parsed.projects.length > 0) {
    lines.push('## Projects')
    lines.push('')
    for (const proj of parsed.projects) {
      lines.push(`### ${proj.name}`)
      if (proj.description) lines.push(proj.description)
      if (proj.technologies.length > 0) lines.push(`*Technologies: ${proj.technologies.join(', ')}*`)
      if (proj.url) lines.push(`[${proj.url}](${proj.url})`)
      lines.push('')
    }
  }

  if (jdMatch) {
    lines.push('## Job Description Match')
    lines.push('')
    lines.push(`**Match Percentage: ${jdMatch.matchPercentage}%**`)
    lines.push('')
    if (jdMatch.matchingSkills.length > 0) {
      lines.push('### Matching Skills')
      lines.push('')
      lines.push(jdMatch.matchingSkills.join(', '))
      lines.push('')
    }
    if (jdMatch.missingSkills.length > 0) {
      lines.push('### Missing Skills')
      lines.push('')
      lines.push(jdMatch.missingSkills.join(', '))
      lines.push('')
    }
    if (jdMatch.suggestions.length > 0) {
      lines.push('### Suggestions')
      lines.push('')
      for (const s of jdMatch.suggestions) {
        lines.push(`- ${s}`)
      }
      lines.push('')
    }
  }

  if (aiSummary) {
    lines.push('## AI Analysis')
    lines.push('')
    lines.push(`**Summary:** ${aiSummary.summary}`)
    lines.push('')
    if (aiSummary.strengths.length > 0) {
      lines.push('### AI-Identified Strengths')
      for (const s of aiSummary.strengths) lines.push(`- ${s}`)
      lines.push('')
    }
    if (aiSummary.weaknesses.length > 0) {
      lines.push('### AI-Identified Weaknesses')
      for (const w of aiSummary.weaknesses) lines.push(`- ${w}`)
      lines.push('')
    }
    if (aiSummary.suggestions.length > 0) {
      lines.push('### AI Suggestions')
      for (const s of aiSummary.suggestions) lines.push(`- ${s}`)
      lines.push('')
    }
  }

  lines.push('---')
  lines.push(`*Generated by ResumePilot on ${formatDate()}*`)
  lines.push('')

  return lines.join('\n')
}

function generatePdf(data: Awaited<ReturnType<typeof getResumeData>>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const { parsed, atsScore, jdMatch, aiSummary } = data
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const titleColor = '#4338ca'
    const sectionColor = '#6366f1'
    const textColor = '#1f2937'
    const mutedColor = '#6b7280'
    const goodColor = '#059669'
    const warnColor = '#d97706'

    function title(text: string, size = 24) {
      doc.fontSize(size).fillColor(titleColor).text(text, { underline: false })
      doc.moveDown(0.5)
    }

    function section(text: string) {
      doc.fontSize(14).fillColor(sectionColor).text(text)
      doc.moveDown(0.3)
    }

    function body(text: string, color = textColor) {
      doc.fontSize(10).fillColor(color).text(text)
    }

    function bullet(text: string, color = textColor) {
      doc.fontSize(10).fillColor(color).text(`  • ${text}`, { indent: 10 })
    }

    doc.font('Helvetica')

    title('Resume Analysis Report', 26)
    body(`Generated: ${formatDate()}`, mutedColor)
    body(`Resume: ${data.resume.originalName}`, mutedColor)
    doc.moveDown(1)

    if (parsed.name) {
      section(`Candidate: ${parsed.name}`)
      doc.moveDown(0.3)
    }

    section('Contact Information')
    if (parsed.name) body(`Name: ${parsed.name}`)
    if (parsed.email) body(`Email: ${parsed.email}`)
    if (parsed.phone) body(`Phone: ${parsed.phone}`)
    if (parsed.location) body(`Location: ${parsed.location}`)
    if (parsed.linkedIn) body(`LinkedIn: ${parsed.linkedIn}`)
    if (parsed.github) body(`GitHub: ${parsed.github}`)
    doc.moveDown(0.5)

    section(`ATS Score: ${atsScore.overall}/100`)
    doc.moveDown(0.3)
    body('Category Breakdown:')
    const catLabels: [string, number, number][] = [
      ['Contact', atsScore.contact, 10],
      ['Skills', atsScore.skills, 20],
      ['Experience', atsScore.experience, 20],
      ['Projects', atsScore.projects, 15],
      ['Education', atsScore.education, 10],
      ['Keywords', atsScore.keywords, 15],
      ['Formatting', atsScore.formatting, 5],
      ['Readability', atsScore.readability, 5],
    ]
    for (const [name, score] of catLabels) {
      const color = score >= 80 ? goodColor : score >= 60 ? warnColor : '#dc2626'
      doc.fontSize(9).fillColor(mutedColor).text(`  ${name}: `, { continued: true })
      doc.fillColor(color).text(`${score}/100`)
    }
    doc.moveDown(0.5)

    if (atsScore.strongAreas.length > 0) {
      section('Strong Areas')
      for (const a of atsScore.strongAreas) bullet(a, goodColor)
      doc.moveDown(0.3)
    }

    if (atsScore.weakAreas.length > 0) {
      section('Areas to Improve')
      for (const a of atsScore.weakAreas) bullet(a, warnColor)
      doc.moveDown(0.3)
    }

    if (atsScore.recommendations.length > 0) {
      section('Recommendations')
      for (const r of atsScore.recommendations) bullet(r)
      doc.moveDown(0.3)
    }

    if (parsed.skills.length > 0) {
      section('Skills')
      body(parsed.skills.join(', '))
      doc.moveDown(0.5)
    }

    if (parsed.experience.length > 0) {
      section('Experience')
      for (const exp of parsed.experience) {
        doc.fontSize(11).fillColor(textColor).text(`${exp.role || ''} at ${exp.company || ''}`)
        if (exp.startDate || exp.endDate) {
          doc.fontSize(9).fillColor(mutedColor).text(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`)
        }
        for (const desc of exp.description) {
          bullet(desc)
        }
        doc.moveDown(0.3)
      }
    }

    if (parsed.education.length > 0) {
      section('Education')
      for (const edu of parsed.education) {
        body(`${edu.institution} — ${edu.degree || ''} ${edu.field || ''}`)
        if (edu.gpa) doc.fontSize(9).fillColor(mutedColor).text(`  GPA: ${edu.gpa}`)
      }
      doc.moveDown(0.5)
    }

    if (parsed.projects.length > 0) {
      section('Projects')
      for (const proj of parsed.projects) {
        doc.fontSize(11).fillColor(textColor).text(proj.name)
        if (proj.description) body(proj.description)
        if (proj.technologies.length > 0) {
          doc.fontSize(9).fillColor(mutedColor).text(`Technologies: ${proj.technologies.join(', ')}`)
        }
        doc.moveDown(0.3)
      }
    }

    if (jdMatch) {
      doc.addPage()
      section('Job Description Match')
      const jdColor = jdMatch.matchPercentage >= 70 ? goodColor : jdMatch.matchPercentage >= 40 ? warnColor : '#dc2626'
      doc.fontSize(16).fillColor(jdColor).text(`Match: ${jdMatch.matchPercentage}%`)
      doc.moveDown(0.5)

      if (jdMatch.matchingSkills.length > 0) {
        section('Matching Skills')
        body(jdMatch.matchingSkills.join(', '))
        doc.moveDown(0.3)
      }
      if (jdMatch.missingSkills.length > 0) {
        section('Missing Skills')
        body(jdMatch.missingSkills.join(', '))
        doc.moveDown(0.3)
      }
      if (jdMatch.suggestions.length > 0) {
        section('Suggestions')
        for (const s of jdMatch.suggestions) bullet(s)
        doc.moveDown(0.3)
      }
    }

    if (aiSummary) {
      if (!jdMatch) doc.addPage()
      section('AI Analysis')
      body(aiSummary.summary)
      doc.moveDown(0.5)
      if (aiSummary.strengths.length > 0) {
        section('AI-Identified Strengths')
        for (const s of aiSummary.strengths) bullet(s)
        doc.moveDown(0.3)
      }
      if (aiSummary.weaknesses.length > 0) {
        section('AI-Identified Weaknesses')
        for (const w of aiSummary.weaknesses) bullet(w)
        doc.moveDown(0.3)
      }
      if (aiSummary.suggestions.length > 0) {
        section('AI Suggestions')
        for (const s of aiSummary.suggestions) bullet(s)
        doc.moveDown(0.3)
      }
    }

    doc.fontSize(8).fillColor(mutedColor).text(`Generated by ResumePilot on ${formatDate()}`, { align: 'center' })
    doc.end()
  })
}

export async function exportReport(
  resumeId: string,
  format: 'json' | 'markdown' | 'pdf',
): Promise<{ filename: string; content: string | Buffer; mimeType: string }> {
  const data = await getResumeData(resumeId)

  await fs.mkdir(reportsDir, { recursive: true })
  const timestamp = Date.now()
  const safeName = data.resume.originalName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)

  switch (format) {
    case 'json': {
      const content = generateJson(data)
      const filename = `${safeName}_${timestamp}.json`
      await fs.writeFile(path.join(reportsDir, filename), content, 'utf-8')
      logger.info('JSON report exported', { resumeId, filename })
      return { filename, content, mimeType: 'application/json' }
    }

    case 'markdown': {
      const content = generateMarkdown(data)
      const filename = `${safeName}_${timestamp}.md`
      await fs.writeFile(path.join(reportsDir, filename), content, 'utf-8')
      logger.info('Markdown report exported', { resumeId, filename })
      return { filename, content, mimeType: 'text/markdown' }
    }

    case 'pdf': {
      const content = await generatePdf(data)
      const filename = `${safeName}_${timestamp}.pdf`
      await fs.writeFile(path.join(reportsDir, filename), content)
      logger.info('PDF report exported', { resumeId, filename })
      return { filename, content, mimeType: 'application/pdf' }
    }

    default:
      throw new AppError(400, `Unsupported export format: ${format}`, ERROR_CODES.VALIDATION_ERROR)
  }
}
