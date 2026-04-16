# CLAUDE.md — Project Instructions

## Documentation Rule

When making any change to the project (code, config, slides, or structure), **always update all related documentation together** in the same change. The documentation files are:

- `README.md` — participant guide (includes Tools Reference, repo structure, prerequisites, quick reference card)
- `ORGANIZERS.md` — organizer guide (includes workshop flow, slide info, decisions)
- `slides.md` — reveal-md presentation (run with `npx reveal-md slides.md`)
- `DEVCONTAINER.md` — dev container documentation (setup, usage, troubleshooting)
- `SETUP.md` — setup log (steps taken to initialize the app)

### What to check on every change

1. **New tool or dependency added?** → Update README (prerequisites + Tools Reference section for the correct phase), slides (tech stack slide), ORGANIZERS.md if it affects the workshop flow, and `.devcontainer/` if it needs to be pre-installed.
2. **Feature or code change?** → Update slides (relevant phase), README (workshop outline + tools reference), and ORGANIZERS.md (detailed flow).
3. **Repo structure changed?** → Update the repository structure tree in README.md and the repo structure slide in slides.md.
4. **Config or script changed?** → Update the Quick Reference Card in README.md and any CI/CD slides that reference commands.
5. **Workshop flow changed?** → Update all three: README.md (outline), ORGANIZERS.md (detailed flow), and slides.md (phase slides + roadmap).

## Project Overview

- **Workshop:** "From Git to Deploy" — 90-minute workshop at OSDev 2026
- **App:** `link-pulse` — a URL shortener with visit counter
- **Stack:** Next.js frontend, Hono backend (TypeScript), PostgreSQL, Docker
- **Toolchain:** Vite+ (`vp` CLI) for dev, test, lint, format
- **CI/CD:** GitHub Actions → ghcr.io

## Key Commands

```bash
# Backend (from application/backend/)
vp dev          # Dev server
vp test run     # Run tests
vp lint         # Lint (Oxlint)
vp check --fix  # Format + lint + type-check with auto-fix

# Docker
docker compose up    # Start all services
docker compose down  # Stop all services

# Slides
npx reveal-md slides.md  # Run the presentation
```
