# Changelog

## 1.0.0 (2026-07-19)

### Features

- **Resume Upload** — Upload PDF and DOCX files with drag-and-drop support, progress indicator, replace, and delete
- **Resume Parsing** — Extract name, email, phone, skills, experience, education, projects, and certifications from resumes
- **ATS Scoring** — Calculate ATS compatibility with category breakdown (contact, skills, experience, education, keywords, formatting, readability)
- **AI Analysis** — Local LLM integration via Ollama for grammar review, bullet improvement, professional summary, and career suggestions
- **JD Matching** — Compare resumes against job descriptions with match percentage, matching/missing skills, and improvement suggestions
- **Dashboard** — Analytics with stats cards, ATS score history chart, searchable resume list, and quick delete
- **Report Export** — Export analysis reports in JSON, Markdown, and PDF formats
- **Settings** — Theme toggle (light/dark), default AI model configuration, storage path display, and cache clearing
- **Performance** — Lazy loading, code splitting, React.memo optimizations, database indexes, in-memory caching
- **Security** — Helmet headers, rate limiting, input validation, path traversal prevention, UUID sanitization
- **Polish** — Page animations, loading skeletons, keyboard shortcuts, accessible UI, error boundary, enhanced empty states

### Technical

- React 19 + TypeScript frontend with Vite and Tailwind CSS
- Express 5 + TypeScript backend with Prisma ORM and SQLite
- 100% local execution — no cloud dependency, no telemetry
- 71 unit and integration tests covering ATS, parser, and validators
