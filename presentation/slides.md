---
title: "From Git to Deploy"
revealOptions:
  transition: slide
  controls: true
  progress: true
  hash: true
  center: true
---

<!-- .slide: data-background="#282a36" -->

# From Git to Deploy

### Workshop — OSDay 2026

<small>⏱️ 90 minutes</small>

---

## What We'll Build?

---

### `link-pulse`

A **URL Shortener** with a visit counter

- Create short URLs
- Redirect to original URLs
- **Live feature:** visit counter per link

---

## Workshop Roadmap

| Phase | Topic |
|---|---|
| 0 | The Project |
| 1 | Backend |
| 2 | Frontend |
| 3 | Database |
| 4 | Manual Run |
| 5 | TDD — Adding a Feature |
| 6 | Dockerization |
| 7 | GitHub Actions |
| 8 | Docker Compose Deploy |

---

| Component | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Hono (TypeScript) |
| Database | PostgreSQL |
| ORM | **Prisma** |
| Toolchain | **Vite+** (dev, test, lint, fmt — one tool) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry |

---

<!-- .slide: data-background="#44475a" -->

# Phase 0

## The Project

---

### What is a URL Shortener?

A service that takes a long URL and gives you a short one.

```text
Input:  https://very-long-website.com/articles/2026/my-super-long-article
Output: https://lnk.sh/abc1234
```

When someone visits the short URL → they get **redirected** to the original.

Simple concept, real-world engineering:
- A **backend** to store and resolve links
- A **frontend** to create and view links
- A **database** to persist everything

---

### What is Version Control?

A system that **tracks every change** to your code over time.

- Go back to any previous version
- See who changed what and when
- Work on the same code with a team without conflicts
- Every change is a **commit** — a snapshot with a message

Without version control:
```text
project_final.zip
project_final_v2.zip
project_FINAL_REAL.zip  ← 😩
```

---

### Git — Version Control

**Git** is the most popular version control system.

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

---

### What is Forking?

A **fork** is your own copy of someone else's repository.

```text
Original repo (Schroedinger-Hat/workshop-osday-2026)
         │
         ▼  Fork
Your repo (your-username/workshop-osday-2026)
```

- You can change anything without affecting the original
- You can propose changes back via a **Pull Request**

---

### Fork & Clone

1. Go to the repo on GitHub
2. Click **Fork** → creates your copy
3. Clone your fork:

```bash
git clone https://github.com/<your-username>/workshop-osday-2026
cd workshop-osday-2026
```

Now you have the full project on your machine! 🎉

---

### What is a Dev Container?

A **pre-configured development environment** that runs inside a Docker container.

| | Local Install | Dev Container |
|---|---|---|
| Setup time | 30+ min (install Node, Docker, etc.) | ~2 min (auto) |
| "Works on my machine" | Maybe 🤷 | Always ✅ |
| Consistent environment | No | Yes |
| Requires Docker | No | Yes |

> We'll learn more about Docker in Phase 6!

---

### Dev Container vs Local

**Option A — Dev Container (recommended for beginners)**
- Open the repo in VS Code → "Reopen in Container"
- Or use **GitHub Codespaces** (cloud, nothing to install)
- Everything is pre-installed: Node.js, Git, Vite+, PostgreSQL

**Option B — Local install**
- Install Git, Node.js, Docker, Vite+ manually
- More control, but more setup

---

### Run in Dev Container

1. Open the repo in VS Code
2. Click **"Reopen in Container"**
3. Wait ~2 minutes for the build
4. Open a terminal — you're ready! ✅

Or via **Codespaces**:
1. On GitHub → **Code** → **Codespaces** → **Create codespace**
2. A full VS Code opens in your browser

---

