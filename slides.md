---
title: "From Git to Deploy"
theme: dracula
revealOptions:
  transition: slide
  controls: true
  progress: true
  hash: true
  center: true
---

<!-- .slide: data-background="#282a36" -->

# From Git to Deploy

### Workshop — OSDev 2026

Build, test, containerize, and ship a real app

<small>90 min</small>

---

## What We'll Build

### `link-pulse`

A **URL Shortener** with a visit counter

- Create short URLs
- Redirect to original URLs
- **Live feature:** visit counter per link

> Simple enough to understand in 5 seconds,
> rich enough to write meaningful tests.

---

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Hono (TypeScript) |
| Database | PostgreSQL |
| Toolchain | **Vite+** (dev, test, lint, fmt — one tool) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry |

---

## Workshop Roadmap

| Phase | Topic | Time |
|---|---|---|
| 1 | Setup & Introduction | 10 min |
| 2 | Feature + Tests (TDD) | 25 min |
| 3 | CI/CD Pipeline | 25 min |
| 4 | Dockerfile & Compose | 15 min |
| 5 | Deploy & Q&A | 15 min |

---

<!-- .slide: data-background="#44475a" -->

# Phase 1

## Setup & Introduction

<small>⏱ 10 minutes</small>

---

### Clone & Run

```bash
git clone https://github.com/<your-org>/workshop-osday-2026
cd workshop-osday-2026/application
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) — the app should appear ✅

---

### Prerequisites Check

```bash
git --version          # Git
node --version         # Node.js LTS
docker --version       # Docker
docker compose version # Docker Compose
vp help                # Vite+ CLI
```

You also need:
- A **GitHub account**
- VS Code (or your preferred editor)

> **💡 Alternatively:** use the **Dev Container** or **GitHub Codespace** — zero install needed!

---

<!-- .slide: data-background="#44475a" -->

## Meet the Tools

---

### Git — Version Control

Git tracks every change to your code and lets you collaborate without conflicts.

```bash
git clone <url>      # Download a repo
git status           # See what changed
git add .            # Stage all changes
git commit -m "msg"  # Save a snapshot
git push             # Upload to GitHub
```

Key concepts:
- **Repository** — a project tracked by Git
- **Commit** — a snapshot of your code at a point in time
- **Branch** — a parallel line of development
- **Pull Request** — propose changes and get reviews before merging

---

### Node.js — JavaScript Runtime

Node.js runs JavaScript/TypeScript **outside the browser**. Both the frontend and backend use it — one runtime for everything.

```bash
node --version   # Check version
npm install      # Install dependencies from package.json
npm ci           # Clean install (strict, for CI)
npm run build    # Run a script defined in package.json
```

- **npm** — the package manager (installs libraries)
- **package.json** — lists dependencies and scripts
- **node_modules/** — where dependencies are installed

---

### Docker — Containers

Docker packages your app into a **container** — a portable, self-contained environment that runs the same everywhere.

```bash
docker build -t myapp .       # Build an image from a Dockerfile
docker run -p 3000:3000 myapp # Run a container
docker compose up              # Start all services
docker compose down            # Stop everything
```

Think of it as:
- **Image** = blueprint (read-only)
- **Container** = running instance of an image
- **Dockerfile** = recipe to build an image
- **Compose** = run multiple containers together

---

### Docker — Why Containers?

| Without Docker | With Docker |
|---|---|
| "Works on my machine" 🤷 | Works **everywhere** ✅ |
| Install deps manually | Everything bundled |
| Different OS = different bugs | Same environment always |
| Hard to reproduce | One command: `docker compose up` |

---

### Vite+ — Unified Toolchain

One CLI to replace them all — testing, linting, formatting, dev server:

```bash
vp dev        # Start the dev server
vp test run   # Run all tests (Vitest)
vp lint       # Lint code (Oxlint — Rust, blazing fast)
vp fmt        # Format code (Oxfmt)
vp check      # fmt + lint + type-check in one shot
```

Install once:
```bash
curl -fsSL https://vite.plus | bash
```

---

### Vite+ — One Config, All Tools

Everything lives in a single `vite.config.ts`:

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  lint: {
    options: { typeAware: true },
  },
  fmt: {},
});
```

