import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const tsxPath = path.resolve(rootDir, 'backend', 'node_modules', 'tsx', 'dist', 'cli.mjs')

const code = `
import { parseResumeText } from './backend/src/parsers/textParser.ts'

const text = [
  'John Doe',
  'john.doe@email.com',
  '(555) 123-4567',
  'San Francisco, CA',
  'linkedin.com/in/johndoe',
  'github.com/johndoe',
  '',
  'EXPERIENCE',
  'Senior Software Engineer at Google | 2020 - 2024',
  'Led development of React-based dashboard serving 1M+ users',
  'Built scalable microservices using Node.js and Python',
  '',
  'Software Engineer at Facebook | 2018 - 2020',
  'Developed REST APIs serving 500K+ daily requests',
  '',
  'EDUCATION',
  'Bachelor of Science in Computer Science',
  'Stanford University, 2014 - 2018',
  'GPA: 3.8/4.0',
  '',
  'SKILLS',
  'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, Redis',
  '',
  'PROJECTS',
  'E-Commerce Platform - Full-stack solution',
  'github.com/johndoe/ecommerce',
  '',
  'CERTIFICATIONS',
  'AWS Solutions Architect',
  '',
  'LANGUAGES',
  'English (Native)',
  'Spanish (Fluent)',
  '',
  'ACHIEVEMENTS',
  'Published 3 papers',
  'Speaker at ReactConf',
].join('\\\\n')

const r = parseResumeText(text)

const checks = [
  r.name === 'John Doe',
  r.email === 'john.doe@email.com',
  r.phone !== null,
  r.location !== null,
  r.linkedIn !== null,
  r.github !== null,
  r.skills.length >= 5,
  r.education.length > 0,
  r.experience.length > 0,
  r.projects.length > 0,
  r.certifications.length > 0,
  r.languages.length > 0,
  r.achievements.length > 0,
]

console.log('Name:', r.name)
console.log('Email:', r.email)
console.log('Skills:', r.skills.length)
console.log('Education:', r.education.length)
console.log('Experience:', r.experience.length)
console.log('Projects:', r.projects.length)
console.log('Certifications:', r.certifications.length)
console.log('Languages:', r.languages.length)
console.log('Achievements:', r.achievements.length)
checks.forEach((c, i) => console.log(c ? 'PASS' : 'FAIL', 'check', i))
console.log('ALL:', checks.every(Boolean))
`

const out = execSync(`node "${tsxPath}" -e "${code.replace(/"/g, '\\"')}"`, {
  cwd: rootDir,
  encoding: 'utf-8',
  timeout: 15000,
})

console.log(out)