### Read the Code! 📖

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
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── tests/
│   │   └── Dockerfile
│   └── deployment/
│       └── docker-compose.yml
├── actions/               # Pre-made GitHub Actions
├── .devcontainer/
└── README.md
```

Take 2 minutes to explore! 🔍

---

<!-- .slide: data-background="#44475a" -->

# Phase 1

## Backend

---

### What is a Web API?

An **API** (Application Programming Interface) lets programs talk to each other over HTTP.

```text
Frontend (browser)                 Backend (server)
     │                                  │
     │  POST /api/links                 │
     │  { url: "https://..." }   ──▶    │  Create link
     │                                  │
     │  ◀──  { slug: "abc1234" }        │  Return result
```

- **REST** = a convention for organizing APIs
- Uses HTTP methods: `GET`, `POST`, `PUT`, `DELETE`

---

### What is a Web Framework?

A library that handles **routing, requests, and responses** so you don't have to write everything from scratch.

Without a framework:
```javascript
// Parse URL manually, handle HTTP methods, manage headers...
```

With a framework:
```typescript
app.get('/api/links', (c) => c.json(links));
app.post('/api/links', (c) => { /* create link */ });
```

---

### Hono — Our Backend Framework

**Hono** is a lightweight, fast, TypeScript-first web framework.

```typescript
import { Hono } from 'hono';
const app = new Hono();

app.get('/', (c) => c.json({ status: 'ok' }));

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const link = await prisma.link.findUnique({ where: { slug } });
  return c.redirect(link.url, 302);
});
```

- Modern alternative to Express.js
- Built for TypeScript from day one
- Tiny footprint, very fast

---

### Our API Code

```text
application/backend/
├── src/
│   ├── index.ts          # App entry point + redirect route
│   ├── routes/
│   │   └── links.ts      # POST /api/links, GET /api/links
│   ├── db/
│   │   └── index.ts      # Prisma client singleton
│   └── utils.ts          # Slug generator (nanoid)
├── prisma/
│   └── schema.prisma     # Database schema
├── tests/
└── vite.config.ts
```

---

### What is a Toolchain?

A set of tools that help you **develop, test, lint, and format** your code.

Traditional approach:
```bash
npx vitest run              # test
npx eslint src/             # lint
npx prettier --write src/   # format
npx tsc --noEmit            # type-check
```

4 tools, 4 configs, 4 things to keep in sync 😫

---

### Vite+ — Unified Toolchain

One CLI to replace them all:

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

### Run the Backend (without Docker)

```bash
cd application/backend
npm ci          # Install dependencies
vp dev          # Start dev server on http://localhost:3001
```

Test it:
```bash
curl http://localhost:3001/
# → { "status": "ok" }
```

---

<!-- .slide: data-background="#44475a" -->

# Phase 2

## Frontend

---

### What is Server-Side Rendering?

**SSR** means the server generates HTML before sending it to the browser.

| | Client-Side (SPA) | Server-Side (SSR) |
|---|---|---|
| First load | Blank → JS loads → content | Content immediately |
| SEO | Poor (bots see blank page) | Great (full HTML) |
| Performance | Slower first paint | Faster first paint |

---

### What is a Frontend Framework?

A library that helps you build **user interfaces** with reusable components.

```jsx
// A React component
function LinkCard({ slug, url, visits }) {
  return (
    <div>
      <a href={`/${slug}`}>/{slug}</a>
      <p>{url}</p>
      <span>{visits} visits</span>
    </div>
  );
}
```

---

### Next.js — Our Frontend

**Next.js** is a React framework that handles routing, SSR, and optimized builds.

Why Next.js?
- **File-based routing** — `pages/about.tsx` → `/about`
- **Server-side rendering** — fast first load, great SEO
- **API routes** — backend endpoints inside the frontend (we use Hono instead)
- **Optimized builds** — automatic code splitting, image optimization

---

### Our Frontend Code

```text
application/frontend/
├── src/
│   └── app/              # Next.js App Router
│       ├── page.tsx      # Home page — create & list links
│       └── layout.tsx    # Root layout
├── Dockerfile
├── next.config.mjs
└── package.json
```

---

### Run the Frontend (without Docker)

```bash
cd application/frontend
npm ci          # Install dependencies
npm run dev     # Start dev server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🌐

