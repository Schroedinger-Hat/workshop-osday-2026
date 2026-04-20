---
title: "From Git to Deploy"
revealOptions:
  transition: slide
  controls: true
  progress: true
  hash: true
  center: true
---

<style>
pre code { font-size: 0.8em !important; line-height: 1.4 !important; }
</style>

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

| Phase | Topic | Time |
|---|---|---|
| 1 | Intro and config | 15 min |
| 2 | TDD — Adding a Feature | 15 min |
| 3 | Dockerization | 10 min |
| 4 | GitHub Actions | 10 min |
| 5 | Docker Compose Deploy | 10 min |

---

### Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Hono (TypeScript) |
| Database | PostgreSQL |
| ORM | **Prisma** |

---

### Tech Stack (cont.)

| Component | Technology |
|---|---|
| Toolchain | **Vite+** (dev, test, lint, fmt — one tool) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry |

---

### License

All workshop material is **open source**
under the **MIT License**:

- ✅ Use, modify, share freely
- ✅ Attribution required
- ✅ Commercial use allowed

> Check the `LICENSE` file in the repo.

---

<!-- .slide: data-background="#44475a" -->



## The Project

---

## Project

The project is a URL shortener

```text
Input:  https://very-long-website.com/articles/2026/my-super-long-article
Output: https://lnk.sh/abc1234
```

---

## What we need

- A **local environment** to run the app
- A **backend** to store and resolve links
- A **frontend** to create and view links
- A **database** to persist everything

---

## Let's begin from the basics!

---

# GIT
## Version control

---

### What is Version Control?

**tracks every change** to your code over time.

- Go back to any previous version
- See who changed what and when
- Work on the same code in a team
- Every change is a a snapshot with a message

---

Without version control:
```text
project_final.zip
project_final_v2.zip
project_FINAL_REAL.zip  ← 😩
```

---

You need to fork this project

---

### What is Forking?

A **fork** is your own copy of
someone else's repository.

- Change anything — original is safe
- Propose changes via **Pull Request**

---

### Fork & Clone

1. Go to the repo on GitHub
2. Click **Fork** → creates your copy
3. Clone your fork:

```bash
git clone https://github.com/<your-username>/workshop-osday-2026
```

Now you have the full project on your machine! 🎉

---

## Why fork instead of clone?

- Keeps your changes separate from the original
- Allows proposing changes via Pull Requests
- Easier to sync

---

### 🌍 The Environment Problem

Every developer has a **different machine**:
different OS, different versions, different configs.

> "It works on my machine" is the #1 onboarding killer.

---

### 🌍 The Environment Problem

A **reproducible dev environment** means:
- ⚡ Faster onboarding
- 🐛 Fewer "ghost bugs"
- 🤝 Easier collaboration

---

### 🛠️ Tools for Reproducible Environments

---

### asdf

**Version manager** via plugins

- Runtimes & CLIs only
- One `.tool-versions` file per project
- Plugin per tool (Node, Python, Ruby…)

---

<img src="https://mise.jdx.dev/logo-full-dark.svg" alt="mise logo" height="160" />

**Modern asdf alternative** (written in Rust, faster)

- Runtimes, env vars, and tasks
- Drop-in `.tool-versions` compatible
- Built-in task runner

---

<img src="https://avatars.githubusercontent.com/u/102692984?s=200&v=4" alt="Dev Containers logo" height="160" />

### Dev Containers

- Everything: OS, tools, services, DBs
- Identical for every developer
- Powered by Docker + VS Code

---

### asdf and mise 
manage tool *versions* on your host

- ✅ Lightweight, no Docker needed
- ✅ Fast to set up per-project runtimes
- ❌ Don't handle system deps, databases, or OS differences


---


### Dev Containers
simulate a full machine 

- ✅ Identical environment 
- ✅ Include services, extensions, OS-level deps...
- ❌ Require Docker installed

---

### ⏱️ Setup Time

| Manual Install | 30+ min |
|---|---|
| Automated Install | ~5-10 min |

No manual installs, no config problems, no headaches.

---

### 🤷 "Works on My Machine"

| Manual Install | 🤷 |
|---|---|
| Automated Install | ✅ |

Manual = your OS, your versions, your quirks.

Automated = **same environment for everyone**.

---

### 🔁 Consistent Environment

| Manual Install | No |
|---|---|
| Automated Install | Yes |

New team member? Senior dev? CI runner?

All use the **exact same environment**.

---

### Setup Dev Container

