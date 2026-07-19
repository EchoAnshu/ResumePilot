# 01-phases.md

# ResumePilot

## Development Roadmap

**Version:** 1.0

**Project Type:** Local AI Resume Analyzer

---

# Development Philosophy

This project must be developed **incrementally**.

Each phase should:

* Build upon the previous phase.
* Be fully functional before moving forward.
* Never contain placeholder code.
* Include proper error handling.
* Include TypeScript types.
* Be production-ready.

Do **NOT** implement future phase features early.

---

# Phase 0 — Project Planning

## Objective

Prepare the project for scalable development.

### Tasks

* Create repository
* Create documentation
* Define folder structure
* Select technology stack
* Setup Git
* Configure linting
* Configure formatting

### Deliverables

* Repository initialized
* Documentation completed
* Development environment ready

---

# Phase 1 — Project Setup

## Objective

Create the application skeleton.

### Frontend

* Create React project (Vite + TypeScript)
* Configure Tailwind CSS
* Configure React Router
* Install Zustand
* Install React Hook Form
* Install Axios
* Install Lucide Icons
* Install Recharts

### Backend

* Initialize Express
* Configure TypeScript
* Configure CORS
* Configure dotenv
* Configure logging
* Configure file upload middleware
* Configure Prisma
* Configure SQLite

### Project Structure

Create

frontend/

backend/

docs/

database/

storage/

tests/

scripts/

### Deliverables

* Frontend runs
* Backend runs
* Database connects
* No errors

Exit Criteria

* npm run dev works
* No TypeScript errors

---

# Phase 2 — UI Foundation

## Objective

Build reusable UI.

### Components

Navbar

Sidebar

Button

Input

Modal

Toast

Card

Loading Spinner

File Dropzone

Progress Bar

Theme Toggle

### Pages

Home

Dashboard

Resume Upload

Resume Analysis

Settings

About

404

### Deliverables

Responsive UI

Dark Mode

Reusable components

Exit Criteria

Every page renders successfully.

---

# Phase 3 — Resume Upload

## Objective

Implement secure file upload.

### Features

Upload PDF

Upload DOCX

Drag & Drop

Progress Indicator

Replace Resume

Delete Resume

Preview File

### Validation

Maximum 10 MB

Allowed

* PDF

* DOCX

Reject

* Images

* ZIP

* Executables

### Backend

Store uploaded file

Generate unique filename

Create metadata

### Deliverables

Resume upload complete.

Exit Criteria

Resume successfully saved.

---

# Phase 4 — Resume Parser

## Objective

Extract structured resume data.

### Libraries

pdf-parse

mammoth

### Extract

Name

Email

Phone

Location

LinkedIn

GitHub

Portfolio

Skills

Projects

Education

Experience

Certifications

Languages

Achievements

### Output

Standard JSON

### Deliverables

Resume JSON created.

Exit Criteria

Parser handles multiple resume formats.

---

# Phase 5 — ATS Engine

## Objective

Calculate ATS score.

### Categories

Contact Information

Formatting

Readability

Skills

Projects

Experience

Education

Keyword Density

Action Verbs

Overall ATS

### Output

Overall Score

Category Scores

Weak Areas

Strong Areas

Recommendations

### Deliverables

Working ATS engine.

Exit Criteria

Every uploaded resume receives a score.

---

# Phase 6 — Local AI Integration

## Objective

Connect local LLM.

### Supported Models

Qwen

Gemma

Llama

Mistral

via Ollama

### AI Tasks

Resume Summary

Grammar Review

Resume Rewrite

Bullet Improvement

Project Improvement

Experience Improvement

Action Verbs

Professional Tone

Career Suggestions

### Prompt Rules

Always return JSON.

Validate response.

Retry if invalid.

### Deliverables

AI analysis completed.

Exit Criteria

AI responds locally.

No internet required.

---

# Phase 7 — Job Description Matching

## Objective

Compare resume against job description.

### Input

Paste JD

Upload JD

### Analysis

Keyword Match

Semantic Similarity

Missing Skills

Matching Skills

ATS Match

### Output

Match %

Keyword Report

Improvement Suggestions

### Deliverables

JD matching complete.

Exit Criteria

Score generated.

---

# Phase 8 — Dashboard

## Objective

Build analytics dashboard.

### Features

Recent Resumes

Analysis History

Resume Versions

Latest ATS Score

Charts

Statistics

Search

Filter

Delete History

### Deliverables

Fully functional dashboard.

Exit Criteria

History persists.

---

# Phase 9 — Report Export

## Objective

Generate reports.

### Formats

PDF

Markdown

JSON

### Include

ATS Score

Charts

Suggestions

Resume Summary

Missing Skills

JD Match

Recommendations

### Deliverables

Professional report generation.

Exit Criteria

Reports match UI.

---

# Phase 10 — Settings

## Objective

Application customization.

### Features

Dark Mode

Light Mode

Default AI Model

Analysis Settings

Storage Location

Clear Cache

About

### Deliverables

Settings page.

---

# Phase 11 — Performance Optimization

## Objective

Improve speed.

### Tasks

Lazy Loading

Code Splitting

Image Optimization

Memoization

Caching

Database Indexes

Streaming Responses

Exit Criteria

Application remains responsive.

---

# Phase 12 — Testing

## Objective

Ensure reliability.

### Unit Tests

Parser

ATS Engine

Utilities

### Integration Tests

Upload

Analysis

Database

AI

### Manual Tests

Large PDF

Corrupted PDF

Empty Resume

Huge Resume

Image-only Resume

Exit Criteria

Critical flows pass.

---

# Phase 13 — Security

## Objective

Secure application.

### Tasks

Validate Inputs

Sanitize Data

Prevent Path Traversal

Limit Upload Size

Validate File Types

Secure Local Storage

Handle Exceptions

Exit Criteria

No critical vulnerabilities.

---

# Phase 14 — Polish

## Objective

Improve user experience.

### Tasks

Animations

Loading Skeletons

Better Icons

Keyboard Shortcuts

Accessibility

Error Pages

Better Empty States

Exit Criteria

Application feels production-ready.

---

# Phase 15 — Release

## Objective

Prepare first stable version.

### Tasks

Bug Fixes

Documentation

README

Screenshots

License

Version Tag

Release Notes

### Final Deliverables

✔ Local AI Resume Analyzer

✔ ATS Scoring

✔ Resume Parsing

✔ Job Description Matching

✔ AI Suggestions

✔ Dashboard

✔ Export Reports

✔ Local Storage

✔ Production Documentation

---

# Milestone Summary

| Milestone            | Status |
| -------------------- | ------ |
| Planning             | ☐      |
| Project Setup        | ☐      |
| UI Foundation        | ☐      |
| Resume Upload        | ☐      |
| Resume Parsing       | ☐      |
| ATS Engine           | ☐      |
| Local AI Integration | ☐      |
| JD Matching          | ☐      |
| Dashboard            | ☐      |
| Report Export        | ☐      |
| Settings             | ☐      |
| Optimization         | ☐      |
| Testing              | ☐      |
| Security             | ☐      |
| Release              | ☐      |

---

# Development Rules

* Never skip a phase.
* Finish one milestone completely before starting the next.
* Keep commits small and meaningful.
* Test after every completed phase.
* Refactor only when necessary.
* Keep the codebase modular.
* Prioritize readability over cleverness.
* Maintain backward compatibility unless intentionally breaking changes are documented.
