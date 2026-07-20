import { describe, it, expect } from 'vitest'
import { calculateAtsScore } from '../../../backend/src/ats/atsCalculator.js'
import type { ParsedResume } from '../../../backend/src/types/index.js'

function makeResume(overrides: Partial<ParsedResume> = {}): ParsedResume {
  return {
    name: null,
    email: null,
    phone: null,
    location: null,
    linkedIn: null,
    github: null,
    portfolio: null,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    ...overrides,
  }
}

describe('calculateAtsScore', () => {
  it('returns 0 for contact when resume has no contact info', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.contact).toBe(0)
  })

  it('returns 100 for contact when all fields present', () => {
    const score = calculateAtsScore(makeResume({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      portfolio: 'https://johndoe.dev',
    }))
    expect(score.contact).toBe(100)
  })

  it('scores skills progressively based on count', () => {
    const noSkills = calculateAtsScore(makeResume({ skills: [] }))
    expect(noSkills.skills).toBe(0)

    const threeSkills = calculateAtsScore(makeResume({ skills: ['js', 'ts', 'react'] }))
    expect(threeSkills.skills).toBe(40)

    const tenSkills = calculateAtsScore(makeResume({
      skills: ['js', 'ts', 'react', 'node', 'python', 'docker', 'sql', 'aws', 'git', 'graphql'],
    }))
    expect(tenSkills.skills).toBe(100)
  })

  it('scores 0 for experience when there are no entries', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.experience).toBe(0)
  })

  it('scores experience entries with company and role', () => {
    const score = calculateAtsScore(makeResume({
      experience: [{
        company: 'Acme Inc', role: 'Developer', location: 'NYC',
        startDate: '2020', endDate: '2023', description: ['Built features'],
      }],
    }))
    expect(score.experience).toBeGreaterThan(0)
    expect(score.experience).toBeLessThanOrEqual(100)
  })

  it('gives bonus for multiple experience entries', () => {
    const one = calculateAtsScore(makeResume({
      experience: [{
        company: 'A', role: 'Dev', location: '', startDate: '',
        endDate: '', description: ['Worked'],
      }],
    }))
    const two = calculateAtsScore(makeResume({
      experience: [
        { company: 'A', role: 'Dev', location: '', startDate: '', endDate: '', description: ['Worked'] },
        { company: 'B', role: 'Sr Dev', location: '', startDate: '', endDate: '', description: ['Led'] },
      ],
    }))
    expect(two.experience).toBeGreaterThan(one.experience)
  })

  it('scores 0 for projects when none exist', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.projects).toBe(0)
  })

  it('scores projects with name, description, and technologies', () => {
    const score = calculateAtsScore(makeResume({
      projects: [{
        name: 'Portfolio', description: 'My site',
        technologies: ['react', 'tailwind'], url: 'https://example.com',
      }],
    }))
    expect(score.projects).toBeGreaterThan(0)
  })

  it('scores 0 for education when none exists', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.education).toBe(0)
  })

  it('scores education entries with institution and degree', () => {
    const score = calculateAtsScore(makeResume({
      education: [{
        institution: 'MIT', degree: 'B.S.', field: 'CS',
        startDate: '2016', endDate: '2020', gpa: '3.8',
      }],
    }))
    expect(score.education).toBeGreaterThan(0)
  })

  it('scores keywords based on skill count and density', () => {
    const noSkills = calculateAtsScore(makeResume())
    expect(noSkills.keywords).toBe(0)

    const withSkills = calculateAtsScore(makeResume({
      skills: ['javascript', 'typescript', 'react', 'node', 'python'],
      experience: [{
        company: 'Co', role: 'Dev', location: '', startDate: '',
        endDate: '', description: ['Built web apps using javascript and react'],
      }],
    }))
    expect(withSkills.keywords).toBeGreaterThan(0)
  })

  it('scores formatting based on section presence', () => {
    const empty = calculateAtsScore(makeResume())
    expect(empty.formatting).toBe(0)

    const withSections = calculateAtsScore(makeResume({
      education: [{ institution: 'U', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
      experience: [{ company: 'C', role: '', location: '', startDate: '', endDate: '', description: [] }],
      skills: ['js'],
    }))
    expect(withSections.formatting).toBeGreaterThan(0)
  })

  it('returns baseline readability for empty resume', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.readability).toBe(10)
  })

  it('scores readability higher with action verbs and numbers', () => {
    const score = calculateAtsScore(makeResume({
      experience: [{
        company: 'Co', role: 'Dev', location: '', startDate: '',
        endDate: '', description: [
          '• Built a new platform using React and Node.js',
          '• Increased team productivity by 30%',
          '• Led migration of 50 services to AWS',
        ],
      }],
    }))
    expect(score.readability).toBeGreaterThan(10)
  })

  it('identifies weak areas in an empty resume', () => {
    const score = calculateAtsScore(makeResume())
    expect(score.weakAreas.length).toBeGreaterThan(0)
    expect(score.weakAreas).toContain('Missing name')
    expect(score.weakAreas).toContain('Missing email')
  })

  it('identifies strong areas in a complete resume', () => {
    const score = calculateAtsScore(makeResume({
      name: 'Jane Doe', email: 'jane@example.com', phone: '555-0000',
      linkedIn: 'https://linkedin.com/in/jane', github: 'https://github.com/jane',
      skills: ['js', 'ts', 'react', 'node', 'python', 'go', 'rust', 'docker'],
      education: [{ institution: 'MIT', degree: 'B.S.', field: 'CS', startDate: '2016', endDate: '2020', gpa: '3.8' }],
      experience: [
        { company: 'BigCo', role: 'Eng', location: '', startDate: '2020', endDate: '', description: ['• Built platform', 'Increased X by 20%'] },
        { company: 'Startup', role: 'Founder', location: '', startDate: '2018', endDate: '2020', description: ['Launched product'] },
      ],
      projects: [{ name: 'OSS Tool', description: 'A tool', technologies: ['go'], url: '' }],
    }))
    expect(score.strongAreas.length).toBeGreaterThan(0)
    expect(score.strongAreas).toContain('Email provided')
  })

  it('generates recommendations for low-scoring categories', () => {
    const score = calculateAtsScore(makeResume({
      skills: [],
      experience: [],
    }))
    expect(score.recommendations.length).toBeGreaterThan(0)
  })

  it('overall score is between 0 and 100', () => {
    const empty = calculateAtsScore(makeResume())
    expect(empty.overall).toBeGreaterThanOrEqual(0)
    expect(empty.overall).toBeLessThanOrEqual(100)

    const full = calculateAtsScore(makeResume({
      name: 'A', email: 'a@b.com', phone: '555', location: 'NY',
      linkedIn: 'https://linkedin.com/in/a', github: 'https://github.com/a',
      skills: ['js', 'ts', 'react', 'node', 'python', 'go', 'rust', 'docker', 'sql', 'aws'],
      education: [{ institution: 'U', degree: 'B.S.', field: 'CS', startDate: '2016', endDate: '2020', gpa: '' }],
      experience: [
        { company: 'C', role: 'E', location: '', startDate: '2020', endDate: '', description: ['• Did stuff', 'Increased X by 20%'] },
        { company: 'C2', role: 'E2', location: '', startDate: '2018', endDate: '2020', description: ['Led team'] },
      ],
      projects: [{ name: 'P', description: 'Desc', technologies: ['react'], url: '' }],
      certifications: ['AWS SA'],
    }))
    expect(full.overall).toBeGreaterThan(0)
    expect(full.overall).toBeLessThanOrEqual(100)
  })

  it('handles resume with quantified experience', () => {
    const score = calculateAtsScore(makeResume({
      experience: [{
        company: 'Co', role: 'Dev', location: '', startDate: '',
        endDate: '', description: ['Reduced latency by 50%', 'Managed team of 10'],
      }],
    }))
    expect(score.strongAreas.some((s) => s.includes('Quantified'))).toBe(true)
  })

  it('detects action verbs in experience', () => {
    const score = calculateAtsScore(makeResume({
      experience: [{
        company: 'Co', role: 'Dev', location: '', startDate: '',
        endDate: '', description: ['Built a microservice', 'Designed the API'],
      }],
    }))
    expect(score.strongAreas.some((s) => s.includes('action verbs'))).toBe(true)
  })
})
