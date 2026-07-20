import { describe, it, expect } from 'vitest'
import { parseResumeText } from '../../../backend/src/parsers/textParser.js'

describe('parseResumeText', () => {
  it('extracts name from first line', () => {
    const result = parseResumeText('John Doe\njohn@example.com')
    expect(result.name).toBe('John Doe')
  })

  it('extracts email', () => {
    const result = parseResumeText('john.doe@example.com')
    expect(result.email).toBe('john.doe@example.com')
  })

  it('extracts phone number', () => {
    const result = parseResumeText('Call me at (555) 123-4567')
    expect(result.phone).toBe('(555) 123-4567')
  })

  it('extracts linkedIn URL', () => {
    const result = parseResumeText('https://linkedin.com/in/johndoe')
    expect(result.linkedIn).toContain('linkedin.com/in/johndoe')
  })

  it('extracts github URL', () => {
    const result = parseResumeText('https://github.com/johndoe')
    expect(result.github).toContain('github.com/johndoe')
  })

  it('extracts common skills', () => {
    const result = parseResumeText('Experienced in JavaScript, TypeScript, React, and Node.js')
    expect(result.skills).toContain('javascript')
    expect(result.skills).toContain('typescript')
    expect(result.skills).toContain('react')
    expect(result.skills).toContain('node.js')
  })

  it('extracts education entries', () => {
    const text = `Education
Massachusetts Institute of Technology
Bachelor of Science in Computer Science
2016 - 2020
GPA: 3.8 / 4.0`
    const result = parseResumeText(text)
    expect(result.education.length).toBeGreaterThan(0)
    expect(result.education[0].institution).toBe('Bachelor of Science in Computer Science')
  })

  it('extracts experience entries', () => {
    const text = `Experience
Software Engineer, Acme Corp
2019 - 2023
• Built scalable microservices
• Reduced deployment time by 40%`
    const result = parseResumeText(text)
    expect(result.experience.length).toBeGreaterThan(0)
    expect(result.experience[0].company).toContain('Acme')
  })

  it('extracts projects', () => {
    const text = `Projects
Portfolio Website
A personal site built with React and Tailwind
https://example.com`
    const result = parseResumeText(text)
    expect(result.projects.length).toBeGreaterThan(0)
    expect(result.projects[0].name).toContain('Portfolio')
  })

  it('extracts certifications', () => {
    const text = `Certifications
AWS Certified Solutions Architect
Certified Kubernetes Administrator`
    const result = parseResumeText(text)
    expect(result.certifications).toContain('AWS Certified Solutions Architect')
  })

  it('extracts languages', () => {
    const text = `Languages
English (Native)
Spanish (Fluent)`
    const result = parseResumeText(text)
    expect(result.languages.length).toBeGreaterThan(0)
  })

  it('extracts location from top of resume', () => {
    const text = 'John Doe\nSan Francisco, CA\njohn@example.com'
    const result = parseResumeText(text)
    expect(result.location).toBe('San Francisco, CA')
  })

  it('splits sections correctly', () => {
    const text = `John Doe
john@example.com

Education
MIT
B.S. Computer Science

Experience
Google
Software Engineer
Built products

Skills
JavaScript
React`
    const result = parseResumeText(text)
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
    expect(result.education.length).toBeGreaterThan(0)
    expect(result.experience.length).toBeGreaterThan(0)
    expect(result.skills).toContain('javascript')
  })

  it('handles empty text', () => {
    const result = parseResumeText('')
    expect(result.name).toBeNull()
    expect(result.email).toBeNull()
    expect(result.skills).toEqual([])
    expect(result.education).toEqual([])
    expect(result.experience).toEqual([])
    expect(result.projects).toEqual([])
  })

  it('handles text with only whitespace', () => {
    const result = parseResumeText('   \n  \n  ')
    expect(result.name).toBeNull()
  })

  it('extracts multiple skills from a technical resume', () => {
    const text = `Technical Skills
Languages: JavaScript, TypeScript, Python
Frameworks: React, Node.js, Express
Tools: Docker, Git, AWS`
    const result = parseResumeText(text)
    expect(result.skills.length).toBeGreaterThanOrEqual(6)
  })

  it('detects degree type in education', () => {
    const text = `Education
B.S. Computer Science, Stanford University`
    const result = parseResumeText(text)
    expect(result.education.length).toBeGreaterThan(0)
    expect(result.education[0].degree.toLowerCase()).toContain('b.s.')
  })
})