- VS Code → "Reopen in Container" command
- Or **GitHub Codespaces** (cloud)
- Pre-installed: Node, Git, Vite+, PG

---

### Run in Dev Container

1. Open the repo in VS Code
2. Click **"Reopen in Container"**
3. Wait ~2 minutes for the build
4. Open a terminal — you're ready! ✅

---
<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 5min

1. Go to the repo on GitHub and click **Fork**
2. Wait for your fork to be created under your username
3. Click **Code → Copy** the clone URL
4. In your terminal: `git clone https://github.com/<your-username>/workshop-osday-2026`
5. Look at the code!

---

# Hono
## Our Backend Framework

---

**Hono**

- Modern alternative to Express.js
- Built for TypeScript from day one
- Tiny footprint, very fast

---

**Hono**

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

## Vite plus
### Your open source Toolchain

---

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
vp run dev          # Start dev server on http://localhost:3001
```

Test it:
```bash
curl http://localhost:3001/
# → { "status": "Hello world" }
```

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 5min

Run the backend and test it!

1. `cd application/backend`
2. `npm ci && vp run dev` 
3. `curl http://localhost:3001/`
4. `curl http://localhost:3001/api/links` 

Is there somiething missing? 

---

## Database

---

### Database


```sql
Table: links
┌────┬─────────┬──────────────────────┬────────┐
│ id │  slug   │        url           │ visits │
├────┼─────────┼──────────────────────┼────────┤
│  1 │ abc1234 │ https://example.com  │     42 │
│  2 │ xyz5678 │ https://github.com   │     17 │
└────┴─────────┴──────────────────────┴────────┘
```

---

### PostgreSQL

**PostgreSQL** — powerful,
open-source relational database.

- Used by Instagram, Spotify, Netflix
- JSON, full-text search, extensions

---

We will use an ORM to interact with PostgreSQL

---

### What is an ORM?

**ORM** (Object-Relational Mapping)

---

use **code objects** instead of raw SQL.

Benefits: **type safety**, **migrations**

---

<img 
  src="./prisma-logo.jpg" 
  alt="Prisma logo" 
  height="160" 
  style="display:block; margin:auto;" 
/>

---

<img 
  src="./prisma-logo.jpg" 
  alt="Prisma logo" 
  height="160" 
  style="display:block; margin:auto;" 
/>


- Modern TypeScript ORM
- Type-safe database client
- Built-in migrations

---

### ➕ Create

| Raw SQL | `INSERT INTO links (slug, url) VALUES (...)` |
|---|---|
| ORM (Prisma) | `prisma.link.create({ data: { slug, url } })` |

Type-safe, no string concatenation, no SQL injection risk.

---

### 🔎 Read

| Raw SQL | `SELECT * FROM links WHERE slug = 'abc'` |
|---|---|
| ORM (Prisma) | `prisma.link.findUnique({ where: { slug } })` |

Editor autocompletes fields — typos caught at compile time.

---

### ✏️ Update

| Raw SQL | `UPDATE links SET visits = visits + 1 WHERE slug = 'abc'` |
|---|---|
| ORM (Prisma) | `prisma.link.update({ where: { slug }, data: { visits: { increment: 1 } } })` |

Atomic increments with no raw arithmetic in strings.

---

### Prisma

1. Define your schema in `prisma/schema.prisma`
2. Run a migration to apply changes to DB
3. Use the generated type-safe client in your code

```bash
npx prisma migrate dev   # Create & apply migration + generate client
npx prisma generate      # Regenerate client only (no DB changes)
```

---

### Prisma Schema

```prisma

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

### What is `prisma migrate dev`?

A **development migration** command that:

1. Compares your `schema.prisma` to the current DB
2. Generates a **SQL migration file** in `prisma/migrations/`
3. Applies the migration to your database
4. Regenerates the Prisma client

---

### Running a Migration

```bash
cd application/backend

# First time — creates the initial migration
npx prisma migrate dev --name first_migration
```

```text
prisma/migrations/
└── 20260420131503_first_migration/
    └── migration.sql    ← Generated SQL