> ⚠️ The frontend needs the backend running to work!

---

<!-- .slide: data-background="#44475a" -->

# Phase 3

## Database

---

### What is a Relational Database?

A system that stores data in **tables** with rows and columns, linked by relationships.

```sql
Table: links
┌────┬─────────┬──────────────────────┬────────┐
│ id │  slug   │        url           │ visits │
├────┼─────────┼──────────────────────┼────────┤
│  1 │ abc1234 │ https://example.com  │     42 │
│  2 │ xyz5678 │ https://github.com   │     17 │
└────┴─────────┴──────────────────────┴────────┘
```

You query it with **SQL** (Structured Query Language).

---

### PostgreSQL

**PostgreSQL** (Postgres) is a powerful, open-source relational database.

- Battle-tested — used by Instagram, Spotify, Netflix
- Rich feature set — JSON, full-text search, extensions
- Free and open-source

```bash
# Run Postgres with Docker (standalone)
docker run -d \
  --name postgres \
  -e POSTGRES_DB=linkpulse \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

---

### What is an ORM?

An **ORM** (Object-Relational Mapping) lets you interact with the database using **code objects** instead of raw SQL.

| | Raw SQL | ORM |
|---|---|---|
| Create | `INSERT INTO links (slug, url) VALUES ('abc', 'https://...')` | `prisma.link.create({ data: { slug, url } })` |
| Read | `SELECT * FROM links WHERE slug = 'abc'` | `prisma.link.findUnique({ where: { slug } })` |
| Update | `UPDATE links SET visits = visits + 1 WHERE slug = 'abc'` | `prisma.link.update({ where: { slug }, data: { visits: { increment: 1 } } })` |

Benefits: **type safety**, **auto-completion**, **migrations**

---

### Prisma — Our ORM

**Prisma** is a modern TypeScript ORM for Node.js.

1. Define your schema in `prisma/schema.prisma`
2. Generate a type-safe client
3. Use it in your code

```bash
npx prisma generate   # Generate the client from schema
npx prisma db push    # Sync schema to database
```

---

### Prisma Schema

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Link {
  id        Int      @id @default(autoincrement())
  slug      String   @unique
  url       String
  visits    Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("links")
}
```

---

### Prisma in Action

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a link
const link = await prisma.link.create({
  data: { slug: 'abc1234', url: 'https://example.com' },
});

// Find a link
const found = await prisma.link.findUnique({
  where: { slug: 'abc1234' },
});

// List all links
const all = await prisma.link.findMany({
  orderBy: { createdAt: 'desc' },
});
```

> Full type safety — your editor knows every field! ✨

---

### Database in the Dev Container

The dev container **already includes PostgreSQL** — no setup needed!

```yaml
# .devcontainer/docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linkpulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

Environment variable pre-set:
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/linkpulse
```

---

<!-- .slide: data-background="#44475a" -->

# Phase 4

## Manual Run

---

### What are Environment Variables?

Configuration values that live **outside your code**.

```text
Code says:          "connect to the database"
Env var tells it:   WHERE to connect
```

Why?
- **Security** — don't put passwords in code
- **Flexibility** — different values per environment (dev, staging, production)
- **Portability** — same code, different configuration

---

### Setup `.env`

```bash
cd application/backend

# Copy the example file
cp .env.example .env
```

Contents of `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/linkpulse
```

> ⚠️ `.env` files are **never committed** to Git (they're in `.gitignore`)

---

### Push the Schema & Run

```bash
cd application/backend

# Sync Prisma schema to database
npx prisma db push

# Start the backend
vp dev
```

In another terminal:
```bash
cd application/frontend

# Start the frontend
npm run dev
```

---

### Check the Application ✅

1. Open [http://localhost:3000](http://localhost:3000)
2. Create a short URL
3. Click the short URL → it redirects!
4. Check the API: `curl http://localhost:3001/api/links`

