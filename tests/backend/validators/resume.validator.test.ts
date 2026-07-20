import { describe, it, expect } from 'vitest'
import { validateFileType, validateFileSize, validateFileExtension, sanitizeFilename } from '../../../backend/src/validators/resume.validator.js'

describe('validateFileType', () => {
  it('accepts PDF', () => {
    expect(() => validateFileType('application/pdf')).not.toThrow()
  })

  it('accepts DOCX', () => {
    expect(() => validateFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).not.toThrow()
  })

  it('rejects image files', () => {
    expect(() => validateFileType('image/png')).toThrow()
    expect(() => validateFileType('image/jpeg')).toThrow()
  })

  it('rejects ZIP files', () => {
    expect(() => validateFileType('application/zip')).toThrow()
  })

  it('rejects executable files', () => {
    expect(() => validateFileType('application/x-msdownload')).toThrow()
  })
})

describe('validateFileSize', () => {
  it('accepts files under 10MB', () => {
    expect(() => validateFileSize(5 * 1024 * 1024)).not.toThrow()
  })

  it('accepts exactly 10MB', () => {
    expect(() => validateFileSize(10 * 1024 * 1024)).not.toThrow()
  })

  it('rejects files over 10MB', () => {
    expect(() => validateFileSize(11 * 1024 * 1024)).toThrow()
  })

  it('rejects very large files', () => {
    expect(() => validateFileSize(100 * 1024 * 1024)).toThrow()
  })
})

describe('validateFileExtension', () => {
  it('accepts .pdf', () => {
    expect(() => validateFileExtension('resume.pdf')).not.toThrow()
  })

  it('accepts .docx', () => {
    expect(() => validateFileExtension('resume.docx')).not.toThrow()
  })

  it('rejects .png', () => {
    expect(() => validateFileExtension('resume.png')).toThrow()
  })

  it('rejects .exe', () => {
    expect(() => validateFileExtension('virus.exe')).toThrow()
  })

  it('rejects files with no extension', () => {
    expect(() => validateFileExtension('resume')).toThrow()
  })
})

describe('sanitizeFilename', () => {
  it('replaces special characters with underscores', () => {
    expect(sanitizeFilename('my resume 2024!')).toBe('my_resume_2024_')
  })

  it('preserves valid characters', () => {
    expect(sanitizeFilename('resume.pdf')).toBe('resume.pdf')
  })

  it('handles empty string', () => {
    expect(sanitizeFilename('')).toBe('')
  })

  it('handles path traversal attempts', () => {
    expect(sanitizeFilename('../../etc/passwd')).toBe('.._.._etc_passwd')
  })
})
