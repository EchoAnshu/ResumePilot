import { parseResumeText } from '../backend/src/parsers/textParser.js'
import { matchResumeWithJd } from '../backend/src/jd/jdMatcher.js'

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
].join('\n')

const jd = `We are looking for a Senior Software Engineer with expertise in React, TypeScript, Node.js, AWS, Docker, and PostgreSQL. Experience with microservices architecture and scalable systems is required. Knowledge of Python, GraphQL, and Redis is a plus. Must have strong communication and problem-solving skills.`

const parsed = parseResumeText(text)
const result = matchResumeWithJd(parsed, jd)

console.log('Match Percentage:', result.matchPercentage + '%')
console.log('Keyword Match:', result.keywordMatchPercentage + '%')
console.log()
console.log('Matching Skills:', result.matchingSkills.join(', '))
console.log('Missing Skills:', result.missingSkills.join(', ') || '(none)')
console.log()
console.log('Suggestions:')
result.suggestions.forEach((s) => console.log('  -', s))
