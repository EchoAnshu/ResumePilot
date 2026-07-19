# 02-architecture.md

# ResumePilot

## System Architecture

Version: 1.0

Project Type: Local AI Resume Analyzer

---

# 1. Overview

ResumePilot is a **fully local, privacy-first AI Resume Analyzer**.

No data is uploaded to any cloud service.

Everything runs locally:

* Frontend
* Backend
* Database
* AI Model
* File Storage

The architecture follows a **layered modular design** to ensure maintainability, scalability, and testability.

---

# 2. High-Level Architecture

```text
                          USER
                           │
                           ▼
                React + TypeScript UI
                           │
                    Axios REST API
                           │
                           ▼
               Express Backend Server
                           │
      ┌──────────┬─────────┬─────────┬──────────┐
      │          │         │         │
      ▼          ▼         ▼         ▼
 Resume      ATS Engine   AI Engine Database
 Parser                    (Ollama)
      │                    │
      └──────────┬─────────┘
                 ▼
         Analysis Generator
                 │
                 ▼
          JSON + PDF Report
```

---

# 3. Layered Architecture

The project follows five logical layers.

```
Presentation Layer

↓

API Layer

↓

Business Logic Layer

↓

AI Layer

↓

Data Layer
```

Each layer communicates **only with the layer directly below it**.

Never skip layers.

---

# 4. Presentation Layer

Technology

* React
* TypeScript
* TailwindCSS
* Zustand

Responsibilities

* Display UI
* Upload Resume
* Show ATS Report
* Display Charts
* Handle User Input
* Export Reports

Must NOT

* Parse resumes
* Calculate ATS
* Call Ollama directly
* Access database directly

---

# 5. API Layer

Technology

Express.js

Responsibilities

Receive Requests

Validate Inputs

Authentication (future)

Call Services

Return Responses

Example Flow

```
Upload Resume

↓

POST /resume/upload

↓

Resume Controller

↓

Resume Service

↓

Parser
```

---

# 6. Business Logic Layer

Contains all application logic.

Modules

Resume Service

ATS Service

Keyword Service

JD Matching Service

Analysis Service

Report Service

History Service

Responsibilities

Business calculations

Data transformation

Validation

Error handling

Response formatting

---

# 7. AI Layer

Technology

Ollama

Supported Models

* Llama 3.1
* Gemma 3
* Qwen 3
* Mistral

Responsibilities

Grammar Review

Professional Summary

Resume Rewrite

Bullet Improvements

Project Improvements

Career Suggestions

Prompt Generation

JSON Validation

Retry Invalid Output

The AI layer **never accesses the database directly**.

---

# 8. Data Layer

Database

SQLite

ORM

Prisma

Storage

Local filesystem

Responsibilities

Store

Resumes

Reports

History

Settings

Metadata

---

# 9. Project Structure

```
ResumePilot/

frontend/
backend/
database/
storage/
docs/
tests/
scripts/
```

---

# 10. Frontend Structure

```
frontend/

src/

components/

pages/

layouts/

hooks/

services/

store/

types/

utils/

assets/

styles/

routes/

contexts/

constants/
```

---

# 11. Backend Structure

```
backend/

src/

controllers/

routes/

middleware/

services/

repositories/

parsers/

ai/

ats/

utils/

validators/

database/

config/

types/

interfaces/

constants/

prompts/
```

---

# 12. Request Flow

Resume Upload

```
User

↓

Upload Resume

↓

React

↓

Axios

↓

Express

↓

Controller

↓

Service

↓

Parser

↓

Database

↓

Response

↓

Frontend
```

---

# 13. AI Analysis Flow

```
Resume JSON

↓

Prompt Builder

↓

Ollama

↓

AI Response

↓

JSON Validator

↓

Analysis Formatter

↓

Database

↓

Frontend
```

---

# 14. ATS Flow

```
Resume

↓

Parser

↓

Extract Keywords

↓

Calculate Category Scores

↓

Overall ATS Score

↓

Generate Suggestions
```

---

# 15. Job Description Flow

```
Resume

+

Job Description

↓

Normalize Text

↓

Extract Keywords

↓

Skill Comparison

↓

Semantic Comparison

↓

Match Score

↓

Suggestions
```

---

# 16. Component Responsibilities

## Upload Component

Responsible For

* File selection
* Validation
* Progress bar

Not Responsible For

* Parsing
* ATS
* AI

---

## ATS Component

Responsible For

Display

Category scores

Charts

Suggestions

---

## Dashboard

Responsible For

History

Reports

Charts

Statistics

---

# 17. Database Flow

```
Upload

↓

Resume Table

↓

Parser

↓

Structured Resume

↓

Analysis

↓

Analysis Table

↓

Reports
```

---

# 18. File Storage

Store locally.

```
storage/

resumes/

reports/

exports/

cache/
```

Never store inside source folders.

---

# 19. Error Handling

Every layer returns structured errors.

```
Frontend

↓

API

↓

Service

↓

Catch Error

↓

Return JSON
```

Response Example

```json
{
    "success": false,
    "message": "Resume parsing failed.",
    "error": {
        "code": "PARSER_ERROR"
    }
}
```

---

# 20. API Response Format

Success

```json
{
    "success": true,
    "message": "Resume analyzed successfully.",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "Invalid PDF.",
    "error": {}
}
```

---

# 21. Design Principles

Use

* SOLID
* DRY
* KISS
* Separation of Concerns
* Dependency Injection where appropriate
* Composition over inheritance

Avoid

* God classes
* Circular dependencies
* Duplicate logic
* Tight coupling

---

# 22. Module Dependency Graph

```
UI

↓

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database
```

AI Module

```
Services

↓

Prompt Builder

↓

Ollama

↓

Validator

↓

Formatter
```

---

# 23. Scalability

Future additions should not require major architectural changes.

Designed for adding:

* Multiple AI models
* OCR support
* Multi-language resumes
* Cloud sync
* Recruiter dashboard
* Cover letter generator
* Resume templates
* Plugin system

---

# 24. Security Architecture

Validate

* File type
* File size
* JSON
* Inputs

Sanitize

* User input
* Resume text

Protect

* Local files
* Database
* AI prompts

Never execute uploaded content.

---

# 25. Performance Strategy

Frontend

* Lazy loading
* Route splitting
* Memoization

Backend

* Async processing
* Efficient parsing
* Prompt caching

Database

* Indexes
* Optimized queries

AI

* Stream responses
* Cache repeated prompts

---

# 26. Logging

Every major action should be logged.

Examples

```
Resume Uploaded

Resume Parsed

ATS Generated

AI Completed

JD Compared

Export Generated

Application Error
```

Use different log levels:

* INFO
* WARN
* ERROR
* DEBUG

---

# 27. Future Architecture

```
Desktop App

Electron

↓

React

↓

Express

↓

SQLite

↓

Ollama
```

or

```
Web App

React

↓

Express

↓

SQLite

↓

Ollama
```

The backend should remain independent of the frontend so the project can later support Electron, Tauri, or a web interface without major refactoring.

---

# 28. Architecture Rules

* One responsibility per module.
* Controllers must remain thin.
* Business logic belongs in services.
* Database access only through repositories.
* Frontend never calls Ollama directly.
* AI responses must always be validated before use.
* Every feature must be modular and independently testable.
* Every folder must have a clear purpose.
* Never place business logic inside React components.

---

# Architecture Summary

ResumePilot follows a **Layered Modular Architecture** with clear separation between the UI, API, business logic, AI engine, and data layer. This structure ensures maintainability, scalability, offline operation, and easy extension for future features while preserving user privacy.
