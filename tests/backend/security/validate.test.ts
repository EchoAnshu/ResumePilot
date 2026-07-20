import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { validateId, validateNonEmptyString, sanitizeText, ensurePathWithin } from '../../../backend/src/security/validate.js'

describe('validateId', () => {
  it('accepts valid UUID', () => {
    expect(() => validateId('550e8400-e29b-41d4-a716-446655440000')).not.toThrow()
  })

  it('rejects non-UUID string', () => {
    expect(() => validateId('not-a-uuid')).toThrow()
    expect(() => validateId('abc-123')).toThrow()
  })

  it('rejects empty string', () => {
    expect(() => validateId('')).toThrow()
  })

  it('rejects null', () => {
    expect(() => validateId(null)).toThrow()
  })

  it('rejects undefined', () => {
    expect(() => validateId(undefined)).toThrow()
  })

  it('rejects numbers', () => {
    expect(() => validateId(123 as any)).toThrow()
  })
})

describe('validateNonEmptyString', () => {
  it('accepts valid string', () => {
    expect(() => validateNonEmptyString('hello', 'test')).not.toThrow()
  })

  it('rejects empty string', () => {
    expect(() => validateNonEmptyString('', 'test')).toThrow()
  })

  it('rejects whitespace-only string', () => {
    expect(() => validateNonEmptyString('   ', 'test')).toThrow()
  })

  it('rejects null', () => {
    expect(() => validateNonEmptyString(null, 'test')).toThrow()
  })

  it('rejects numbers', () => {
    expect(() => validateNonEmptyString(123 as any, 'test')).toThrow()
  })

  it('rejects strings exceeding max length', () => {
    const long = 'a'.repeat(1001)
    expect(() => validateNonEmptyString(long, 'test', 1000)).toThrow()
  })

  it('accepts strings within max length', () => {
    const ok = 'a'.repeat(500)
    expect(() => validateNonEmptyString(ok, 'test', 1000)).not.toThrow()
  })
})

describe('sanitizeText', () => {
  it('removes angle brackets', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
  })

  it('removes control characters', () => {
    const withControls = 'hello\x00world\x1Ftest'
    expect(sanitizeText(withControls)).toBe('helloworldtest')
  })

  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })

  it('passes through normal text', () => {
    expect(sanitizeText('Hello, world!')).toBe('Hello, world!')
  })
})

describe('ensurePathWithin', () => {
  it('returns resolved path for valid subpath', () => {
    const dir = '/storage/resumes'
    const result = ensurePathWithin(dir, 'abc123.pdf')
    expect(result).toBe(path.resolve(dir, 'abc123.pdf'))
  })

  it('throws for path traversal attempt', () => {
    const dir = '/storage/resumes'
    expect(() => ensurePathWithin(dir, '../../etc/passwd')).toThrow()
  })

  it('throws for absolute path escape', () => {
    const dir = '/storage/resumes'
    expect(() => ensurePathWithin(dir, '/etc/passwd')).toThrow()
  })
})
