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
- [ ] Vite+ CLI — `curl -fsSL https://vite.plus | bash` then `vp help`
- [ ] GitHub Account
- [ ] VS Code (or your preferred editor)

### Environment Test

```bash
git clone https://github.com/Schroedinger-Hat/workshop-osday-2026
cd workshop-osday-2026/application
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
| Testing | Vitest (via Vite+) + Testcontainers (integration tests with a real DB) |
| Toolchain | Vite+ (unified dev, test, lint, format) |
| Containerization | Docker (Dockerfile for frontend and backend) |
| Local Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Image Registry | GitHub Container Registry (ghcr.io) |

The monorepo uses a single runtime (Node.js), so you don't need to install Go, Python, or other languages.

---

## Repository Structure

```
workshop-osday-2026/
├── application/
│   ├── frontend/               # Next.js app
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── backend/                # Hono API (TypeScript)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── db/
│   │   │   └── index.ts
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/    # uses Testcontainers
│   │   ├── vite.config.ts      # Vite+ unified config
│   │   ├── Dockerfile
│   │   └── package.json
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── backend.yml         # path filter: application/backend/**
│       └── frontend.yml        # path filter: application/frontend/**
├── slides.md                   # reveal-md presentation
├── README.md                   # participant guide
├── ORGANIZERS.md               # organizer guide
└── SETUP.md                    # setup log
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

---

## Tools Reference (by Phase)

This section provides a brief explanation of every tool used in the workshop, organized by the phase in which it first appears.

---

### Phase 1 — Setup and Introduction

#### Git

Git is a **distributed version control system**. It tracks every change you make to your code, lets you go back in time, and collaborate with others without overwriting each other's work.

Key concepts for this workshop:
- **Clone** — download a copy of a remote repository to your machine
- **Commit** — save a snapshot of your changes with a message
- **Branch** — a separate line of development (we'll use branches for PRs)
- **Push / Pull** — send your commits to / fetch commits from the remote repo

```bash
git clone <url>      # Download a repo
git status           # See what changed
git add .            # Stage all changes
git commit -m "msg"  # Save a snapshot
git push             # Upload to GitHub
```

#### Node.js

Node.js is a **JavaScript/TypeScript runtime** — it lets you run JS code outside the browser. In this workshop, both the frontend and backend run on Node.js, which means you only need one runtime installed.

- **npm** (Node Package Manager) handles dependencies — libraries your code needs to work.
- `package.json` is the manifest that lists your project's dependencies and scripts.

```bash
node --version   # Check your Node.js version
npm install      # Install all dependencies from package.json
npm ci           # Clean install (used in CI — faster, stricter)
```

#### Docker & Docker Compose

**Docker** packages your application and all its dependencies into a **container** — a lightweight, portable, self-contained environment that runs the same way everywhere (your laptop, CI, production).

**Docker Compose** lets you define and run **multiple containers** together with a single file (`docker-compose.yml`). In our case: frontend + backend + database.

```bash
docker --version          # Check Docker is installed
docker compose version    # Check Compose is available
docker compose up         # Start all services defined in docker-compose.yml
docker compose down       # Stop and remove all services
```

Key concepts:
- **Image** — a read-only template for creating containers (like a blueprint)
- **Container** — a running instance of an image
- **Volume** — persistent storage that survives container restarts
- **Service** — a named container definition in docker-compose.yml

#### TypeScript

TypeScript is **JavaScript with types**. It catches errors at compile time instead of runtime, making your code more reliable. Both the frontend (Next.js) and backend (Hono) in this project are written in TypeScript.

```typescript
// JavaScript — no type safety
function add(a, b) { return a + b; }
add("1", 2); // "12" — silent bug!

// TypeScript — caught at compile time
function add(a: number, b: number): number { return a + b; }
add("1", 2); // ❌ Error: string is not assignable to number
```

#### Next.js

Next.js is a **React framework** for building web applications. It handles routing, server-side rendering, and optimized builds out of the box. In this workshop, it powers the frontend where users create and view short URLs.

```bash
npm run dev    # Start the dev server with hot reload
npm run build  # Create an optimized production build
```

#### Hono

Hono is a **lightweight, fast web framework** for building APIs. Think of it as a modern alternative to Express.js, but smaller, faster, and TypeScript-first. It powers the backend of `link-pulse`.

```typescript
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/hello', (c) => c.json({ message: 'Hello!' }));
```

#### PostgreSQL

PostgreSQL (often called "Postgres") is a powerful, open-source **relational database**. It stores data in tables with rows and columns, and you query it with SQL. In `link-pulse`, it stores the short URLs and their visit counts.

```sql
-- Example: create a table for links
CREATE TABLE links (
  id    SERIAL PRIMARY KEY,
  slug  VARCHAR(10) UNIQUE NOT NULL,
  url   TEXT NOT NULL
);
```

---

### Phase 2 — Adding a Feature with Tests

#### Vite+

Vite+ is the **unified toolchain for web development**. Instead of installing and configuring separate tools for testing, linting, and formatting, Vite+ bundles everything into a single CLI (`vp`).

It combines:
- **Vitest** for testing
- **Oxlint** for linting (Rust-powered, extremely fast)
- **Oxfmt** for code formatting
- **Vite** for the dev server and builds

```bash
# Install the global CLI
curl -fsSL https://vite.plus | bash

# Core commands
vp dev        # Start the dev server
vp test run   # Run all tests once
vp test       # Run tests in watch mode
vp lint       # Lint your code
vp fmt        # Format your code
vp check      # Format + lint + type-check in one command
```

All configuration lives in a single `vite.config.ts`:

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: { globals: true, environment: 'node' },
  lint: { options: { typeAware: true } },
  fmt: {},
});
```

#### Vitest (via Vite+)

Vitest is a **blazing-fast test runner** built on top of Vite. It uses the same config and plugin pipeline as your dev server, so there's nothing extra to set up. In this workshop, Vite+ wraps Vitest — you run tests with `vp test`.

```typescript
import { describe, it, expect } from 'vitest';

