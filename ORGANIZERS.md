# Workshop: From Git to Deploy — Organizer Guide

> Working document for workshop organizers
> Conference: OSDay — 11:30 / 13:00 (90 minutes)
> Audience: junior developers and intermediate professionals

---

## The App: `link-pulse`

A URL Shortener with a visit counter. Simple, understandable in 5 seconds, with enough business logic to write meaningful tests.

**Base features (already available in the repo):**
- Short URL creation (randomly generated slug)
- Redirect from the short URL to the original URL
- Frontend page to create and list your own links

**Micro-feature implemented live during the workshop (TDD):**
- Visit counter for each short URL (incremented on every redirect)

---

## What's Already in the Repo vs What's Done Live

| Component | Already Done | Done Live |
|---|---|---|
| Working app (frontend + backend + DB) | Yes | |
| Prisma schema + DB module | Yes | |
| Dockerfile frontend + backend | Yes (explained) | |
| Local Docker Compose | Yes (shown/explained) | |
| Deployment Docker Compose (ghcr.io) | Yes (shown/explained) | |
| GitHub Actions workflows | In `actions/` folder | Copied to `.github/workflows/` |
| Visit counter test (TDD red) | Yes (fails on purpose) | Made green by attendees |
| Visit counter implementation | TODO stub in `src/index.ts` | Yes |
| Placeholder delete test | Yes (`it.todo()` stubs) | Optional bonus |

---

## Detailed Workshop Flow (90 minutes)

