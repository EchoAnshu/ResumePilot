import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { execSync, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const backendDir = path.resolve(rootDir, 'backend')
const tempPdf = path.join(process.env.TEMP || '/tmp', 'test-resume.pdf')

// Build backend
console.log('Building backend...')
execSync('node "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" run build', {
  cwd: backendDir, stdio: 'pipe',
})

// Create a comprehensive test PDF with resume text
const pdfLines = [
  '%PDF-1.4',
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
  '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj',
  '4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj',
  '5 0 obj<</Length 500>>stream',
  'BT',
  '/F1 14 Tf 100 750 Td (Jane Smith) Tj',
  '/F1 10 Tf 100 730 Td (jane.smith@email.com) Tj',
  '100 715 Td ((987) 654-3210) Tj',
  '100 700 Td (New York, NY) Tj',
  '100 685 Td (linkedin.com/in/janesmith) Tj',
  '100 670 Td (github.com/janesmith) Tj',
  '/F1 12 Tf 100 640 Td (EXPERIENCE) Tj',
  '/F1 10 Tf 100 620 Td (Senior Developer at Tech Corp | 2020 - 2024) Tj',
  '100 605 Td (Led development of React applications) Tj',
  '100 590 Td (Managed team of 5 engineers) Tj',
  '/F1 10 Tf 100 570 Td (Junior Developer at Startup Inc | 2018 - 2020) Tj',
  '100 555 Td (Built REST APIs using Node.js) Tj',
  '/F1 12 Tf 100 530 Td (EDUCATION) Tj',
  '/F1 10 Tf 100 510 Td (Bachelor of Science in Computer Science) Tj',
  '100 495 Td (MIT, 2014 - 2018) Tj',
  '/F1 12 Tf 100 470 Td (SKILLS) Tj',
  '/F1 10 Tf 100 450 Td (JavaScript, TypeScript, React, Node.js, Python, AWS, Docker) Tj',
  'ET',
  'endstream',
  'endobj',
  'xref',
  '0 6',
  '0000000000 65535 f ',
  '0000000009 00000 n ',
  '0000000058 00000 n ',
  '0000000115 00000 n ',
  '0000000266 00000 n ',
  '0000000335 00000 n ',
  'trailer<</Size 6/Root 1 0 R>>',
  'startxref',
  '436',
  '%%EOF',
]

fs.writeFileSync(tempPdf, pdfLines.join('\n'))
console.log('✅ Test PDF created')

// Start backend
const server = spawn('node', ['dist/index.js'], {
  cwd: backendDir,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '3009' },
})

server.stdout.on('data', (d) => {
  const line = d.toString()
  if (line.includes('Server running')) console.log('✅ Backend started on port 3009')
})
server.stderr.on('data', (d) => {
  const text = d.toString()
  if (!text.includes('ExperimentalWarning') && !text.includes('Warning:')) process.stderr.write(`[err] ${text}`)
})

await new Promise((r) => setTimeout(r, 4000))

function request(method, pathname, body, headers) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3009, method, path: pathname, headers }
    const req = http.request(opts, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
        catch { resolve({ status: res.statusCode, body: data }) }
      })
    })
    req.on('error', (e) => reject(e))
    if (body) req.write(body)
    req.end()
  })
}

let resumeId

try {
  // 1. Upload
  console.log('\n--- Upload Resume ---')
  const boundary = '----B' + Date.now()
  const fileData = fs.readFileSync(tempPdf)
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="test-resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
    fileData,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ])

  const upload = await request('POST', '/api/resume/upload', body, {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': String(body.length),
  })
  if (!upload.body.success) throw new Error('Upload: ' + JSON.stringify(upload.body))
  resumeId = upload.body.data.id
  console.log(`✅ Uploaded: ${upload.body.data.originalName}`)

  // 2. Get parsed data
  console.log('\n--- Get Parsed Resume ---')
  const parsed = await request('GET', `/api/resume/${resumeId}/parsed`)
  if (!parsed.body.success) throw new Error('Parse: ' + JSON.stringify(parsed.body))
  const data = parsed.body.data

  console.log(`   Name: ${data.name}`)
  console.log(`   Email: ${data.email}`)
  console.log(`   Phone: ${data.phone}`)
  console.log(`   Location: ${data.location}`)
  console.log(`   LinkedIn: ${data.linkedIn}`)
  console.log(`   GitHub: ${data.github}`)
  console.log(`   Skills (${data.skills.length}): ${data.skills.join(', ')}`)
  console.log(`   Education: ${data.education.length} entries`)
  console.log(`   Experience: ${data.experience.length} entries`)
  console.log(`   Projects: ${data.projects.length} entries`)

  // Verify key fields
  const checks = [
    [data.name !== null, 'Name extracted'],
    [data.email !== null, 'Email extracted'],
    [data.phone !== null, 'Phone extracted'],
    [data.location !== null, 'Location extracted'],
    [data.linkedIn !== null, 'LinkedIn extracted'],
    [data.github !== null, 'GitHub extracted'],
    [data.skills.length >= 3, `Skills extracted (${data.skills.length})`],
    [data.education.length > 0, `Education extracted (${data.education.length})`],
    [data.experience.length > 0, `Experience extracted (${data.experience.length})`],
  ]

  let allPassed = true
  for (const [passed, label] of checks) {
    console.log(passed ? `   ✅ ${label}` : `   ❌ ${label}`)
    if (!passed) allPassed = false
  }

  if (allPassed) console.log('\n🎉 All parser tests passed!')
  else console.log('\n❌ Some tests failed')

} catch (err) {
  console.error('❌ Test failed:', err.message)
} finally {
  server.kill()
  if (fs.existsSync(tempPdf)) fs.unlinkSync(tempPdf)
  process.exit(0)
}
