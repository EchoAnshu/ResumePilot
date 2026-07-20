import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../backend/src/database/client.js', () => ({
  prisma: {
    resume: { findUnique: vi.fn() },
    analysis: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    setting: { findMany: vi.fn(), upsert: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}))

vi.mock('../../../backend/src/repositories/resume.repository.js', () => ({
  findResumeById: vi.fn(),
  updateResumeParsedData: vi.fn(),
}))

vi.mock('../../../backend/src/repositories/analysis.repository.js', () => ({
  findAnalysisByResumeId: vi.fn(),
  createAnalysis: vi.fn(),
  updateAnalysis: vi.fn(),
}))

vi.mock('../../../backend/src/parsers/resumeParser.js', () => ({
  parseResume: vi.fn(),
}))

import * as resumeRepository from '../../../backend/src/repositories/resume.repository.js'
import * as analysisRepository from '../../../backend/src/repositories/analysis.repository.js'
import { analyzeResume, getAnalysis } from '../../../backend/src/services/ats.service.js'
import * as cacheService from '../../../backend/src/services/cache.service.js'

describe('analyzeResume', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(cacheService, 'invalidateCache').mockImplementation(() => {})
  })

  it('throws when resume is not found', async () => {
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(null)
    await expect(analyzeResume('nonexistent')).rejects.toThrow('Resume not found')
  })

  it('returns ATS score for a valid resume with parsed data', async () => {
    const mockResume = {
      id: 'uuid-1',
      originalName: 'test.pdf',
      filename: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1000,
      parsedData: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        location: 'NYC',
        linkedIn: 'https://linkedin.com/in/john',
        github: 'https://github.com/john',
        portfolio: null,
        skills: ['javascript', 'typescript', 'react', 'node', 'python'],
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        languages: [],
        achievements: [],
      }),
      aiResults: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)
    vi.mocked(analysisRepository.findAnalysisByResumeId).mockResolvedValue(null)
    vi.mocked(analysisRepository.createAnalysis).mockResolvedValue({} as any)

    const result = await analyzeResume('uuid-1')
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(result.contact).toBeGreaterThan(0)
    expect(result.skills).toBeGreaterThan(0)
  })

  it('parses resume on demand when parsedData is missing', async () => {
    const mockResume = {
      id: 'uuid-2', originalName: 'test.pdf', filename: 'test.pdf',
      mimeType: 'application/pdf', size: 1000,
      parsedData: null, aiResults: null,
      createdAt: new Date(), updatedAt: new Date(),
    }

    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)
    const { parseResume } = await import('../../../backend/src/parsers/resumeParser.js')
    vi.mocked(parseResume).mockResolvedValue({
      name: 'Jane Doe', email: 'jane@example.com', phone: null,
      location: null, linkedIn: null, github: null, portfolio: null,
      skills: ['js', 'ts'], education: [], experience: [], projects: [],
      certifications: [], languages: [], achievements: [],
    } as any)

    vi.mocked(analysisRepository.findAnalysisByResumeId).mockResolvedValue(null)
    vi.mocked(analysisRepository.createAnalysis).mockResolvedValue({} as any)

    const result = await analyzeResume('uuid-2')
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(parseResume).toHaveBeenCalled()
  })

  it('invalidates dashboard cache after analysis', async () => {
    const mockResume = {
      id: 'uuid-3', originalName: 'test.pdf', filename: 'test.pdf',
      mimeType: 'application/pdf', size: 1000,
      parsedData: JSON.stringify({ name: 'A', email: 'a@b.com', skills: ['js'], education: [], experience: [], projects: [], certifications: [], languages: [], achievements: [] }),
      aiResults: null, createdAt: new Date(), updatedAt: new Date(),
    }
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)
    vi.mocked(analysisRepository.findAnalysisByResumeId).mockResolvedValue(null)
    vi.mocked(analysisRepository.createAnalysis).mockResolvedValue({} as any)

    const cacheSpy = vi.spyOn(cacheService, 'invalidateCache')
    await analyzeResume('uuid-3')
    expect(cacheSpy).toHaveBeenCalledWith('dashboard')
  })

  it('updates existing analysis instead of creating new one', async () => {
    const mockResume = {
      id: 'uuid-4', originalName: 'test.pdf', filename: 'test.pdf',
      mimeType: 'application/pdf', size: 1000,
      parsedData: JSON.stringify({ name: 'A', email: 'a@b.com', skills: ['js'], education: [], experience: [], projects: [], certifications: [], languages: [], achievements: [] }),
      aiResults: null, createdAt: new Date(), updatedAt: new Date(),
    }
    const existingAnalysis = { id: 'analysis-1', resumeId: 'uuid-4' }

    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)
    vi.mocked(analysisRepository.findAnalysisByResumeId).mockResolvedValue(existingAnalysis as any)
    vi.mocked(analysisRepository.updateAnalysis).mockResolvedValue({} as any)

    const result = await analyzeResume('uuid-4')
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(analysisRepository.updateAnalysis).toHaveBeenCalled()
    expect(analysisRepository.createAnalysis).not.toHaveBeenCalled()
  })
})

describe('getAnalysis', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns null atsScore when no analysis exists', async () => {
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue({ id: '1' } as any)
    vi.mocked(analysisRepository.findAnalysisByResumeId).mockResolvedValue(null)

    const result = await getAnalysis('1')
    expect(result.atsScore).toBeNull()
  })

  it('throws when resume not found', async () => {
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(null)
    await expect(getAnalysis('nonexistent')).rejects.toThrow('Resume not found')
  })
})
