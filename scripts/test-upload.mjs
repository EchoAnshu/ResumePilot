import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve(process.env.TEMP || '/tmp', 'test-resume.pdf')

const boundary = '----TestBoundary' + Date.now()
const header = `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="test-resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`
const footer = `\r\n--${boundary}--\r\n`

const fileData = fs.readFileSync(filePath)
const body = Buffer.concat([
  Buffer.from(header, 'utf-8'),
  fileData,
  Buffer.from(footer, 'utf-8'),
])

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  method: 'POST',
  path: '/api/resume/upload',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  },
})

req.on('response', (res) => {
  let data = ''
  res.on('data', (c) => (data += c))
  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Body:', data)
  })
})

req.on('error', (err) => {
  console.error('Error:', err.message)
})

req.write(body)
req.end()
