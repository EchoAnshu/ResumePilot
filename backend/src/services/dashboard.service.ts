import { prisma } from '../database/client.js'
import type { AtsScore } from '../types/index.js'

interface ResumeWithScore {
  id: string
  originalName: string
  filename: string
  mimeType: string
  size: number
  createdAt: Date
  updatedAt: Date
  parsedName: string | null
  atsScore: number | null
}

interface ScoreHistoryItem {
  resumeId: string
  resumeName: string
  score: number
  date: string
}

export interface DashboardData {
  totalResumes: number
  totalAnalyses: number
  averageAtsScore: number | null
  latestResume: ResumeWithScore | null
  recentResumes: ResumeWithScore[]
  scoreHistory: ScoreHistoryItem[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const totalResumes = await prisma.resume.count()

  const analyses = await prisma.analysis.findMany({
    where: { atsScore: { not: null }, status: { not: 'pending' } },
    orderBy: { createdAt: 'desc' },
    include: { resume: true },
  })

  const totalAnalyses = analyses.length

  let averageAtsScore: number | null = null
  if (analyses.length > 0) {
    const scores = analyses
      .map((a) => {
        try {
          const parsed = JSON.parse(a.atsScore!) as AtsScore
          return parsed.overall
        } catch { return null }
      })
      .filter((s): s is number => s !== null)
    if (scores.length > 0) {
      averageAtsScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }

  const resumes = await prisma.resume.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const recentResumes: ResumeWithScore[] = resumes.map((r) => {
    let parsedName: string | null = null
    try {
      if (r.parsedData) {
        const p = JSON.parse(r.parsedData)
        parsedName = p.name || null
      }
    } catch {}

    const analysis = analyses.find((a) => a.resumeId === r.id)
    let atsScore: number | null = null
    if (analysis?.atsScore) {
      try {
        const parsed = JSON.parse(analysis.atsScore) as AtsScore
        atsScore = parsed.overall
      } catch {}
    }

    return {
      id: r.id,
      originalName: r.originalName,
      filename: r.filename,
      mimeType: r.mimeType,
      size: r.size,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      parsedName,
      atsScore,
    }
  })

  const scoreHistory: ScoreHistoryItem[] = analyses
    .map((a) => {
      try {
        const parsed = JSON.parse(a.atsScore!) as AtsScore
        return {
          resumeId: a.resumeId,
          resumeName: a.resume.originalName,
          score: parsed.overall,
          date: a.createdAt.toISOString(),
        }
      } catch { return null }
    })
    .filter((s): s is ScoreHistoryItem => s !== null)
    .slice(0, 30)

  const latestResume = recentResumes[0] || null

  return {
    totalResumes,
    totalAnalyses,
    averageAtsScore,
    latestResume,
    recentResumes,
    scoreHistory,
  }
}
