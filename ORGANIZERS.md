# Workshop: From Git to Deploy — Organizer Guide

> Working document for Davide Imola and Lorenzo Bugli
> Conference: OSDev — 11:30 / 13:00 (90 minutes)
> Audience: junior developers and intermediate professionals

---

## The App: `link-pulse`

A URL Shortener with a visit counter. Simple, understandable in 5 seconds, with enough business logic to write meaningful tests.

**Base features (already available in the repo):**
- Short URL creation (randomly generated slug)
- Redirect from the short URL to the original URL
- Frontend page to create and list your own links

**Micro-feature implemented live during the workshop:**
- Visit counter for each short URL (incremented on every redirect)

---

## What's Already in the Repo vs What's Done Live

| Component | Already Done | Done Live |
|---|---|---|
| Working app (frontend + backend + DB) | Yes | |
| Dockerfile frontend + backend | Yes (explained) | |
| Base Docker Compose | Yes (shown/explained) | |
| GitHub Actions workflow | | Yes |
| Micro-feature: visit counter | | Yes |
| Unit test + integration test | | Yes |

---

## Detailed Workshop Flow (90 minutes)

### Phase 1 — Setup and Introduction (10 min)
- Clone the `link-pulse` repo
- `docker compose up` — the app is already working locally
- Quick overview of the project structure

### Phase 2 — Adding the Micro-Feature with Tests (25 min)
1. Show that the visit counter doesn't exist yet
2. Write the **unit test** that fails (red)
3. Implement the feature in the Hono backend (green)
4. Write the **integration test** with Testcontainers (real PostgreSQL DB in a container)
5. All tests pass locally

> Concepts covered: TDD, difference between unit tests and integration tests, Testcontainers

### Phase 3 — Writing the GitHub Actions Workflow (live) (25 min)
Write the `.github/workflows/backend.yml` file from scratch with these steps:

```yaml
# Step 1 — Lint
# Why: ensures consistent style, catches errors before running tests

# Step 2 — Test
# Why: verifies the feature works and there are no regressions
# Includes: unit tests + integration tests with Testcontainers

# Step 3 — Build Docker Image
# Why: packages the app in a reproducible way

# Step 4 — Push to ghcr.io
# Trigger: only on merge to main
# Why: makes the image available for deployment
```

> Concepts covered: CI/CD, pipeline, why each step exists, path filters

### Phase 4 — Dockerfile and Docker Compose (15 min)
- The Dockerfiles are already in the repo — explain them (multi-stage build for the backend)
- Write or show the `docker-compose.yml` with the 3 services: frontend, backend, postgres
- `docker compose up` with the updated image

> Concepts covered: containerization, multi-stage build, local orchestration

### Phase 5 — Deploy and Q&A (15 min)
- Show the pipeline running on GitHub after a PR
- The image appears on ghcr.io
- Local deploy with `docker compose pull && docker compose up -d`
- Optional mention of **Fly.io** for those who want a free real deployment
- Q&A

---

## Participant Communication

Send prerequisites to participants at least **3 days before** the workshop. The prerequisites checklist is in the [README.md](README.md).

---

## Open Decisions to Discuss

### Backend Language
To be decided together:

| Option | Pros | Cons |
|---|---|---|
| **TypeScript/Hono** (recommended) | Single runtime (Node.js), consistent with Next.js frontend, Hono is modern and TypeScript-first | Less well-known than Express among juniors |
| **Go** | Davide's stack, minimal Dockerfile, built-in `go test` | Requires a second runtime installed, less familiar to juniors |
| **Python/FastAPI** | Lorenzo's stack, intuitive pytest, very readable | Requires a second runtime installed |

**Recommendation:** TypeScript/Hono — a single runtime to install lowers the risk of issues on participants' machines.

### Deploy and "Wow Factor"
Local deploy (`docker compose up`) is the safest choice and requires no infrastructure.

Alternative options if a real deployment is desired:
- **Fly.io (free):** each participant runs `fly deploy` from the terminal — individual wow, requires a pre-installed account and CLI
- **Shared VPS (€5/month):** GitHub Action does SSH + `docker compose pull && up` — collective wow on the projector, requires your own server
- **GitHub Pages:** only for the static frontend, loses the purpose of the Docker workflow

**Recommendation:** Local deploy as default + mention Fly.io as a bonus for those who want to try.
