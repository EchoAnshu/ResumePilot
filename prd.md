# 00-prd.md

# ResumePilot

### Product Requirements Document (PRD)

**Version:** 1.0

**Project Type:** Local AI Resume Analyzer

**Status:** Planning

**Author:** Project Owner

---

# 1. Product Overview

ResumePilot is a **fully local AI-powered Resume Analyzer** that helps users evaluate and improve their resumes using a locally running Large Language Model (LLM). Unlike cloud-based resume analyzers, ResumePilot performs all processing on the user's machine, ensuring privacy, offline capability, and zero API costs.

The application allows users to:

* Upload resumes (PDF/DOCX)
* Parse resume content into structured data
* Analyze ATS compatibility
* Calculate a custom ATS score
* Compare resumes with job descriptions
* Identify missing keywords and skills
* Suggest improvements using a local AI model
* Export reports
* Store analysis history locally

---

# 2. Vision

Create a professional-grade resume analysis tool that provides meaningful, actionable feedback while keeping all user data on the local machine.

---

# 3. Goals

### Primary Goals

* 100% local execution
* No cloud dependency
* Fast analysis (<10 seconds for typical resumes)
* Professional ATS analysis
* Clean, modern UI
* Modular architecture
* Easy future expansion

---

# 4. Target Users

### Primary

* Students
* Fresh Graduates
* Software Developers
* Job Seekers

### Secondary

* Recruiters
* Career Coaches
* HR Professionals

---

# 5. Success Metrics

* Resume analyzed successfully
* ATS score generated
* AI suggestions generated
* JD matching completed
* Report exported
* Application works without internet

---

# 6. Scope

## Included

✔ Resume Upload

✔ Resume Parsing

✔ ATS Analysis

✔ Keyword Analysis

✔ Skill Gap Detection

✔ Grammar Suggestions

✔ Resume Improvement Suggestions

✔ Job Description Matching

✔ Local Storage

✔ Export Reports

✔ Dark Mode

---

## Not Included (v1)

* Cloud Login
* User Accounts
* Online Database
* Payment System
* Team Collaboration
* Multi-user Sync

---

# 7. Functional Requirements

## Module 1 — Resume Upload

### Features

* Upload PDF
* Upload DOCX
* Drag & Drop
* Browse Files
* Replace Resume
* Delete Resume

### Validation

Supported formats

* PDF

* DOCX

Maximum Size

* 10 MB

Errors

* Unsupported format
* Corrupted file
* Empty document
* Large file

Acceptance Criteria

* Upload completes successfully
* Resume stored locally

---

# Module 2 — Resume Parser

The parser converts uploaded documents into structured JSON.

Extract:

* Full Name
* Email
* Phone
* LinkedIn
* GitHub
* Portfolio
* Skills
* Education
* Experience
* Projects
* Certifications
* Languages
* Awards

Output Example

```json
{
"name":"",
"email":"",
"skills":[],
"projects":[],
"experience":[]
}
```

Acceptance Criteria

* Extract text successfully
* Preserve formatting where possible
* Handle multiple pages

---

# Module 3 — ATS Engine

Generate a score between

0–100

Score Categories

### Contact Information

10%

### Skills

20%

### Experience

20%

### Education

10%

### Keywords

20%

### Formatting

10%

### Readability

10%

Output

Overall ATS Score

Category Scores

Weak Areas

Strong Areas

Recommendations

Acceptance Criteria

* Score always generated
* Score reproducible
* Category breakdown available

---

# Module 4 — Job Description Matching

Input

Paste Job Description

or

Upload Job Description

Features

* Semantic Matching
* Keyword Comparison
* Missing Skills
* Matching Skills
* Match Percentage

Output

Example

Resume Match

84%

Missing Skills

* Docker
* Redis
* AWS

Acceptance Criteria

* Match score generated
* Missing keywords listed

---

# Module 5 — AI Analysis

Uses local LLM.

Tasks

Generate

Professional Summary

Strengths

Weaknesses

Suggestions

Grammar Corrections

Resume Improvements

Impact Analysis

Bullet Improvements

Action Verbs

Expected Output

```text
Strengths

- Strong backend skills

Weaknesses

- Missing quantified achievements

Suggestions

- Add metrics
- Add certifications
```

Acceptance Criteria

* Response under 15 seconds
* Consistent formatting

---

# Module 6 — Dashboard

Displays

Recent Analyses

Saved Reports

Resume History

Statistics

Latest ATS Score

Charts

Acceptance Criteria

* Loads in under 2 seconds

---

# Module 7 — Export

Export formats

PDF

Markdown

JSON

Acceptance Criteria

Export identical to preview

---

# 8. Non Functional Requirements

Performance

Resume parsing <3 seconds

AI analysis <15 seconds

Memory

Under 2GB RAM (excluding local AI model)

Reliability

Application should not crash due to malformed resume.

Maintainability

Modular architecture

Reusable components

Security

No internet required

No cloud upload

No telemetry

Privacy

Everything stored locally.

---

# 9. User Flow

Home

↓

Upload Resume

↓

Resume Parsed

↓

ATS Analysis

↓

AI Analysis

↓

JD Matching

↓

Improvement Suggestions

↓

Export Report

---

# 10. User Stories

As a student,

I want to know if my resume is ATS-friendly.

---

As a software engineer,

I want AI to improve my project descriptions.

---

As a recruiter,

I want a quick ATS score.

---

As a fresher,

I want to compare my resume with a job description.

---

# 11. Edge Cases

Empty Resume

Corrupted PDF

Scanned PDF

Resume without Email

Resume without Skills

Very Long Resume

Image-only Resume

Duplicate Upload

Large File

Unsupported File

---

# 12. Tech Stack

Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Zustand
* React Hook Form

Backend

* Node.js
* Express
* TypeScript

Database

* SQLite
* Prisma ORM

Resume Parsing

* pdf-parse
* mammoth

AI

* Ollama

Recommended Models

* Qwen 3
* Gemma 3
* Llama 3.1
* Mistral

Charts

* Recharts

Icons

* Lucide React

---

# 13. Folder Structure

```
ResumePilot

frontend/

backend/

docs/

storage/

database/

tests/

scripts/

README.md
```

---

# 14. MVP Checklist

* Upload Resume
* Parse Resume
* Display Resume Data
* ATS Score
* AI Suggestions
* JD Matching
* Export PDF
* Save History

---

# 15. Future Enhancements

* Multi-language support
* Multiple resume versions
* Resume templates
* Cover letter generator
* LinkedIn profile analysis
* GitHub profile analysis
* Portfolio website review
* AI interview question generator
* Resume rewriting assistant
* Recruiter simulation mode
* Batch resume analysis
* Plugin system for custom scoring
* OCR support for scanned resumes
* Skill roadmap generation
* AI-powered project description enhancement

---

# 16. Definition of Done

The project is considered complete when:

* Users can upload PDF and DOCX resumes.
* Resume content is parsed into structured data.
* ATS score is calculated with category-wise breakdown.
* AI generates actionable improvement suggestions using a local LLM.
* Job descriptions can be compared against resumes with match scores and missing keywords.
* Reports can be exported.
* All data remains local with no cloud dependency.
* The application is responsive, stable, and documented.
