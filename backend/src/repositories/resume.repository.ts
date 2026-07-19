import { prisma } from '../database/client.js'
import type { Resume } from '@prisma/client'

export async function createResume(data: {
  originalName: string
  filename: string
  mimeType: string
  size: number
}): Promise<Resume> {
  return prisma.resume.create({ data })
}

export async function findAllResumes(): Promise<Resume[]> {
  return prisma.resume.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function findResumeById(id: string): Promise<Resume | null> {
  return prisma.resume.findUnique({ where: { id } })
}

export async function findResumeByFilename(filename: string): Promise<Resume | null> {
  return prisma.resume.findUnique({ where: { filename } })
}

export async function deleteResumeById(id: string): Promise<void> {
  await prisma.resume.delete({ where: { id } })
}

export async function updateResumeFile(
  id: string,
  data: {
    originalName: string
    filename: string
    mimeType: string
    size: number
  },
): Promise<Resume> {
  return prisma.resume.update({
    where: { id },
    data,
  })
}


