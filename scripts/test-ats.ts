import { parseResumeText } from '../backend/src/parsers/textParser.js'
import { calculateAtsScore } from '../backend/src/ats/atsCalculator.js'

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
  'Improved system performance by 40%',
  '',
  'Software Engineer at Facebook | 2018 - 2020',
  'Developed REST APIs serving 500K+ daily requests',
  'Reduced latency by 60%',
  '',
  'EDUCATION',
  'Bachelor of Science in Computer Science',
  'Stanford University, 2014 - 2018',
  'GPA: 3.8/4.0',
  '',
  'SKILLS',
  'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, Redis, GraphQL, Git',
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
].join('\n')

const parsed = parseResumeText(text)
const score = calculateAtsScore(parsed)

console.log('ATS Score:', score.overall)
console.log()
console.log('Categories:')
console.log(`  Contact:     ${score.contact}`)
console.log(`  Skills:      ${score.skills}`)
console.log(`  Experience:  ${score.experience}`)
console.log(`  Projects:    ${score.projects}`)
console.log(`  Education:   ${score.education}`)
console.log(`  Keywords:    ${score.keywords}`)
console.log(`  Formatting:  ${score.formatting}`)
console.log(`  Readability: ${score.readability}`)
console.log()
console.log('Weak Areas:')
score.weakAreas.forEach((w) => console.log(`  - ${w}`))
console.log()
console.log('Strong Areas:')
score.strongAreas.forEach((s) => console.log(`  + ${s}`))
console.log()
console.log('Recommendations:')
score.recommendations.forEach((r) => console.log(`  * ${r}`))