> No more juggling `vitest.config.ts`, `.eslintrc`, `.prettierrc` separately.

---

### Vite+ — Why It's Better

| | Traditional Setup | With Vite+ |
|---|---|---|
| **Tools to install** | vitest + eslint + prettier + config plugins | `vp` (one binary) |
| **Config files** | `vitest.config.ts`, `.eslintrc`, `.prettierrc`, … | `vite.config.ts` (one file) |
| **Linting speed** | ESLint — JavaScript, ~seconds | Oxlint — Rust, **up to 100x faster** |
| **Format speed** | Prettier — JavaScript | Oxfmt — Rust, **near-instant** |
| **Learning curve** | Different CLI for each tool | One CLI: `vp <command>` |
| **Version conflicts** | Tools may conflict with each other | All tested together |

---

### Vite+ — Before & After

**Before** — 5 tools, 5 configs, 5 things to keep in sync:

```bash
npx vitest run              # test
npx eslint src/             # lint
npx prettier --write src/   # format
npx tsc --noEmit            # type-check
npx vite dev                # dev server
```

**After** — one tool, one command:

```bash
vp check   # format + lint + type-check
vp test    # test
vp dev     # dev server
```

---

### Repository Structure

```text
workshop-osday-2026/
├── application/
│   ├── frontend/          # Next.js app
│   │   ├── src/
│   │   └── Dockerfile
│   ├── backend/           # Hono API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   └── db/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── vite.config.ts    # Vite+ unified config
│   │   └── Dockerfile
│   └── docker-compose.yml
├── .github/workflows/
└── README.md
```

---

<!-- .slide: data-background="#44475a" -->

# Phase 2

## Adding a Feature with Tests

<small>⏱ 25 minutes</small>

---

### The Feature: Visit Counter

Every time someone visits a short URL, we **increment a counter**.

```
GET /r/abc123  →  redirect + visits++
GET /api/links →  { ..., visits: 42 }
```

This feature **doesn't exist yet** — we'll build it live! 🔴

---

### TDD: Red → Green → Refactor

```text
1. Write a failing test        🔴
2. Write minimal code to pass  🟢
3. Refactor                    🔵
```

---

### Step 1 — Unit Test (Red 🔴)

Write a test that expects the visit counter to exist:

```typescript
import { describe, it, expect } from 'vitest';

describe('visit counter', () => {
  it('should increment visits on redirect', () => {
    // Arrange: create a link
    // Act: simulate a redirect
    // Assert: visits === 1
  });
});
```

```bash
vp test run  # ❌ Test fails — feature doesn't exist
```

---

### Step 2 — Implement (Green 🟢)

- Add `visits` column to the links table
- Increment on every redirect
- Return count in the API response

```bash
vp test run  # ✅ Test passes!
```

---

### Step 3 — Integration Test

Test with a **real PostgreSQL** database using **Testcontainers**:

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

// Spins up a real Postgres container
// Runs migrations
// Tests the full flow: create → redirect → check visits
```

> No mocks — the integration test hits a real database 🐘

---

### Key Concepts — Phase 2

- **TDD** — write tests first, then code
- **Unit tests** — fast, isolated, no external deps
- **Integration tests** — real DB via Testcontainers
- **Vite+** — `vp test` runs everything with zero config
- **Confidence** — tests prove the feature works

---

<!-- .slide: data-background="#44475a" -->

# Phase 3

## CI/CD Pipeline

<small>⏱ 25 minutes</small>

---

### What is CI/CD?

**Continuous Integration**
> Every push triggers: lint → test → build

**Continuous Delivery**
> On merge to `main`: push Docker image to registry

```text
  push → lint → test → build → push image
                                    ↓
                               ghcr.io 📦