### Phase 0 — The Project (10 min)
- What is `link-pulse`? Quick demo of the working URL shortener
- **What is Git?** — version control basics (clone, commit, push)
- Fork the project on GitHub, `git clone` your fork
- **What is a Dev Container?** — pre-configured environment in Docker
- Dev Container vs installing everything locally (we'll cover Docker in Phase 6)
- Open in VS Code → "Reopen in Container" (or use GitHub Codespaces)
- Run the project in the dev container environment
- "Ready to read the code!" — explore the repo structure

> Concepts covered: version control, forking, dev containers, project structure

### Phase 1 — Backend (5 min)
- Source of the API: `application/backend/`
- **What is a web API / REST?** — brief theory
- Technology used: **Hono** (TypeScript-first, lightweight web framework)
- Show the code: `src/index.ts`, `src/routes/links.ts`
- **Vite+** — unified dev/test/lint/format toolchain (`vp` CLI)
- How to run the backend without Docker: `npm ci && vp dev`

> Concepts covered: REST APIs, web frameworks, TypeScript toolchains

### Phase 2 — Frontend (5 min)
- Source of the website: `application/frontend/`
- **What is server-side rendering?** — brief theory
- Technology used: **Next.js** (React framework with routing, SSR, optimized builds)
- Why Next.js is needed — it's not just React
- How to run the frontend without Docker: `npm ci && npm run dev`

> Concepts covered: SSR, frontend frameworks, React ecosystem

### Phase 3 — Database (5 min)
- **What is a relational database?** — tables, rows, SQL
- **PostgreSQL** — our database, included in devcontainer config
- **What is an ORM?** — maps DB tables to code objects, type safety, migrations
- **Prisma** — our ORM: `prisma/schema.prisma`, `prisma generate`, `prisma db push`
- Show how Prisma replaces raw SQL: `prisma.link.create()` vs `pool.query("INSERT...")`
- Running Postgres standalone with `docker run` (first taste of Docker)

> Concepts covered: relational databases, ORMs, Prisma schema, database connectivity

### Phase 4 — Manual Run (10 min)
- **What are environment variables?** — `.env` files, why they matter
- Copy `.env.example` to `.env`, explain `DATABASE_URL`
- `npx prisma db push` — sync schema to database
- Run the backend: `vp dev`
- Run the frontend: `npm run dev`
- Check the application: open browser, create a link, test redirect

> Concepts covered: env configuration, running services manually, end-to-end verification

### Phase 5 — Adding a Feature with TDD (25 min)
1. **What is TDD?** — Red / Green / Refactor cycle
2. **Why test first > test later?** — design pressure, confidence, prevents "I'll write tests later"
3. The feature: visit counter (explain what it does)
4. Show the **failing test** already in the repo (`tests/unit/links.test.ts`): `vp test run tests/unit/`
5. Run it — see the red 🔴 (1 failed, 5 passed, 3 todo)
6. Implement the visit counter in `src/index.ts` (add `prisma.link.update({ data: { visits: { increment: 1 } } })`)
7. Run tests again — green 🟢
8. Refactor if needed 🔵
9. **Unit tests vs integration tests** — brief theory
10. Show integration test with Testcontainers (`tests/integration/links.test.ts`)
11. Bonus: show placeholder test for delete feature (`tests/unit/links.delete.test.ts`)

> Concepts covered: TDD, unit vs integration testing, mocking, Testcontainers

### Phase 6 — Dockerization (10 min)
- **What is containerization?** — the "works on my machine" problem
- **What is Docker?** — containers, images, lightweight VMs
- Your devcontainer IS a Docker container! (connect the dots)
- **What is a Dockerfile?** — multi-stage build explained
- Show the backend Dockerfile (with Prisma generate step)
- Commands to build and run individually:
  ```
  docker build -t linkpulse-be ./application/backend
  docker run -p 3001:3001 --env-file .env linkpulse-be
  ```
- **What is orchestration?** — managing multiple containers together
- **Docker Compose** — define the entire stack in `docker-compose.yml`
- Show `application/docker-compose.yml` (local build version)
- `docker compose up` — try it

> Concepts covered: containers, images, Dockerfiles, multi-stage builds, orchestration, Compose

### Phase 7 — GitHub Actions (10 min)
- **What is CI/CD?** — automate lint → test → build → push
- **What are GitHub Actions?** — workflows, triggers, jobs, steps
- Show the pre-made action files in `actions/` directory
- Copy to `.github/workflows/`: `cp -r actions/ .github/workflows/`
- Git add, commit, push to your fork
- Watch the pipeline run on GitHub

> Concepts covered: CI/CD, GitHub Actions, automated pipelines

### Phase 8 — Docker Compose Deploy (10 min)
- **What is a container registry?** — ghcr.io, where CI pushes built images
- Use the images built by GitHub Actions
- Show `application/deployment/docker-compose.yml` with ghcr.io image refs
- `docker compose -f application/deployment/docker-compose.yml up`
- Run the full app from pre-built images
- Recap: the full journey (code → git → CI → registry → deploy)
- Q&A

> Concepts covered: container registries, deployment, full pipeline recap

---

## Participant Communication

Send prerequisites to participants at least **3 days before** the workshop. The prerequisites checklist is in the [README.md](README.md).

**Recommended message to participants:**

> To join the workshop, you have two options:
>
> 1. **Local setup** — install Git, Node.js, Docker, and Vite+ (see README)
> 2. **Zero-install** — use the Dev Container (just need VS Code + Docker, or use GitHub Codespaces with nothing installed)
>
> We recommend trying the local setup first. If you hit issues, the Dev Container is your safety net.

---

## Dev Container

The repo includes a fully configured **VS Code Dev Container** (`.devcontainer/`). It provides the complete workshop environment with zero manual setup.

See [DEVCONTAINER.md](DEVCONTAINER.md) for full documentation.

### What it includes
- Node.js 22, Docker-in-Docker, Git, GitHub CLI, Vite+ CLI
- PostgreSQL 16 database (auto-started)
- All VS Code extensions pre-installed
- All npm dependencies pre-installed via `post-create.sh`
- Prisma client generated automatically

### When to use it
- **Participants who can't install prerequisites** — tell them to use Codespaces
- **Live demo backup** — if your local machine has issues, open a Codespace
- **Consistent environment** — everyone gets the exact same setup, no "works on my machine"

### GitHub Codespaces (optional)
If you want participants to use Codespaces:
1. Enable Codespaces on the repository (Settings → Codespaces)
2. Optionally configure a **prebuild** so containers start faster
3. Free accounts get 60 hours/month of Codespaces — more than enough for a 90-min workshop

---

## Open Decisions to Discuss

### Deploy and "Wow Factor"
Local deploy (`docker compose up` with ghcr.io images) is the safest choice and requires no infrastructure.

Alternative options if a real deployment is desired:
- **Fly.io (free):** each participant runs `fly deploy` from the terminal — individual wow, requires a pre-installed account and CLI
- **Shared VPS (€5/month):** GitHub Action does SSH + `docker compose pull && up` — collective wow on the projector, requires your own server

**Recommendation:** Local deploy as default + mention Fly.io as a bonus for those who want to try.

---

## Presentation Slides

The workshop presentation is built with [reveal-md](https://github.com/webpro/reveal-md) and lives in `presentation/slides.md`.

### Running the Slides

```bash
npx reveal-md presentation/slides.md
```

This opens the presentation at `http://localhost:1948` with the **Dracula** theme.

### Slide Structure

The presentation follows a **theory-before-tool** pattern: each technology gets a "What is X?" theory slide before the practical commands.

| Phase | Time | Content |
|---|---|---|
| Phase 0 — The Project | 10 min | Title, URL shortener intro, Git, forking, dev containers, repo structure |
| Phase 1 — Backend | 5 min | REST APIs, Hono, TypeScript, Vite+ toolchain |
| Phase 2 — Frontend | 5 min | SSR, Next.js, running the frontend |
| Phase 3 — Database | 5 min | Relational DBs, PostgreSQL, ORMs, Prisma schema |
| Phase 4 — Manual Run | 10 min | Env variables, .env setup, Prisma db push, running services |
| Phase 5 — TDD | 25 min | TDD cycle, failing test, implement feature, integration tests |
| Phase 6 — Dockerization | 10 min | Containers, Dockerfiles, multi-stage builds, Docker Compose |
| Phase 7 — GitHub Actions | 10 min | CI/CD, workflows, copy actions, push to fork |
| Phase 8 — Deploy | 10 min | Container registries, ghcr.io, deployment compose, recap |

### Tips for Presenting

- Use **arrow keys** or **swipe** to navigate
- Press **S** to open speaker notes view
- Press **F** for fullscreen
- Press **Esc** for slide overview
