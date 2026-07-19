# 04-rules.md

# ResumePilot Development Rules

**Version:** 1.0

**Project Type:** Local AI Resume Analyzer

---

# Purpose

This document defines the engineering standards, coding conventions, architectural principles, and development practices for ResumePilot.

Every contributor (human or AI coding assistant) **must follow these rules**.

---

# 1. General Principles

The project must always prioritize:

* Readability
* Maintainability
* Scalability
* Performance
* Security
* Modularity
* Offline-first architecture

Never sacrifice code quality for speed.

---

# 2. Development Philosophy

* Build one feature at a time.
* Every feature must be complete before moving to the next.
* No placeholder implementations.
* No "TODO" code in production branches.
* Every feature must be testable.
* Refactor only after functionality is verified.

---

# 3. Technology Rules

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS

## Backend

* Node.js
* Express
* TypeScript

## Database

* SQLite
* Prisma ORM

## AI

* Ollama
* Local LLM only

Cloud AI APIs are **not allowed** in Version 1.

---

# 4. Project Structure Rules

Every folder must have a single responsibility.

```text
frontend/
backend/
database/
docs/
storage/
tests/
scripts/
```

Never mix frontend and backend code.

Never place business logic in UI components.

---

# 5. Folder Naming

Use lowercase.

Correct

```text
resume-service
resume-parser
job-match
```

Incorrect

```text
ResumeService
Resume_Service
ResumeParserFolder
```

---

# 6. File Naming

Components

```text
ResumeCard.tsx
UploadZone.tsx
AnalysisChart.tsx
```

Utilities

```text
resumeParser.ts
keywordExtractor.ts
atsCalculator.ts
```

Routes

```text
resume.routes.ts
analysis.routes.ts
settings.routes.ts
```

Controllers

```text
resume.controller.ts
analysis.controller.ts
```

Services

```text
resume.service.ts
ai.service.ts
```

---

# 7. TypeScript Rules

Strict mode enabled.

Never use

```typescript
any
```

Prefer

```typescript
unknown
```

or proper interfaces.

Always create interfaces for:

* API Requests
* API Responses
* Resume
* Analysis
* AI Output

---

# 8. React Rules

Only Functional Components.

Use Hooks.

Never use Class Components.

Prefer

```typescript
const UploadPage = () => {}
```

Avoid

```typescript
class UploadPage extends Component {}
```

---

# 9. Component Rules

One component = One responsibility.

Maximum

300 lines

If larger,

split into smaller components.

---

# 10. State Management

Global

Zustand

Local

React State

Never create unnecessary global state.

---

# 11. Styling Rules

Only TailwindCSS.

No inline CSS.

Correct

```tsx
className="flex items-center gap-4"
```

Avoid

```tsx
style={{display:'flex'}}
```

---

# 12. API Rules

Every response must follow:

Success

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "",
    "error": {}
}
```

Never return inconsistent JSON.

---

# 13. HTTP Status Codes

200

Success

201

Created

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

500

Server Error

---

# 14. Error Handling

Never expose stack traces.

Every error must have

* Message
* Code
* Status

Example

```json
{
    "success": false,
    "message": "Invalid PDF.",
    "error": {
        "code": "INVALID_FILE"
    }
}
```

---

# 15. Resume Parser Rules

Always validate

* File exists
* File size
* File type

Handle

* Empty PDFs
* Corrupted PDFs
* Multi-page PDFs
* DOCX files

Never crash.

---

# 16. AI Rules

Always validate AI output.

The model must return JSON.

If JSON is invalid

Retry.

If retry fails

Return graceful error.

Never trust AI output blindly.

---

# 17. Prompt Rules

Prompts must be

* Versioned
* Stored separately
* Reusable

Store inside

```text
backend/src/prompts/
```

Never hardcode prompts inside services.

---

# 18. ATS Rules

Scores must always total **100**.

Suggested weights:

* Contact Information: 10
* Skills: 20
* Experience: 20
* Projects: 15
* Education: 10
* Keywords: 15
* Formatting: 5
* Readability: 5

Keep the algorithm deterministic.

---

# 19. Database Rules

Every table must have:

* id
* createdAt
* updatedAt

Use UUIDs.

Never duplicate data.

Always use Prisma.

---

# 20. File Storage Rules

Store uploads in

```text
storage/resumes/
```

Reports

```text
storage/reports/
```

Exports

```text
storage/exports/
```

Never store files inside `src`.

---

# 21. Logging Rules

Use structured logging.

Levels:

* INFO
* WARN
* ERROR
* DEBUG

Log:

* Upload
* Parse
* Analysis
* Export
* Settings changes

Never log sensitive personal data.

---

# 22. Git Rules

Branch naming:

```text
feature/upload
feature/parser
feature/ats
feature/dashboard

fix/parser

docs/prd

refactor/database
```

Commit messages:

```text
feat:
fix:
docs:
style:
refactor:
test:
chore:
```

Examples

```text
feat: add ATS scoring engine

fix: resolve PDF parser crash

docs: update API documentation
```

---

# 23. Security Rules

Validate every input.

Sanitize extracted text.

Reject executable files.

Maximum upload:

10 MB

Never execute uploaded content.

No cloud uploads.

No telemetry.

---

# 24. Performance Rules

Frontend

* Lazy Loading
* Code Splitting
* Memoization

Backend

* Async processing
* Efficient parsing

AI

* Stream responses
* Cache repeated prompts where appropriate

---

# 25. Testing Rules

Every feature must include:

* Unit Tests
* Integration Tests (where applicable)
* Manual Verification

Critical paths:

* Upload
* Parsing
* ATS
* AI Analysis
* JD Matching
* Export

No feature is complete until tested.

---

# 26. Accessibility Rules

Support:

* Keyboard navigation
* Focus indicators
* Screen readers
* High contrast
* Responsive layouts

Target WCAG AA where practical.

---

# 27. Documentation Rules

Every major module must include:

* Purpose
* Inputs
* Outputs
* Dependencies
* Error cases

Public functions should include clear documentation comments.

---

# 28. AI Coding Assistant Instructions

When generating code:

1. Read all files in `/docs`.
2. Follow the current phase only.
3. Do not implement future phases.
4. Keep functions small and focused.
5. Prefer composition over inheritance.
6. Explain every new file created.
7. Do not remove existing functionality unless instructed.
8. Maintain backward compatibility.
9. Write production-ready code.
10. Stop after completing the current milestone and wait for approval.

---

# 29. Code Review Checklist

Before merging, verify:

* [ ] Code builds successfully
* [ ] No TypeScript errors
* [ ] No ESLint warnings
* [ ] No unused imports
* [ ] No `console.log()` statements left in production code
* [ ] Error handling implemented
* [ ] UI is responsive
* [ ] Tests pass
* [ ] Documentation updated
* [ ] Feature matches the PRD

---

# 30. Definition of Quality

A feature is considered complete only if:

* It satisfies the PRD.
* It follows the architecture.
* It complies with these rules.
* It has been tested.
* It handles expected edge cases.
* It is documented.
* It is modular and maintainable.
* It can be extended without major refactoring.

---

# Final Rule

**Every implementation decision must align with the documentation.**

If there is a conflict:

**PRD → Architecture → Database/API → Rules → Code**

Documentation is the source of truth.
