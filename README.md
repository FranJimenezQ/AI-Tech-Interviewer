# AI Tech CV Analyzer

An AI-powered web application that analyzes your CV against a job description and returns a detailed match report with actionable improvement suggestions.

**Live Demo:** [ai-tech-interviewer-iota.vercel.app](https://ai-tech-interviewer-iota.vercel.app)

---

## What it does

1. Upload your CV as a PDF
2. Select your target seniority level
3. Paste the job description you're targeting
4. Get an instant AI analysis with fit score, keyword match, seniority alignment, and specific suggestions to improve your CV for that role

---

## Tech Stack

### Frontend
- **Angular 19** — Standalone components, Signals for state management, lazy loading
- **TypeScript** — Strict typing across the entire codebase
- **SCSS** — Custom design system with CSS variables
- **pdfjs-dist** — Client-side PDF text extraction

### Backend
- **Next.js 16** — API Routes as a BFF (Backend For Frontend)
- **Groq API** — LLM inference with `llama-3.3-70b-versatile`
- **TypeScript** — End-to-end type safety

### Infrastructure
- **Vercel** — Frontend (static) + Backend (serverless functions)
- **GitHub** — Source control + CI/CD via Vercel integration

---

## Architecture

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   Angular Frontend      │         │   Next.js API            │
│   (Vercel Static)       │──POST──▶│   (Vercel Serverless)    │
│                         │         │                          │
│  - PDF text extraction  │         │  - Request validation    │
│  - Signals state mgmt   │◀──JSON──│  - Groq API call         │
│  - Responsive UI        │         │  - JSON response         │
└─────────────────────────┘         └──────────┬───────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │   Groq API           │
                                    │   llama-3.3-70b      │
                                    └──────────────────────┘
```

The Angular app runs as a static SPA. The Next.js project acts exclusively as a BFF — it never serves frontend assets, only the `/api/analyze` endpoint. This keeps the Groq API key secure on the server side.

---

## Features

- **Fit Score** — Percentage match between the CV and the job description
- **Keyword Analysis** — How many of the role's key terms appear in the CV
- **Seniority Alignment** — Whether the CV's experience level matches the role
- **Format Check** — Assessment of CV structure and length
- **Suggested Changes** — 3–6 specific, actionable improvements with examples
- **Skeleton Loading** — Shimmer animation while the AI processes
- **Error Handling** — User-friendly error states with retry option
- **Mobile Responsive** — Separate analysis screen on mobile with back navigation

---

## Running Locally

### Prerequisites
- Node.js v20+
- A [Groq API key](https://console.groq.com) (free tier available)

### 1. Clone the repo

```bash
git clone https://github.com/FranJimenezQ/AI-Tech-Interviewer.git
cd AI-Tech-Interviewer
```

### 2. Start the API

```bash
cd api
npm install
```

Create `api/.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

```bash
npm run dev
# Runs on http://localhost:3000
```

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npx ng serve
# Runs on http://localhost:4200
```

The Angular dev server proxies `/api` requests to `localhost:3000` via `proxy.conf.json`.

---

## Project Structure

```
AI-Tech-Interviewer/
├── client/                          # Angular 19 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/          # TypeScript interfaces
│   │   │   │   └── services/        # AnalysisService (Signals)
│   │   │   ├── features/
│   │   │   │   ├── home/            # Upload form + layout
│   │   │   │   └── analysis/        # Results panel
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           └── skeleton/    # Loading skeleton
│   │   └── environments/            # Dev + prod config
│   └── proxy.conf.json              # Dev proxy to API
│
└── api/                             # Next.js BFF
    └── app/
        └── api/
            └── analyze/
                └── route.ts         # POST /api/analyze
```

---

## Key Engineering Decisions

**Angular Signals over NgRx** — The app state is simple enough (one analysis at a time) that Signals provide a clean, lightweight solution without the boilerplate of a full store.

**PDF extraction on the client** — Using `pdfjs-dist` in the browser means the raw PDF never leaves the user's device. Only the extracted text is sent to the API, reducing payload size and improving privacy.

**Next.js as BFF** — Keeping the Groq API key in a serverless function prevents exposure in the browser bundle. The Angular app never has direct access to the key.

**Lazy loading routes** — Both `HomeComponent` and `AnalysisComponent` are lazy loaded, keeping the initial bundle under 72KB transferred.

---

## Author

**Francisco Jiménez** — Angular Frontend Developer & AI Engineering enthusiast

- GitHub: [@FranJimenezQ](https://github.com/FranJimenezQ)
- Portfolio: [franjimenezq.github.io/portafolio](https://franjimenezq.github.io/portafolio/)