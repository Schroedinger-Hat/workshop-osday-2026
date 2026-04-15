# Workshop: From Git to Deploy

> Conference: OSDev — 11:30 / 13:00 (90 minutes)
> Audience: junior developers and intermediate professionals

---

## The App: `link-pulse`

A URL Shortener with a visit counter. Simple, understandable in 5 seconds, with enough business logic to write meaningful tests.

---

## Prerequisites

Before the workshop, make sure you have installed:

- [ ] Git — `git --version`
- [ ] Node.js LTS — `node --version`
- [ ] Docker Desktop — `docker --version` and `docker compose version`
- [ ] GitHub Account
- [ ] VS Code (or your preferred editor)

### Environment Test

```bash
git clone https://github.com/Schroedinger-Hat/workshop-osday-2026
cd workshop-osday-2026
docker compose up
# Open http://localhost:3000 — the app should appear
```

---

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Node.js + Hono (TypeScript) |
| Database | PostgreSQL |
| Testing | Vitest + Testcontainers (integration tests with a real DB) |
| Containerization | Docker (Dockerfile for frontend and backend) |
| Local Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Image Registry | GitHub Container Registry (ghcr.io) |

The monorepo uses a single runtime (Node.js), so you don't need to install Go, Python, or other languages.

---

## Repository Structure

```
link-pulse/
├── frontend/               # Next.js app
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/                # Hono API (TypeScript)
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/    # uses Testcontainers
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── backend.yml     # path filter: backend/**
│       └── frontend.yml    # path filter: frontend/**
└── README.md
```

---

## Workshop Outline (90 minutes)

### Phase 1 — Setup and Introduction (10 min)
Clone the repo, run `docker compose up`, and explore the project structure.

### Phase 2 — Adding a Feature with Tests (25 min)
Implement a visit counter using TDD: write a failing unit test, make it pass, then add an integration test with Testcontainers.

### Phase 3 — Writing a CI/CD Pipeline (25 min)
Write a GitHub Actions workflow from scratch: lint → test → build Docker image → push to ghcr.io.

### Phase 4 — Dockerfile and Docker Compose (15 min)
Understand multi-stage Docker builds and local orchestration with Docker Compose.

### Phase 5 — Deploy and Q&A (15 min)
See the full pipeline in action after a PR, and deploy locally with the updated image.