```

---

### GitHub Actions — From Scratch

We'll write `.github/workflows/backend.yml` live:

```yaml
name: Backend CI

on:
  push:
    paths:
      - 'application/backend/**'
  pull_request:
    paths:
      - 'application/backend/**'
```

> **Path filters** — only run when backend code changes

---

### Step 1 — Lint

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: application/backend
      - run: npx vp lint
        working-directory: application/backend
```

> Vite+ uses **Oxlint** — blazing fast, Rust-powered linting 🔍

---

### Step 2 — Test

```yaml
  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: application/backend
      - run: npx vp test run
        working-directory: application/backend
```

> `vp test` wraps Vitest — Testcontainers runs in CI too! 🧪

---

### Step 3 — Build Docker Image

```yaml
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: application/backend
          push: false
          tags: ghcr.io/${{ github.repository }}/backend:latest
```

> Packages the app in a reproducible image 🐳

---

### Step 4 — Push to Registry

```yaml
      # Only on merge to main
      - uses: docker/login-action@v3
        if: github.ref == 'refs/heads/main'
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v5
        if: github.ref == 'refs/heads/main'
        with:
          context: application/backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:latest
```

> Image available for deployment 🚀

---

### The Full Pipeline

```text
  PR opened
      │
      ▼
  ┌────────┐    ┌────────┐    ┌────────┐
  │  Lint  │───▶│  Test  │───▶│ Build  │
  └────────┘    └────────┘    └────────┘
                                  │
                          merge to main?
                                  │
                                  ▼
                            ┌──────────┐
                            │ Push to  │
                            │ ghcr.io  │
                            └──────────┘
```

---

<!-- .slide: data-background="#44475a" -->

# Phase 4

## Dockerfile & Docker Compose

<small>⏱ 15 minutes</small>

---

### Multi-Stage Dockerfile (Backend)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

> Smaller image, no dev dependencies in production 📦

---

### Why Multi-Stage?

| | Single Stage | Multi-Stage |
|---|---|---|
| Image size | ~800 MB | ~150 MB |
| Dev deps | Included | Excluded |
| Source code | Included | Only compiled |
| Security | Larger surface | Minimal surface |

---

### Docker Compose

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgres://user:pass@postgres:5432/linkpulse

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: linkpulse
```

---

### Key Concepts — Phase 4

- **Multi-stage builds** — separate build & runtime
- **Docker Compose** — orchestrate multiple services locally
- **Environment variables** — configure without code changes
- **Service networking** — containers talk via service names

---

<!-- .slide: data-background="#44475a" -->

# Phase 5

## Deploy & Q&A

<small>⏱ 15 minutes</small>

---

### The Full Journey

```text
  Code Change
      │
      ▼
  Git Push / PR
      │
      ▼
  GitHub Actions
  (lint → test → build → push)
      │
      ▼
  ghcr.io (image ready)
      │
      ▼
  Deploy! 🚀
```

---

### Local Deploy with Updated Image

```bash
# Pull the latest image from the registry
docker compose pull

# Start everything with the new image
docker compose up -d

# Check it's running
curl http://localhost:3000
```

---

### What You Learned Today

✅ **TDD** — write tests first, then implement

✅ **CI/CD** — automate lint, test, build, push

✅ **Docker** — containerize apps with multi-stage builds

✅ **Docker Compose** — orchestrate services locally

✅ **GitHub Actions** — build real pipelines

✅ **Vite+** — unified toolchain (test, lint, fmt)

✅ **ghcr.io** — publish container images

---

### Want to Go Further?

🌐 **Real deployment** — try [Fly.io](https://fly.io) (free tier)

```bash
fly launch
fly deploy
```

📚 **Resources:**
- [Vite+ Docs](https://viteplus.dev)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Testcontainers](https://testcontainers.com)

---

<!-- .slide: data-background="#282a36" -->

# Thank You! 🎉

### Questions?

<br>

Happy hacking! 🚀
