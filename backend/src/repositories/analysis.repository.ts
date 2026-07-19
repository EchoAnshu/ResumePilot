import { prisma } from '../database/client.js'
import type { Analysis } from '@prisma/client'

export async function findAnalysisByResumeId(resumeId: string): Promise<Analysis | null> {
  return prisma.analysis.findFirst({
    where: { resumeId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createAnalysis(data: {
  resumeId: string
  status: string
  atsScore?: string
  summary?: string
}): Promise<Analysis> {
  return prisma.analysis.create({ data })
}

export async function updateAnalysis(
  id: string,
  data: {
    status?: string
    atsScore?: string
    summary?: string
  },
): Promise<Analysis> {
  return prisma.analysis.update({
    where: { id },
    data,
  })
}