describe('add', () => {
  it('should sum two numbers', () => {
    expect(1 + 2).toBe(3);
  });
});
```

- **Unit tests** — test individual functions in isolation, no external services needed
- **Integration tests** — test the full flow with real dependencies (database, etc.)

#### Testcontainers

Testcontainers lets you spin up **real Docker containers** (like a PostgreSQL database) inside your tests. Instead of mocking the database, your integration tests talk to an actual Postgres instance — giving you much higher confidence that your code works for real.

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer().start();
const connectionUri = container.getConnectionUri();
// Now run your tests against a real database!
await container.stop();
```

Why Testcontainers?
- No mocks — tests hit a real database
- Isolated — each test gets a fresh container
- Portable — runs the same locally and in CI

#### TDD (Test-Driven Development)

TDD is a development methodology where you **write tests before writing code**:

1. 🔴 **Red** — write a test that fails (the feature doesn't exist yet)
2. 🟢 **Green** — write the minimum code to make the test pass
3. 🔵 **Refactor** — clean up the code while keeping tests green

This cycle ensures every piece of code is covered by tests from the start.

---

### Phase 3 — CI/CD Pipeline

#### GitHub Actions

GitHub Actions is a **CI/CD platform** built into GitHub. It automates tasks (lint, test, build, deploy) every time you push code or open a pull request.

Key concepts:
- **Workflow** — a YAML file in `.github/workflows/` that defines automated tasks
- **Trigger** — the event that starts a workflow (`push`, `pull_request`, etc.)
- **Job** — a set of steps that run on a virtual machine
- **Step** — a single command or action within a job
- **Action** — a reusable unit of code (e.g., `actions/checkout@v4`)
- **Path filter** — run the workflow only when specific files change

```yaml
name: Backend CI
on:
  push:
    paths: ['application/backend/**']
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx vp test run
```

#### CI/CD (Continuous Integration / Continuous Delivery)

- **Continuous Integration (CI)**: every push automatically triggers lint → test → build. If anything fails, you know immediately.
- **Continuous Delivery (CD)**: when code is merged to `main`, the pipeline automatically builds a Docker image and pushes it to the registry, ready for deployment.

The goal: catch bugs early, ship with confidence, automate repetitive tasks.

#### Oxlint (via Vite+)

Oxlint is a **linter written in Rust** that checks your code for bugs, style issues, and anti-patterns. It's extremely fast — up to 100x faster than ESLint — because it's compiled to native code. Vite+ integrates Oxlint so you can run it with `vp lint`.

```bash
vp lint          # Lint all files
vp check --fix   # Auto-fix lint + format issues
```

#### GitHub Container Registry (ghcr.io)

ghcr.io is GitHub's **container image registry**. After CI builds your Docker image, it pushes the image to ghcr.io so it can be pulled and deployed anywhere.

```bash
# In CI — push an image
docker push ghcr.io/your-org/your-app:latest

# On any machine — pull and run it
docker pull ghcr.io/your-org/your-app:latest
```

---

### Phase 4 — Dockerfile and Docker Compose

#### Dockerfile (Multi-Stage Build)

A Dockerfile contains the instructions to **build a Docker image**. A **multi-stage build** uses two or more stages to keep the final image small and secure:

```dockerfile
# Stage 1: Build (includes dev tools, source code, everything)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (only the compiled output, no dev deps)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

Why multi-stage?
- **Smaller images** (~150 MB vs ~800 MB)
- **No dev dependencies** in production
- **No source code** exposed — only compiled output
- **Reduced attack surface** for security

#### Docker Compose (Orchestration)

Docker Compose defines your **entire application stack** in a single `docker-compose.yml` file. Each service (frontend, backend, database) is a container that Compose manages together.

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]

  backend:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/linkpulse

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: linkpulse
```

Key concepts:
- **Service networking** — containers talk to each other by service name (`postgres`, not `localhost`)
- **Environment variables** — configure services without changing code
- **Port mapping** — `3000:3000` maps container port to host port
- **`docker compose up`** — start everything; **`docker compose down`** — stop everything

---

### Phase 5 — Deploy

#### Local Deployment

The simplest deployment: pull the latest image and restart containers.

```bash
docker compose pull    # Download latest images from registry
docker compose up -d   # Start in detached mode (background)
docker compose logs    # View logs from all services
```

#### Fly.io (Optional Bonus)

Fly.io is a platform that deploys Docker containers to servers close to your users. It has a free tier and is a great way to see your app live on the internet.

```bash
fly launch    # Set up your app on Fly.io
fly deploy    # Deploy the latest version
```

---

## Quick Reference Card

| What | Command |
|---|---|
| Install dependencies | `npm ci` |
| Start dev server | `vp dev` |
| Run tests | `vp test run` |
| Run tests in watch mode | `vp test` |
| Lint code | `vp lint` |
| Format code | `vp fmt` |
| Format + lint + type-check | `vp check` |
| Fix lint & format issues | `vp check --fix` |
| Build for production | `npm run build` |
| Start all services | `docker compose up` |
| Stop all services | `docker compose down` |
| View service logs | `docker compose logs -f` |
| Pull latest images | `docker compose pull` |
