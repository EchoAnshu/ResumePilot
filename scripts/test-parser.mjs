import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

console.log('=== Test 1: Text Parser (from raw text) ===\n')

const resumeText = `John Doe
john.doe@email.com
(555) 123-4567
San Francisco, CA
linkedin.com/in/johndoe
github.com/johndoe

EXPERIENCE
Senior Software Engineer at Google | 2020 - 2024
Led development of React-based dashboard serving 1M+ users
Built scalable microservices using Node.js and Python
Mentored junior developers and conducted code reviews

Software Engineer at Facebook | 2018 - 2020
Developed REST APIs serving 500K+ daily requests
Optimized database queries reducing latency by 40%

EDUCATION
Bachelor of Science in Computer Science
Stanford University, 2014 - 2018
GPA: 3.8/4.0

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, Redis

PROJECTS
E-Commerce Platform - Full-stack e-commerce solution with React and Node.js
github.com/johndoe/ecommerce
Task Manager - Real-time task management app using WebSockets

CERTIFICATIONS
AWS Solutions Architect
Google CloudProfessional

LANGUAGES
English (Native)
Spanish (Fluent)

ACHIEVEMENTS
Published 3 papers in peer-reviewed journals
Speaker at ReactConf 2023`

// Test the backend textParser directly
async function testTextParser() {
  const backendDir = path.resolve(rootDir, 'backend')
  const tsxPath = path.resolve(backendDir, 'node_modules', 'tsx', 'dist', 'cli.mjs')

  // Write a temp test script that imports the parser
  const testScript = `
import { parseResumeText } from '../backend/src/parsers/textParser.js'

const text = ${JSON.stringify(resumeText)}
const result = parseResumeText(text)

console.log(JSON.stringify({
  name: result.name,
  email: result.email,
  phone: result.phone,
  location: result.location,
  linkedIn: result.linkedIn,
  github: result.github,
  portfolio: result.portfolio,
  skillsCount: result.skills.length,
  skills: result.skills.slice(0, 5),
  educationCount: result.education.length,
  education: result.education.map(e => ({ institution: e.institution, degree: e.degree })),
  experienceCount: result.experience.length,
  experience: result.experience.map(e => ({ company: e.company, role: e.role })),
  projectsCount: result.projects.length,
  certificationsCount: result.certifications.length,
  languages: result.languages,
  achievementsCount: result.achievements.length,
}, null, 2))
`

  const tmpFile = path.join(process.env.TEMP || '/tmp', 'test-parser-run.mjs')
  fs.writeFileSync(tmpFile, testScript)

  const { execSync } = await import('child_process')
  try {
    const output = execSync(`node "${tsxPath}" "${tmpFile}"`, {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 15000,
    })
    console.log(output)
    const parsed = JSON.parse(output.trim())
    return parsed
  } catch (e) {
    console.error('Test failed:', e.message)
    return null
  } finally {
    fs.unlinkSync(tmpFile)
  }
}

const result = await testTextParser()

if (result) {
  console.log('\n=== Results ===')
  const checks = [
    [result.name === 'John Doe', `Name: ${result.name}`],
    [result.email === 'john.doe@email.com', `Email: ${result.email}`],
    [result.phone !== null, `Phone: ${result.phone}`],
    [result.location !== null, `Location: ${result.location}`],
    [result.linkedIn !== null, `LinkedIn: ${result.linkedIn}`],
    [result.github !== null, `GitHub: ${result.github}`],
    [result.skillsCount >= 5, `Skills: ${result.skillsCount} found`],
    [result.educationCount > 0, `Education: ${result.educationCount} entries`],
    [result.experienceCount > 0, `Experience: ${result.experienceCount} entries`],
    [result.projectsCount > 0, `Projects: ${result.projectsCount} entries`],
    [result.certificationsCount > 0, `Certifications: ${result.certificationsCount}`],
    [result.languages.length > 0, `Languages: ${result.languages.join(', ')}`],
    [result.achievementsCount > 0, `Achievements: ${result.achievementsCount}`],
  ]

  let allPassed = true
  for (const [passed, msg] of checks) {
    console.log(passed ? '  ✅' : '  ❌', msg)
    if (!passed) allPassed = false
  }

  if (allPassed) console.log('\n🎉 All parser tests passed!')
  else console.log('\n❌ Some tests failed')
}

process.exit(0)
