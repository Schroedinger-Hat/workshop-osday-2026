# Workshop: From Git to Deploy

> Conference: OSDay — 11:30 / 13:00 (90 minutes)
> Audience: junior developers and intermediate professionals

In this workshop we will start from the fundamentals of Git, covering the
essential concepts needed to manage a repository effectively. We will explore
best practices for collaboration, licensing, documentation, and repository
organization.

Participants will learn the main Git commands and workflows, along with common
interactions on Git hosting platforms such as pull/merge requests and code
reviews.

Once a shared baseline is established, we will move on to topics such as code
quality, automated testing, Continuous Integration (CI), and Continuous Delivery
(CD).

The final part of the workshop will cover containerization and the deployment of
our code.

This workshop is intended for junior developers approaching these topics for the
first time, as well as intermediate profiles who want to consolidate their
knowledge.

Having a computer with a local development environment is recommended. An
internet connection will also be helpful.

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

> **💡 Zero-install alternative:** If you don't want to install anything locally, use the **Dev Container**. Open the repo in VS Code and click "Reopen in Container", or launch a **GitHub Codespace**. Everything is pre-installed. See [DEVCONTAINER.md](DEVCONTAINER.md) for details.

### Environment Test

```bash
git clone https://github.com/<your-org>/workshop-osday-2026
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
| ORM | Prisma |
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
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema (Prisma ORM)
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/    # uses Testcontainers
│   │   ├── vite.config.ts      # Vite+ unified config
│   │   ├── Dockerfile
│   │   └── package.json
│   └── deployment/
│       └── docker-compose.yml  # Deploy with ghcr.io images
├── actions/
│   ├── ci.yaml                 # CI workflow (copy to .github/workflows/)
│   └── release.yaml            # Release workflow
├── .devcontainer/
│   ├── devcontainer.json       # dev container configuration
│   ├── docker-compose.yml      # services (devcontainer + postgres)
│   └── post-create.sh          # setup script (installs deps + Vite+ + Prisma)
├── presentation/
│   └── slides.md               # reveal-md presentation
├── README.md                   # participant guide
├── ORGANIZERS.md               # organizer guide
├── DEVCONTAINER.md             # dev container documentation
└── SETUP.md                    # setup log
```

---

## Workshop Outline (90 minutes)

### Phase 0 — The Project
Introduction to the app, Git basics, forking, cloning, dev containers vs local install, running in dev container, exploring the code.

### Phase 1 — Backend
Explore the Hono API, understand routes and the Vite+ toolchain, run the backend without Docker.

### Phase 2 — Frontend
Explore the Next.js frontend, understand why SSR matters, run the frontend without Docker.

### Phase 3 — Database
PostgreSQL basics, run Postgres standalone with `docker run`, introduction to Prisma ORM (schema, generate, db push), database in the dev container.

### Phase 4 — Manual Run
Set up `.env` files, push the Prisma schema, run backend and frontend manually, verify the application works.

### Phase 5 — Adding a Feature with TDD (25 min)
Implement a visit counter using TDD: write a failing unit test (red), make it pass (green), refactor. Add an integration test with Testcontainers. Try a bonus feature.

### Phase 6 — Dockerization
What is Docker, why containers, multi-stage Dockerfiles, build and run individually, Docker Compose for local orchestration.

### Phase 7 — GitHub Actions
What is CI/CD, how GitHub Actions work, copy pre-made workflows to `.github/workflows/`, push to fork and watch the pipeline.

### Phase 8 — Docker Compose Deploy
Use pre-built images from ghcr.io, deployment docker-compose.yml, run the full app from registry images.

---

## Tools Reference (by Phase)

This section provides a brief explanation of every tool used in the workshop, organized by the phase in which it first appears.

---

### Phase 0 — The Project

#### Git

Git is a **distributed version control system**. It tracks every change you make to your code, lets you go back in time, and collaborate with others without overwriting each other's work.

Key concepts for this workshop:
- **Clone** — download a copy of a remote repository to your machine
- **Fork** — create your own copy of someone else's repo on GitHub
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

#### Dev Containers

A Dev Container is a **pre-configured development environment** that runs inside a Docker container. Open the repo in VS Code, click "Reopen in Container", and everything (Node.js, Git, Vite+, PostgreSQL) is pre-installed. Alternatively, use **GitHub Codespaces** for a cloud-based environment with zero local setup.

---

### Phase 1 — Backend

#### Node.js

Node.js is a **JavaScript/TypeScript runtime** — it lets you run JS code outside the browser. In this workshop, both the frontend and backend run on Node.js, which means you only need one runtime installed.

```bash
node --version   # Check your Node.js version
npm install      # Install all dependencies from package.json
npm ci           # Clean install (used in CI — faster, stricter)
```

#### TypeScript

TypeScript is **JavaScript with types**. It catches errors at compile time instead of runtime, making your code more reliable.

```typescript
// TypeScript — caught at compile time
function add(a: number, b: number): number { return a + b; }
add("1", 2); // ❌ Error: string is not assignable to number
```

#### Hono

Hono is a **lightweight, fast web framework** for building APIs. Think of it as a modern alternative to Express.js, but smaller, faster, and TypeScript-first. It powers the backend of `link-pulse`.

```typescript
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/hello', (c) => c.json({ message: 'Hello!' }));
```

#### Vite+

Vite+ is the **unified toolchain for web development**. Instead of installing and configuring separate tools for testing, linting, and formatting, Vite+ bundles everything into a single CLI (`vp`).