```json
[
  {
    "id": 1,
    "slug": "abc1234",
    "url": "https://example.com",
    "visits": 0,
    "createdAt": "2026-04-18T..."
  }
]
```

> Notice: `visits` is always **0** — we haven't built that yet! 🔴

---

<!-- .slide: data-background="#44475a" -->

# Phase 5

## Adding a Feature with TDD

---

### What is TDD?

**Test-Driven Development** — write tests **before** writing code.

```text
1. 🔴 Red    — Write a failing test
2. 🟢 Green  — Write minimum code to pass
3. 🔵 Refactor — Clean up, keep tests green
```

Repeat for every feature!

---

### Why Test First?

| Test After | Test First (TDD) |
|---|---|
| "I'll write tests later" → never | Tests exist from the start |
| Tests fit the code | Code fits the tests |
| May miss edge cases | Forces you to think about design |
| No safety net while coding | Instant feedback loop |
| Hard to know when you're done | Test passes = feature done ✅ |

---

### The Feature: Visit Counter

Every time someone visits a short URL, we **increment a counter**.

```
GET /abc1234  →  redirect + visits++
GET /api/links  →  { ..., visits: 42 }
```

The redirect route currently has a TODO:

```typescript
// src/index.ts
app.get('/:slug', async (c) => {
  const link = await prisma.link.findUnique({ where: { slug } });
  // TODO: increment visit counter here (TDD exercise!)
  return c.redirect(link.url, 302);
});
```

---

### Step 1 — Write the Failing Test (Red 🔴)

```typescript
// tests/unit/links.test.ts
it('should increment visits on redirect', async () => {
  const mockLink = { slug: 'abc1234', url: 'https://example.com', visits: 0 };
  vi.mocked(prisma.link.findUnique).mockResolvedValue(mockLink);
  vi.mocked(prisma.link.update).mockResolvedValue({ ...mockLink, visits: 1 });

  const res = await app.request('/abc1234');

  expect(res.status).toBe(302);
  expect(prisma.link.update).toHaveBeenCalledWith({
    where: { slug: 'abc1234' },
    data: { visits: { increment: 1 } },
  });
});
```

```bash
vp test run  # ❌ FAIL — prisma.link.update was never called
```

---

### Step 2 — Make It Pass (Green 🟢)

Edit `src/index.ts` — add the increment:

```typescript
app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    return c.json({ error: 'Link not found' }, 404);
  }

  // ✅ Increment visit counter!
  await prisma.link.update({
    where: { slug },
    data: { visits: { increment: 1 } },
  });

  return c.redirect(link.url, 302);
});
```

```bash
vp test run  # ✅ PASS!
```

---

### What are Unit Tests vs Integration Tests?

| | Unit Tests | Integration Tests |
|---|---|---|
| Scope | Single function/module | Multiple components together |
| Dependencies | Mocked | Real (database, network) |
| Speed | Milliseconds | Seconds |
| Confidence | Logic is correct | System works end-to-end |

We need **both**!

---

### What is Testcontainers?

A library that spins up **real Docker containers** for your tests.

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer().start();
const url = container.getConnectionUri();
// Now test against a real PostgreSQL! 🐘
await container.stop();
```

- No mocks — real database
- Isolated — fresh container per test
- Portable — works locally and in CI

---

### Integration Test

```typescript
// tests/integration/links.test.ts

