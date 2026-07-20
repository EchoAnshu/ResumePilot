# Manual Test Scenarios

## Prerequisites
- Application running (`npm run dev`)
- Test files placed in `tests/manual/`

## Test 1: Normal PDF
1. Navigate to Upload page
2. Upload a standard 1-2 page PDF resume
3. Verify:
   - [ ] Resume parsed successfully
   - [ ] ATS score generated
   - [ ] All sections extracted (name, email, skills, etc.)

## Test 2: Large PDF (10MB+)
1. Create a PDF >10MB
2. Attempt upload
3. Verify:
   - [ ] Upload rejected with size error
   - [ ] No crash or timeout

## Test 3: Corrupted PDF
1. Take a text file, rename to `.pdf`
2. Attempt upload
3. Verify:
   - [ ] Graceful error message
   - [ ] Application does not crash

## Test 4: Empty Resume
1. Create a PDF with only whitespace
2. Upload and verify:
   - [ ] Parser returns empty fields
   - [ ] ATS score still generated (likely 0)
   - [ ] No crash

## Test 5: Huge Resume (50+ pages)
1. Create a PDF with 50+ pages of text
2. Upload and verify:
   - [ ] Parser handles it without timeout
   - [ ] ATS score generated

## Test 6: Image-only PDF
1. Create a PDF with scanned image (no selectable text)
2. Upload and verify:
   - [ ] Parser returns minimal/empty data
   - [ ] Graceful error or empty state
   - [ ] No crash

## Test 7: Resume without Email
1. Create a PDF resume missing email field
2. Upload and verify:
   - [ ] Parser handles missing email
   - [ ] ATS shows weak area for contact

## Test 8: Resume without Skills
1. Create a PDF with no technical skills
2. Upload and verify:
   - [ ] Parser returns empty skills array
   - [ ] ATS shows low keyword/skills score

## Test 9: Duplicate Upload
1. Upload the same file twice
2. Verify:
   - [ ] Both uploads succeed (different filenames)
   - [ ] No database conflicts

## Test 10: Unsupported File
1. Try uploading a `.png`, `.exe`, `.zip`
2. Verify:
   - [ ] Each rejected with proper error
   - [ ] No crash

## Test 11: DOCX Support
1. Upload a `.docx` resume
2. Verify:
   - [ ] Parsed successfully
   - [ ] Similar results to PDF version

## Test 12: JD Matching
1. Upload a resume
2. Navigate to JD Match page
3. Paste a job description
4. Verify:
   - [ ] Match score generated
   - [ ] Missing/matching skills listed
   - [ ] Suggestions provided

## Test 13: AI Analysis (requires Ollama)
1. Upload a resume
2. Navigate to analysis page
3. Click each AI task button
4. Verify:
   - [ ] Each returns a response
   - [ ] Responses are formatted correctly
   - [ ] Loading indicator shown during request

## Test 14: Export Reports
1. Upload and analyze a resume
2. Navigate to Analysis page
3. Click each export format (JSON, Markdown, PDF)
4. Verify:
   - [ ] Export downloads successfully
   - [ ] Content matches the on-screen analysis

## Test 15: Settings Persistence
1. Change AI model in Settings
2. Refresh the page
3. Verify:
   - [ ] Setting persists

## Test 16: Theme Persistence
1. Toggle dark mode
2. Refresh the page
3. Verify:
   - [ ] Dark mode persists

## Test 17: Clear Cache
1. Generate some exports/reports
2. Go to Settings > Clear Cache
3. Verify:
   - [ ] Toast shows freed space
   - [ ] Old exports cleared from disk

## Test 18: Dashboard
1. Upload 3+ resumes
2. Navigate to Dashboard
3. Verify:
   - [ ] Stats cards show correct counts
   - [ ] Chart renders
   - [ ] Resume list is searchable
   - [ ] Delete works

## Test 19: Responsive Layout
1. Resize browser to mobile width
2. Verify:
   - [ ] Sidebar collapses
   - [ ] All pages render without horizontal scroll
   - [ ] Navbar shows hamburger menu

## Test 20: Error Pages
1. Navigate to `/nonexistent`
2. Verify:
   - [ ] 404 page renders
   - [ ] Navigation works from 404 page
