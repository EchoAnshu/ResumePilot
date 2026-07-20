import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../backend/src/database/client.js', () => ({
  prisma: {
    resume: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    analysis: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    setting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}))

vi.mock('../../../backend/src/repositories/resume.repository.js', () => ({
  createResume: vi.fn(),
  findAllResumes: vi.fn(),
  findResumeById: vi.fn(),
  updateResumeFile: vi.fn(),
  updateResumeParsedData: vi.fn(),
  deleteResumeById: vi.fn(),
}))

vi.mock('../../../backend/src/parsers/resumeParser.js', () => ({
  parseResume: vi.fn(),
}))

vi.mock('../../../backend/src/services/ats.service.js', () => ({
  analyzeResume: vi.fn(),
}))

import * as resumeRepository from '../../../backend/src/repositories/resume.repository.js'
import { uploadResume, listResumes, getResume, deleteResume } from '../../../backend/src/services/resume.service.js'
import * as cacheService from '../../../backend/src/services/cache.service.js'

function createMockFile(overrides = {}): Express.Multer.File {
  return {
    fieldname: 'resume',
    originalname: 'test-resume.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024 * 50,
    filename: 'abc123-test-resume.pdf',
    destination: '',
    path: '',
    buffer: Buffer.from(''),
    ...overrides,
  } as Express.Multer.File
}

describe('uploadResume', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(cacheService, 'invalidateCache').mockImplementation(() => {})
  })

  it('creates resume with valid file', async () => {
    const mockResume = {
      id: 'uuid-1',
      originalName: 'test-resume.pdf',
      filename: 'abc123-test-resume.pdf',
      mimeType: 'application/pdf',
      size: 1024 * 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      parsedData: null,
      aiResults: null,
    }

    vi.mocked(resumeRepository.createResume).mockResolvedValue(mockResume as any)

    const result = await uploadResume(createMockFile())
    expect(result.resume.id).toBe('uuid-1')
    expect(result.resume.originalName).toBe('test-resume.pdf')
  })

  it('rejects oversized file', async () => {
    const file = createMockFile({ size: 11 * 1024 * 1024 })
    await expect(uploadResume(file)).rejects.toThrow()
  })

  it('rejects invalid file type', async () => {
    const file = createMockFile({ mimetype: 'image/png', originalname: 'image.png' })
    await expect(uploadResume(file)).rejects.toThrow()
  })

  it('invalidates dashboard cache after upload', async () => {
    const mockResume = {
      id: 'uuid-1', originalName: 'test-resume.pdf', filename: 'abc.pdf',
      mimeType: 'application/pdf', size: 1024 * 50,
      createdAt: new Date(), updatedAt: new Date(),
      parsedData: null, aiResults: null,
    }
    vi.mocked(resumeRepository.createResume).mockResolvedValue(mockResume as any)

    const cacheSpy = vi.spyOn(cacheService, 'invalidateCache')
    await uploadResume(createMockFile())
    expect(cacheSpy).toHaveBeenCalledWith('dashboard')
  })
})

describe('listResumes', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns all resumes', async () => {
    const mockResumes = [
      { id: '1', originalName: 'resume1.pdf', filename: 'a.pdf', mimeType: 'application/pdf', size: 100, createdAt: new Date(), updatedAt: new Date(), parsedData: null, aiResults: null },
      { id: '2', originalName: 'resume2.pdf', filename: 'b.pdf', mimeType: 'application/pdf', size: 200, createdAt: new Date(), updatedAt: new Date(), parsedData: null, aiResults: null },
    ]
    vi.mocked(resumeRepository.findAllResumes).mockResolvedValue(mockResumes as any)

    const result = await listResumes()
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no resumes exist', async () => {
    vi.mocked(resumeRepository.findAllResumes).mockResolvedValue([])
    const result = await listResumes()
    expect(result).toEqual([])
  })
})

describe('getResume', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns resume when found', async () => {
    const mockResume = { id: '1', originalName: 'test.pdf', filename: 'a.pdf', mimeType: 'application/pdf', size: 100, createdAt: new Date(), updatedAt: new Date(), parsedData: null, aiResults: null }
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)

    const result = await getResume('1')
    expect(result.id).toBe('1')
  })

  it('throws when resume not found', async () => {
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(null)
    await expect(getResume('nonexistent')).rejects.toThrow()
  })
})

describe('deleteResume', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(cacheService, 'invalidateCache').mockImplementation(() => {})
  })

  it('deletes existing resume and invalidates cache', async () => {
    const mockResume = { id: '1', originalName: 'test.pdf', filename: 'a.pdf', mimeType: 'application/pdf', size: 100, createdAt: new Date(), updatedAt: new Date(), parsedData: null, aiResults: null }
    vi.mocked(resumeRepository.findResumeById).mockResolvedValue(mockResume as any)
    vi.mocked(resumeRepository.deleteResumeById).mockResolvedValue(undefined as any)

    const cacheSpy = vi.spyOn(cacheService, 'invalidateCache')
    await deleteResume('1')
    expect(cacheSpy).toHaveBeenCalledWith('dashboard')
    expect(resumeRepository.deleteResumeById).toHaveBeenCalledWith('1')
  })
})