it('should create a link and redirect', async () => {
  // Create a link via the API
  const createRes = await app.request('/api/links', {
    method: 'POST',
    body: JSON.stringify({ url: 'https://example.com' }),
  });
  const created = await createRes.json();

  // Redirect via the short URL
  const redirectRes = await app.request(`/${created.slug}`);
  expect(redirectRes.status).toBe(302);

  // Check visit counter was incremented
  const link = await prisma.link.findUnique({
    where: { slug: created.slug },
  });
  expect(link?.visits).toBe(1);
});
```

---

### Bonus: Try Another Feature! 🚀

There's a placeholder test for a **delete link** feature:

```typescript
// tests/unit/links.delete.test.ts
describe('delete link', () => {
  it.todo('should delete an existing link and return 204');
  it.todo('should return 404 when deleting a non-existent slug');
  it.todo('should not list the deleted link anymore');
});
```

Your turn:
1. Replace `it.todo()` with real tests
2. Run `vp test run` — they fail (Red 🔴)
3. Implement `DELETE /api/links/:slug` in `routes/links.ts`
4. Run `vp test run` — they pass (Green 🟢)

---

<!-- .slide: data-background="#44475a" -->

# Phase 6

## Dockerization

---

### What is Containerization?

Packaging your application with **everything it needs** into a single, portable unit.

```text
Your App + Node.js + Dependencies + Config
         = One Container 📦
```

- Runs the same on any machine
- No "but it works on my laptop" 🙅
- Isolated from other apps on the same machine

---

### What is Docker?

**Docker** is the most popular tool for building and running containers.

```bash
docker build -t myapp .       # Build an image from a Dockerfile
docker run -p 3000:3000 myapp # Run a container
docker ps                      # List running containers
docker stop <id>               # Stop a container
```

Think of it as:
- **Image** = blueprint (read-only)
- **Container** = running instance of an image
- **Dockerfile** = recipe to build an image

---

### Why Containers?

| Without Docker | With Docker |
|---|---|
| "Works on my machine" 🤷 | Works **everywhere** ✅ |
| Install deps manually | Everything bundled |
| Different OS = different bugs | Same environment always |
| Hard to reproduce | One command: `docker run` |

---

### Your Dev Container IS Docker! 🤯

Remember the dev container from Phase 0?

```text
.devcontainer/
├── devcontainer.json        # Config
├── docker-compose.yml       # Services (devcontainer + postgres)
└── post-create.sh           # Setup script
```

You've been running inside a Docker container this whole time!

The dev container = Docker image + VS Code integration

---

### What is a Dockerfile?

A **recipe** that tells Docker how to build an image, step by step.

```dockerfile
FROM node:22-alpine     # Start from a base image
WORKDIR /app            # Set working directory
COPY package*.json ./   # Copy dependency list
RUN npm ci              # Install dependencies
COPY . .                # Copy source code
RUN npm run build       # Build the app
CMD ["node", "dist/index.js"]  # Start command
```

Each line = a **layer** (cached for speed)

---

### Multi-Stage Dockerfile

Use **two stages** to keep the final image small and secure:

```dockerfile
# Stage 1: Build (has dev tools, source code, everything)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Runtime (only compiled output, no dev deps)
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

---

### Why Multi-Stage?

| | Single Stage | Multi-Stage |
|---|---|---|
| Image size | ~800 MB | ~150 MB |
| Dev deps | Included | Excluded |
| Source code | Included | Only compiled |
| Security | Larger surface | Minimal surface |

---

### Build & Run Individually

```bash
# Build the backend image
docker build -t linkpulse-be ./application/backend

# Run it (needs a running Postgres!)
docker run -d \
  --name linkpulse-backend \
  -p 3001:3001 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/linkpulse \
  linkpulse-be

# Build the frontend image
docker build -t linkpulse-fe ./application/frontend

# Run it
docker run -d \
  --name linkpulse-frontend \
  -p 3000:3000 \
  linkpulse-fe
```

That's a lot of commands... 😅

---

### What is Orchestration?

Managing **multiple containers** that work together as a system.

```text
Frontend ──▶ Backend ──▶ Database
 (port 3000)  (port 3001)  (port 5432)
```

Questions orchestration answers:
- What order to start them?
- How do they find each other?
- What happens if one crashes?

---

### Docker Compose to the Rescue

**Docker Compose** defines your entire stack in one file:

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]

  backend:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/linkpulse

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linkpulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

---

### Try Docker Compose

```bash
cd application

# Start everything
docker compose up

# In another terminal — check it's working
curl http://localhost:3000
curl http://localhost:3001/api/links

# Stop everything
docker compose down
```

