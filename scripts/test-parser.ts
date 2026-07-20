import { parseResumeText } from '../backend/src/parsers/textParser.js'

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
].join('\n')

const r = parseResumeText(text)

const checks: [string, boolean][] = [
  ['Name', r.name === 'John Doe'],
  ['Email', r.email === 'john.doe@email.com'],
  ['Phone', r.phone !== null],
  ['Location', r.location !== null],
  ['LinkedIn', r.linkedIn !== null],
  ['GitHub', r.github !== null],
  ['Skills >=5', r.skills.length >= 5],
  ['Education >0', r.education.length > 0],
  ['Experience >0', r.experience.length > 0],
  ['Projects >0', r.projects.length > 0],
  ['Certifications >0', r.certifications.length > 0],
  ['Languages >0', r.languages.length > 0],
  ['Achievements >0', r.achievements.length > 0],
]

console.log('Results:')
console.log(`  Name: ${r.name}`)
console.log(`  Email: ${r.email}`)
console.log(`  Phone: ${r.phone}`)
console.log(`  Location: ${r.location}`)
console.log(`  LinkedIn: ${r.linkedIn}`)
console.log(`  GitHub: ${r.github}`)
console.log(`  Skills: ${r.skills.length}`)
console.log(`  Education: ${r.education.length}`)
console.log(`  Experience: ${r.experience.length}`)
console.log(`  Projects: ${r.projects.length}`)
console.log(`  Certifications: ${r.certifications.length}`)
console.log(`  Languages: ${r.languages.length}`)
console.log(`  Achievements: ${r.achievements.length}`)

let allPassed = true
for (const [label, passed] of checks) {
  console.log(passed ? '  PASS' : '  FAIL', '-', label)
  if (!passed) allPassed = false
}

console.log(allPassed ? '\nALL TESTS PASSED' : '\nSOME TESTS FAILED')
process.exit(allPassed ? 0 : 1)