```

> Migrations are **committed to Git** — everyone gets the same DB state.

---

### Managing Models with Prisma

To **add or change a model**, edit `schema.prisma` and run:

```bash
npx prisma migrate dev --name describe_your_change
```

Prisma detects the diff and generates the right SQL.

---

### Migration Example

Add an `expiresAt` field to `Link`:

```prisma
model Link {
  id        Int       @id @default(autoincrement())
  slug      String    @unique
  url       String
  visits    Int       @default(0)
  createdAt DateTime  @default(now()) @map("created_at")
  expiresAt DateTime? @map("expires_at")  // ← new field

  @@map("links")
}
```

Then: `npx prisma migrate dev --name add_expires_at`

---

Alternative to `migrate dev` is `db push`
- **pushes the schema** to database
- Avoid migration file creation
- Good for quick prototyping
- Not recommended for real development or teams

---

### 📄 Migration Files

| `db push` | No migration files created |
|---|---|
| `migrate dev` | ✅ Generates SQL migration files |

---

### 🕓 History Tracking

| `db push` | No history |
|---|---|
| `migrate dev` | ✅ Tracks every change |

---

### 👥 Team-Friendly

| `db push` | ❌ Changes not shared with team |
|---|---|
| `migrate dev` | ✅ Committed to Git — everyone stays in sync |

---

### 🎯 When to Use

| `db push` | Quick prototyping |
|---|---|
| `migrate dev` | Real development |

> Use `migrate dev` for anything you want to **keep and share**.

---

### Prisma in Action — Create & Find

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
```

---

### Prisma in Action — List & More

```typescript
// List all links
const all = await prisma.link.findMany({
  orderBy: { createdAt: 'desc' },
});
```

> Type safety — editor knows fields! ✨

---

### Database with docker

```shell
docker run -d \
  --name linkpulse-postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=linkpulse \
  postgres:16-alpine
```

---

### Database in the Dev Container

Dev container **includes PostgreSQL** —
no setup needed! Battery included!

```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/linkpulse
```

---

## Env variable and files

---

### What are Environment Variables?

Config values **outside your code**.

```text
Code says:          "connect to the database"
Env var tells it:   WHERE to connect
```

Why?
- **Security** — don't put passwords in code
- **Flexibility** — per-environment values
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

> ⚠️ `.env` files are **never committed**

---

### Run the Migration & Start

```bash
cd application/backend

# Create and apply migration to database
npx prisma migrate dev --name first_migration

# Start the backend
vp run dev
```

### Check the Application ✅

