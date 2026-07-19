# ResumePilot

A fully local AI-powered resume analyzer. Upload, analyze, and improve your resumes — all offline with zero cloud dependency.

## Features

- **Resume Upload** — Upload PDF/DOCX files with drag-and-drop, progress indicator, replace, and delete
- **Resume Parsing** — Extract structured data: name, email, phone, skills, experience, education, projects, and certifications
- **ATS Scoring** — Calculate ATS compatibility (0–100) with category breakdown across contact, skills, experience, education, keywords, formatting, and readability
- **AI Suggestions** — Connect to a local Ollama model for grammar review, bullet improvement, professional summary, and career suggestions
- **JD Matching** — Compare resumes against job descriptions with match percentage, matching/missing skills, and actionable suggestions
- **Dashboard** — Analytics with stats cards, ATS score history chart, searchable resume list
- **Report Export** — Export analysis in JSON, Markdown, and PDF formats
- **Dark Mode** — System-aware theme with manual toggle
- **Privacy** — 100% local. No cloud, no telemetry, no data leaves your machine.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Ollama](https://ollama.com/) (optional, for AI features)

## Quick Start

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Generate Prisma client and push database schema
npm run db:generate
npm run db:push

# Start development servers (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
ResumePilot/
├── frontend/          # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages
│       ├── hooks/       # Custom hooks
│       ├── services/    # API client services
│       ├── store/       # Zustand state management
│       ├── types/       # TypeScript interfaces
│       └── routes/      # Router configuration
├── backend/           # Express + TypeScript + Prisma
│   └── src/
│       ├── controllers/ # Request handlers
│       ├── services/    # Business logic
│       ├── routes/      # API route definitions
│       ├── parsers/     # PDF/DOCX text extraction
│       ├── ats/         # ATS scoring engine
│       └── ai/          # Ollama integration
├── database/          # SQLite database files
├── storage/           # Uploaded files, exports, cache
├── tests/             # Test files
└── scripts/           # Utility scripts
```

## API Overview

| Method | Endpoint                | Description            |
|--------|-------------------------|------------------------|
| POST   | /api/resume/upload      | Upload a resume        |
| GET    | /api/resume/:id         | Get resume details     |
| DELETE | /api/resume/:id         | Delete a resume        |
| POST   | /api/resume/:id/replace | Replace resume file    |
| GET    | /api/analysis/:id       | Get analysis results   |
| POST   | /api/analysis/:id       | Trigger ATS analysis   |
| POST   | /api/jd-match/:id       | Match against JD       |
| GET    | /api/jd-match/:id       | Get JD match result    |
| GET    | /api/dashboard          | Dashboard analytics    |
| GET    | /api/export/:id/:format | Export report          |
| GET    | /api/settings           | Get settings           |
| PUT    | /api/settings/:key      | Update a setting       |
| POST   | /api/clear-cache        | Clear server cache     |

## AI Setup (Optional)

1. [Install Ollama](https://ollama.com/download)
2. Pull a model: `ollama pull llama3.1`
3. Start Ollama: `ollama serve`
4. Set the model in Settings > Default AI Model

**Recommended models:** Llama 3.1, Qwen 3, Gemma 3, Mistral

## Scripts

```bash
npm run dev            # Start both frontend and backend
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
npm run build          # Build for production
npm run test           # Run tests
npm run test:watch     # Watch mode
```

## Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| Frontend    | React 19, Vite, TypeScript, Tailwind CSS |
| Backend     | Express 5, TypeScript              |
| Database    | SQLite, Prisma ORM                 |
| Parsing     | pdf-parse, mammoth                 |
| AI          | Ollama (local LLM)                 |
| Charts      | Recharts                           |
| Icons       | Lucide React                       |

## License

MIT