```bash
curl -fsSL https://vite.plus | bash   # Install
vp dev        # Start the dev server
vp test run   # Run all tests once
vp lint       # Lint your code (Oxlint — Rust, fast)
vp fmt        # Format your code
vp check      # Format + lint + type-check in one command
```

---

### Phase 2 — Frontend

#### Next.js

Next.js is a **React framework** for building web applications. It handles routing, server-side rendering, and optimized builds out of the box.

```bash
npm run dev    # Start the dev server with hot reload
npm run build  # Create an optimized production build
```

---

### Phase 3 — Database

#### PostgreSQL

PostgreSQL (often called "Postgres") is a powerful, open-source **relational database**. It stores data in tables with rows and columns, and you query it with SQL.

```bash
# Run Postgres standalone with Docker
docker run -d --name postgres \
  -e POSTGRES_DB=linkpulse \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

#### Prisma

Prisma is a **modern TypeScript ORM** (Object-Relational Mapping) for Node.js. Instead of writing raw SQL, you define your schema in `prisma/schema.prisma` and interact with the database using type-safe code.

```bash
npx prisma generate   # Generate the type-safe client from schema
npx prisma db push    # Sync schema to the database
```

```typescript
// Type-safe database queries
const link = await prisma.link.create({ data: { slug, url } });
const found = await prisma.link.findUnique({ where: { slug } });
const all = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
```

---

### Phase 5 — Adding a Feature with TDD

#### TDD (Test-Driven Development)

TDD is a development methodology where you **write tests before writing code**:

1. 🔴 **Red** — write a test that fails (the feature doesn't exist yet)
2. 🟢 **Green** — write the minimum code to make the test pass
3. 🔵 **Refactor** — clean up the code while keeping tests green

#### Vitest (via Vite+)

Vitest is a **blazing-fast test runner** built on top of Vite. Vite+ wraps Vitest — you run tests with `vp test`.

```typescript
import { describe, it, expect } from 'vitest';

describe('add', () => {
  it('should sum two numbers', () => {
    expect(1 + 2).toBe(3);
  });
});
```

#### Testcontainers

Testcontainers lets you spin up **real Docker containers** (like a PostgreSQL database) inside your tests. No mocks — your integration tests talk to an actual Postgres instance.

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer().start();
const connectionUri = container.getConnectionUri();
// Test against a real database!
await container.stop();
```

---

### Phase 6 — Dockerization

#### Docker & Docker Compose

**Docker** packages your application and all its dependencies into a **container** — a lightweight, portable, self-contained environment.

**Docker Compose** lets you define and run **multiple containers** together with a single `docker-compose.yml` file.

```bash
docker build -t myapp .       # Build an image from a Dockerfile
docker run -p 3000:3000 myapp # Run a container
docker compose up              # Start all services
docker compose down            # Stop everything
```

#### Dockerfile (Multi-Stage Build)

A **multi-stage build** uses two stages to keep the final image small and secure:

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Runtime (only compiled output)
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

---

### Phase 7 — GitHub Actions

#### GitHub Actions

GitHub Actions is a **CI/CD platform** built into GitHub. It automates tasks every time you push code or open a pull request.

Key concepts:
- **Workflow** — a YAML file in `.github/workflows/`
- **Trigger** — the event that starts a workflow (`push`, `pull_request`)
- **Job** — a set of steps that run on a virtual machine
- **Step** — a single command or action within a job

#### CI/CD (Continuous Integration / Continuous Delivery)

- **CI**: every push triggers lint → test → build. If anything fails, you know immediately.
- **CD**: when code is merged to `main`, the pipeline builds a Docker image and pushes it to the registry.

#### Image Tagging Best Practices

Tag images with **meaningful identifiers** instead of relying on `latest`:

| Strategy | Example | Purpose |
|---|---|---|
| SHA prefix | `sha-a1b2c3d` | Track exact commit |
| Branch-SHA-timestamp | `main-a1b2c3d-1713...` | Full traceability |
| Semantic version | `v1.0.0` | Release / production |

Our `ci.yaml` uses `docker/metadata-action` to auto-generate SHA and branch tags. The `release.yaml` promotes a SHA-tagged image to a version tag (e.g., `sha-a1b2c3d` → `v1.0.0`).

---

### Phase 8 — Docker Compose Deploy

#### GitHub Container Registry (ghcr.io)

ghcr.io is GitHub's **container image registry**. After CI builds your Docker image, it pushes the image to ghcr.io so it can be pulled and deployed anywhere.

```bash
docker pull ghcr.io/your-org/your-app:latest
docker compose up -d   # Deploy from pre-built images
```

---

## Quick Reference Card

| What | Command |
|---|---|
| Install dependencies | `npm ci` |
| Start dev server (backend) | `vp dev` |
| Start dev server (frontend) | `npm run dev` |
| Run tests | `vp test run` |
| Run tests in watch mode | `vp test` |
| Lint code | `vp lint` |
| Format code | `vp fmt` |
| Format + lint + type-check | `vp check` |
| Fix lint & format issues | `vp check --fix` |
| Generate Prisma client | `npx prisma generate` |
| Push schema to database | `npx prisma db push` |
| Build for production | `npm run build` |
| Start all services | `docker compose up` |
| Stop all services | `docker compose down` |
| View service logs | `docker compose logs -f` |
| Pull latest images | `docker compose pull` |

---

## License

This project is licensed under the [MIT License](LICENSE).