1. Open [http://localhost:3000](http://localhost:3000)
2. Create a short URL
3. Click the short URL → it redirects!

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 5min

Run migration from prisma and start the app!

1. `cd application/backend`
2. `cp .env.example .env`
3. `npx prisma migrate dev --name first_migration`
4. `vp run dev` — start the backend
5. `curl http://localhost:3001/`
6. `curl http://localhost:3001/api/links`

---

We still need a gui!

---

## Next.js
### Our Frontend Framework

---

### What is
### Server-Side Rendering (SSR)?

---


SSR — render HTML on the server for each request
instead of client-side JavaScript.


---

### 🖥️ First Load

| Client-Side (SPA) | Blank → JS loads → content |
|---|---|
| Server-Side (SSR) | Content immediately |


---

### 🔍 SEO

| Client-Side (SPA) | Poor (bots see blank page) |
|---|---|
| Server-Side (SSR) | Great (full HTML) |

Search engines index your content — not an empty `<div>`.

---

### ⚡ Performance

| Client-Side (SPA) | Slower first paint |
|---|---|
| Server-Side (SSR) | Faster first paint |

Less JavaScript to parse before the user sees something.

---

### Why Next.js?

- **File-based routing** — easy URLs
- **SSR** — fast load, great SEO
- **API routes** — built-in endpoints
- **Optimized builds** — code splitting

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
npm install           # Install dependencies
vp run dev            # Start dev server on http://localhost:3000
```

Open http://localhost:3000 🌐

> ⚠️ Frontend needs the backend running!

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 5min

Run the frontend and check it!

1. Make sure the backend is still running on port 3001
2. Open a new terminal: `cd application/frontend`
3. `npm ci` — install dependencies
4. `vp dev` — start the frontend on port 3000
5. Open [http://localhost:3000](http://localhost:3000) in your browser
6. You should see the link-pulse UI ✅


---

We need another feature!

---

### Check the Application ✅

1. Open [http://localhost:3000](http://localhost:3000)
2. Create a short URL
3. Click the short URL → it redirects!

---

### Verify via API

```bash
curl http://localhost:3001/api/links
```

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

> `visits` is **0** — not built yet! 🔴

---

## Adding a Feature with TDD

---

### What is TDD?

1. 🔴 Red    — Write a failing test
2. 🟢 Green  — Write minimum code to pass
3. 🔵 Refactor — Clean up, keep tests green

---

### 📅 Tests Actually Exist

| Test After | "I'll write tests later" → never |
|---|---|
| Test First (TDD) | Tests exist from the start |

Writing tests after is a promise you rarely keep.

---

### 🔄 Who Fits Whom?

| Test After | Tests fit the code |
|---|---|
| Test First (TDD) | Code fits the tests |

Tests written after tend to rubber-stamp the implementation instead of validating it.

---

### 🧠 Design Thinking

| Test After | May miss edge cases |
|---|---|
| Test First (TDD) | Forces you to think about design |

Writing the test first makes you think about the API before writing it.

---

### ⚡ Feedback Loop

| Test After | No safety net while coding |
|---|---|
| Test First (TDD) | Instant feedback loop |

Every save tells you if you broke something.

---

### ✅ Done Means Done

| Test After | Hard to know when you're done |
|---|---|
| Test First (TDD) | Test passes = feature done ✅ |

No guessing. Green test = shipped.

---

### The Feature: Visit Counter

On each visit to a short URL,
we **increment a counter**.

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

### 📝 What We'll Test: Visit Counter

- **Redirect works** 
- **Visit counter increments**


---

### Our Test Strategy: Mocked Unit Tests

For the visit counter, we'll use **unit tests with mocks**:

```
┌─ Test ─────────────┐
│  redirect route    │
│       ↓            │
│  [Mocked Prisma]   │  ← No real database!
│  ├ findUnique()    │    Instant, controlled
│  └ update()        │
└────────────────────┘
```
---

### 🎭 What is a Mock?

A **fake version** of a dependency (database, API, file system)
that replaces the real one during testing.

---

| Real World | | Test World |
|---|---|---|
| Database | → | Mock |
| API Call | → | Fake Response |
| File I/O | → | In-Memory |

---

### Mock Advanced: Track Function Calls

```typescript
// Setup: mock the update function
vi.mocked(prisma.link.update).mockResolvedValue({ ...link, visits: 1 });

// Test code calls it
await myFunction();

// Assert: verify it was called correctly
expect(prisma.link.update).toHaveBeenCalledWith({
  where: { slug: 'abc1234' },
  data: { visits: { increment: 1 } }
});
```
---


**This is the power of mocks:**
- Control *what* it returns
- Verify *how* it was called
- Ensure your code uses dependencies correctly

---

### Write the Failing Test 🔴

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
---

- No database setup needed
- Tests run in milliseconds
- Can verify each call independently

---

---

### Run It — It Fails! 🔴

```bash
vp test run tests/unit/
```

```text
 ❌ FAIL — prisma.link.update was never called

 Tests:  1 failed | 5 passed | 3 todo
```

Expects `prisma.link.update` but
code only has `// TODO`

---

### Make It Pass 🟢

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

---

### Run Tests Again — Green! 🟢

```bash
vp test run tests/unit/
```

```text
 ✅ PASS — all tests pass!

 Tests:  6 passed | 3 todo
```

---

## ⏱️ TIMER 5min

- `vp test run tests/unit/` 🔴
- Add the increment code to `src/index.ts`
- `vp test run tests/unit/` 🟢

Rember to commit and push your changes!

---

There are many types of tests — unit, integration, end-to-end...  Each one
validates different assumptions and monitors different aspects of your code.

---

### 🎯 Scope

| Unit Tests | Single function/module |
|---|---|
| Integration Tests | Multiple components together |
| E2E Tests | Full user flow in a real browser |
| Smoke Tests | Critical paths only, after deploy |

Unit tests zoom in. Smoke tests just check the lights are on.

---

### 🔌 Dependencies

| Unit Tests | Mocked |
|---|---|
| Integration Tests | Real (database, network) |
| E2E Tests | Real browser + full stack |
| Smoke Tests | Real production environment |

Unit tests fake the world. E2E tests use all of it.

---

### ⏱️ Speed

| Unit Tests | Milliseconds |
|---|---|
| Integration Tests | Seconds |
| E2E Tests | Minutes |
| Smoke Tests | Seconds (minimal set) |

The faster the test, the tighter the feedback loop.

---

### 🛡️ Confidence

| Unit Tests | Logic is correct |
|---|---|
| Integration Tests | Components work together |
| E2E Tests | User flows work in a real browser |
| Smoke Tests | App is alive after deploy |

We need **all of them** — at the right level.

---

## Integration Tests with Testcontainers

--- 

### What is Testcontainers?

Spins up **real Docker containers**
for your tests.

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer().start();
const url = container.getConnectionUri();
// Now test against a real PostgreSQL! 🐘
await container.stop();
```

---

### What is Testcontainers?

- No mocks — "real" database
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
```

---

### Integration Test (cont.)

```typescript
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

Uses **Testcontainers** — real PG! 🐘

---

### Bonus: Try Another Feature! 🚀

Placeholder test for **delete link**:

```typescript
// tests/unit/links.delete.test.ts
describe('delete link', () => {
  it.todo('should delete an existing link and return 204');
  it.todo('should return 404 when deleting a non-existent slug');
  it.todo('should not list the deleted link anymore');
});
```

---

### Bonus: Your Turn! 🎯

1. Replace `it.todo()` with real tests
2. Run `vp test run` — they fail (Red 🔴)
3. Implement `DELETE /api/links/:slug`
4. Run `vp test run` — they pass (Green 🟢)

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 15min

Run the TDD cycle for the visit counter feature!

- `vp test run tests/integration/` 🔴

1. Open `tests/unit/links.test.ts` and add the failing test for visit counter increment
2. Run `vp test run tests/unit/` → it should **fail** 🔴
3. Open `src/index.ts` and add `prisma.link.update(...)` in the redirect route
4. Run `vp test run tests/unit/` → all tests should **pass** 🟢
5. **Bonus:** open `tests/unit/links.delete.test.ts`, replace `it.todo()` with real tests, implement `DELETE /api/links/:slug`, and make them green too 🚀

---

## Dockerization

---

### What is Containerization?

Package your app with **everything**
into a single, portable unit.

```text
Your App + Node.js + Dependencies + Config = One Container 📦

```

- Runs the same on any machine
- No "but it works on my laptop" 🙅
- Isolated from other apps on the same machine

---

### What is Docker?

**Docker** — the most popular tool
for building and running containers.

---

### 🤷 "Works on My Machine"

| Without Docker | "Works on my machine" 🤷 |
|---|---|
| With Docker | Works **everywhere** ✅ |

Same image runs on your laptop, CI, and production.

---

### 📦 Dependencies

| Without Docker | Install deps manually |
|---|---|
| With Docker | Everything bundled |

No more "did you install the right Node version?"

---

### 🐛 Environment Differences

| Without Docker | Different OS = different bugs |
|---|---|
| With Docker | Same environment always |

What runs on Linux runs on Mac runs in CI — identically.

---

### 🔁 Reproducibility

| Without Docker | Hard to reproduce |
|---|---|
| With Docker | One command: `docker run` |

Anyone can spin up the exact same app with a single command.

---

## Does it ring a bell?

---

### Your Dev Container IS Docker!

Remember the dev container from beginning?

```text
.devcontainer/
├── devcontainer.json        # Config
├── docker-compose.yml       # Services (devcontainer + postgres)
└── post-create.sh           # Setup script
```

You've been inside Docker this whole time!

Dev container = Docker + VS Code

---

### Dockerfile

A **recipe** to build a Docker image.

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

### Multi-Stage Dockerfile — Build Stage

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
```

---

### Multi-Stage Dockerfile — Runtime Stage

```dockerfile
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

### Build & Run — Backend

```bash
# Build the backend image
docker build -t linkpulse-be ./application/backend

# Run it (needs a running Postgres!)
docker run -d \
  --name linkpulse-backend \
  -p 3001:3001 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/linkpulse \
  linkpulse-be
```

---

### Build & Run — Frontend

```bash
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

Could it be simpler? Yes, with Docker Compose!

---

### Docker compose

Managing **multiple containers**
that work together.

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

**Docker Compose** — entire stack
in one file:

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
```

---

### Docker Compose — Database Service

```yaml
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linkpulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

> Services find each other by name
> (`postgres`, not `localhost`)

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

> Use **service names** for networking

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 10min

Deploy the app with Docker Compose!

1. Make sure Docker is running
2. `docker build -t linkpulse-be ./application/backend` — build the backend image
3. `docker build -t linkpulse-fe ./application/frontend` — build the frontend image
4. `cd application && docker compose up` — start the full stack
5. `curl http://localhost:3001/api/links` → backend is alive ✅
6. Open [http://localhost:3000](http://localhost:3000) → frontend is alive ✅
7. `docker compose down` when done

---

## GitHub Actions and CI/CD

---

### What is CI/CD?

**CI** — every push triggers:
```text
lint → test → build
```

**CD** — on merge to `main`:
```text
build image → push to registry
```

Catch bugs early, ship confidently.

---

### What are GitHub Actions?

A **CI/CD platform** built into GitHub.

```text
Push code → GitHub runs your workflow → Results on PR
```
---

### Our Pre-Made Actions

The repo has ready-to-use workflows in `actions/`:

```text
actions/
├── ci.yaml       # Build & push images on every push to main
└── release.yaml  # Tag-based release (re-tag for production)
```

---

### CI Workflow — Trigger & Matrix

```yaml
# actions/ci.yaml
name: CI Docker build and push
on:
  push:
    branches: [main]
```

**Matrix strategy** — build BE + FE
in parallel:

```yaml
jobs:
  build:
    strategy:
      matrix:
        include:
          - target: be
            context: application/backend
          - target: fe
            context: application/frontend
```

---

### CI Workflow — Steps

```yaml
    steps:
      - Checkout code
      - Login to ghcr.io
      - Build Docker image
      - Push to GitHub Container Registry
```

---

### Image Tagging — Best Practices

Tag images **meaningfully**, not just `latest`:

```yaml
# From our ci.yaml — metadata-action
tags: |
  type=sha,prefix=sha-,format=short
  type=raw,value={{branch}}-{{sha}}-{{date 'X'}}
```

| Tag | Example | Use |
|---|---|---|
| `sha-` | `sha-a1b2c3d` | Track exact commit |
| `branch-sha-ts` | `main-a1b2...-17...` | Full traceability |

---

### Image Tagging — Release

Our `release.yaml` promotes images:

```yaml
# Pull the SHA-tagged image
docker pull $IMAGE:sha-a1b2c3d

# Re-tag as a version
docker tag $IMAGE:sha-a1b2c3d $IMAGE:v1.0.0

# Push the release tag
docker push $IMAGE:v1.0.0
```

> ⚠️ Avoid `latest` in production —
> you can't roll back to "latest"!

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

Go to fork → **Actions** tab →
watch the pipeline run! 🚀

---

### The Pipeline in Action

```text
  Push to main
       │
       ▼
  ┌──────────┐ ┌──────────┐
  │ Build BE │ │ Build FE │
  └──────────┘ └──────────┘
       │            │
       ▼            ▼
  ┌──────────────────────────┐
  │   Push to ghcr.io 📦     │
  └──────────────────────────┘
```

---

<!-- .slide: data-background="#44475a" -->

## ⏱️ TIMER 10min

Create and push the GitHub Actions workflows!

1. `mkdir -p .github/workflows` — create the workflows directory
2. `cp actions/* .github/workflows/` — copy the pre-made workflows
3. `git add .github/workflows/` — stage the new files
4. `git commit -m "ci: add GitHub Actions workflows"`
5. `git push origin main` — push to your fork
6. Go to your fork on GitHub → click the **Actions** tab
7. Watch the pipeline build and push both images to ghcr.io 🚀

---

<!-- .slide: data-background="#44475a" -->


## Docker Compose Deploy

---

### GitHub Container Registry **ghcr.io**

```text
Build image locally → Push to registry → Pull anywhere
```
- Free for public repos
- Integrated with GitHub Actions
- Images live next to your code

---

### Use Pre-Built Images

Use images from GitHub Actions:

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
      DATABASE_URL: postgresql://...@postgres:5432/linkpulse
```

---

### Deployment — Database & Run

```yaml
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: linkpulse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

```bash
cd application/deployment
docker compose up -d
```

No source code needed — just compose! 🐳

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

- ✅ **Git** — version control, fork, clone, push
- ✅ **Backend + Frontend** — Hono, Next.js, Prisma
- ✅ **TDD** — write tests first, then implement

---

### What You Learned Today (cont.)

- ✅ **Docker** — multi-stage builds
- ✅ **Compose** — orchestrate services
- ✅ **GitHub Actions** — automate CI/CD
- ✅ **ghcr.io** — publish & deploy images

---

📚 **Resources:**
- [Prisma Docs](https://www.prisma.io/docs)
- [Hono Docs](https://hono.dev)
- [Vite+ Docs](https://viteplus.dev)
- [Actions Docs](https://docs.github.com/en/actions)
- [Docker Tips](https://docs.docker.com/build/)
- [Testcontainers](https://testcontainers.com)

---

<!-- .slide: data-background="#282a36" -->

# Thank You! 🎉

### Questions?

<br>

Happy hacking! 🚀