> Containers talk to each other by **service name** (`postgres`, not `localhost`)

---

<!-- .slide: data-background="#44475a" -->

# Phase 7

## GitHub Actions

---

### What is CI/CD?

**Continuous Integration** — every push automatically triggers:
```text
lint → test → build
```

**Continuous Delivery** — on merge to `main`, automatically:
```text
build Docker image → push to registry
```

Goal: catch bugs early, ship with confidence, automate everything.

---

### What are GitHub Actions?

A **CI/CD platform** built into GitHub.

```text
Push code → GitHub runs your workflow → Results on PR
```

Key concepts:
- **Workflow** — a YAML file in `.github/workflows/`
- **Trigger** — what starts it (`push`, `pull_request`)
- **Job** — a set of steps on a virtual machine
- **Step** — a single command or action
- **Action** — a reusable unit (e.g., `actions/checkout@v4`)

---

### Our Pre-Made Actions

The repo has ready-to-use workflows in `actions/`:

```text
actions/
├── ci.yaml       # Build & push images on every push to main
└── release.yaml  # Tag-based release (re-tag for production)
```

---

### CI Workflow — What It Does

```yaml
# actions/ci.yaml
name: CI Docker build and push
on:
  push:
    branches: [main]

jobs:
  build:
    strategy:
      matrix:
        include:
          - target: be
            context: application/backend
          - target: fe
            context: application/frontend
    steps:
      - Checkout code
      - Login to ghcr.io
      - Build Docker image
      - Push to GitHub Container Registry
```

---

### Copy & Push!

```bash
# Copy the actions to the correct folder
mkdir -p .github/workflows
cp actions/* .github/workflows/

# Commit and push
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

Now go to your fork on GitHub → **Actions** tab → watch the pipeline run! 🚀

---

### The Pipeline in Action

```text
  Push to main
       │
       ▼
  ┌──────────┐    ┌──────────┐
  │ Build BE │    │ Build FE │    (parallel)
  └──────────┘    └──────────┘
       │               │
       ▼               ▼
  ┌──────────────────────────┐
  │   Push to ghcr.io 📦     │
  └──────────────────────────┘
```

---

<!-- .slide: data-background="#44475a" -->

# Phase 8

## Docker Compose Deploy

---

### What is a Container Registry?

A place to **store and share** Docker images — like npm for containers.

```text
Build image locally → Push to registry → Pull anywhere
```

**ghcr.io** = GitHub Container Registry
- Free for public repos
- Integrated with GitHub Actions
- Images live next to your code

---

### Use Pre-Built Images

Instead of building locally, use the images from GitHub Actions:

```yaml
# application/deployment/docker-compose.yml
services:
  frontend:
    image: ghcr.io/schroedinger-hat/workshop-osday-2026/fe:main
    ports: ["3000:3000"]

  backend:
    image: ghcr.io/schroedinger-hat/workshop-osday-2026/be:main
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/linkpulse

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linkpulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

---

### Deploy! 🚀

```bash
cd application/deployment

# Pull and start everything
docker compose up -d

# Check it's running
curl http://localhost:3000
curl http://localhost:3001/api/links

# View logs
docker compose logs -f
```

No source code needed — just the compose file and Docker! 🐳

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
  (build → push to ghcr.io)
       │
       ▼
  Container Registry (ghcr.io)
       │
       ▼
  docker compose up  → 🚀 Running!
```

---

### What You Learned Today

✅ **Git** — version control, fork, clone, push

✅ **Backend + Frontend** — Hono, Next.js, Prisma

✅ **TDD** — write tests first, then implement

✅ **Docker** — containerize with multi-stage builds

✅ **Docker Compose** — orchestrate services

✅ **GitHub Actions** — automate CI/CD

✅ **ghcr.io** — publish and deploy container images

---

📚 **Resources:**
- [Prisma Docs](https://www.prisma.io/docs)
- [Hono Docs](https://hono.dev)
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
