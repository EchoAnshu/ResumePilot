import { prisma } from '../database/client.js'
import type { JdMatch } from '@prisma/client'

export async function findLatestJdMatch(resumeId: string): Promise<JdMatch | null> {
  return prisma.jdMatch.findFirst({
    where: { resumeId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createJdMatch(data: {
  resumeId: string
  jdText: string
  matchData: string
}): Promise<JdMatch> {
  return prisma.jdMatch.create({ data })
}
