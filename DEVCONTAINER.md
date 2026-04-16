# Dev Container Guide

This project includes a **VS Code Dev Container** that provides a fully configured, ready-to-use development environment. No local tool installation needed — everything runs inside a container.

---

## What's Inside

The dev container comes pre-configured with everything you need for the workshop:

### Runtime & Tools

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22 LTS | JavaScript/TypeScript runtime |
| npm | Latest | Package manager |
| Git | Latest | Version control |
| GitHub CLI (`gh`) | Latest | GitHub operations from terminal |
| Docker + Compose | Latest | Container builds and orchestration |
| Vite+ (`vp`) | Latest | Unified toolchain (test, lint, fmt) |

### Services

| Service | Port | Description |
|---|---|---|
| Frontend (Next.js) | 3000 | Web UI for creating short URLs |
| Backend (Hono) | 3001 | API for URL shortening and redirects |
| PostgreSQL | 5432 | Database (auto-started with the container) |

### VS Code Extensions

| Extension | Purpose |
|---|---|
| ESLint | JavaScript/TypeScript linting |
| Oxc | Oxlint integration (via Vite+) |
| Vitest Explorer | Run and debug tests from the sidebar |
| Docker | Dockerfile and Compose support |
| GitLens | Enhanced Git history and blame |
| GitHub Actions | Workflow file editing and status |
| Prettier | Code formatting |

---

## Getting Started

### Option 1 — VS Code (Local)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [VS Code](https://code.visualstudio.com/)
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Clone the repo and open it in VS Code:
   ```bash
   git clone https://github.com/<your-org>/workshop-osday-2026
   code workshop-osday-2026
   ```
4. VS Code will prompt: **"Reopen in Container"** — click it
5. Wait for the build to complete (first time takes ~2 minutes)
6. You're ready! Open a terminal and start working

### Option 2 — GitHub Codespaces (Cloud)

1. Go to the repository on GitHub
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for the environment to build (~2 minutes)
4. A full VS Code editor opens in your browser — everything is ready

---

## How It Works

The dev container is defined by three files in `.devcontainer/`:

### `devcontainer.json` — Main Configuration

This is the entry point. It defines:
- **Base service**: points to `docker-compose.yml` and uses the `devcontainer` service
- **Features**: installs Docker-in-Docker (needed for Testcontainers and `docker compose`), Git, and GitHub CLI
- **VS Code settings**: tab size, TypeScript SDK path, default terminal
- **VS Code extensions**: auto-installed when the container starts
- **Port forwarding**: maps container ports 3000, 3001, 5432 to your host
- **Post-create script**: runs after the container is built to install dependencies

### `docker-compose.yml` — Services

Defines two services:
- **devcontainer**: the development environment itself, based on Microsoft's official TypeScript + Node.js 22 image. Your workspace is mounted as a volume.
- **postgres**: a PostgreSQL 16 database, automatically started alongside the dev container. Data is persisted in a Docker volume.

The dev container has environment variables pre-set (`DB_HOST`, `DB_PORT`, etc.) so the backend can connect to PostgreSQL without any configuration.

### `post-create.sh` — Setup Script

Runs once after the container is created:
1. Installs the **Vite+ CLI** (`vp`) and adds it to PATH
2. Runs `npm ci` in the **backend** directory
3. Runs `npm ci` in the **frontend** directory

After this script completes, all dependencies are installed and you can immediately start coding.

---

## Environment Variables

These are automatically set inside the dev container:

| Variable | Value | Used By |
|---|---|---|
| `DB_HOST` | `postgres` | Backend — database connection |
| `DB_PORT` | `5432` | Backend — database connection |
| `DB_NAME` | `linkpulse` | Backend — database name |
| `DB_USER` | `postgres` | Backend — database credentials |
| `DB_PASSWORD` | `postgres` | Backend — database credentials |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Frontend — API endpoint |

---

## Common Tasks

### Run the backend in development mode

```bash
cd application/backend
vp dev
```

### Run backend tests

```bash
cd application/backend
vp test run
```

### Lint and format backend code

```bash
cd application/backend
vp check --fix
```

### Start the full application stack

```bash
cd application
docker compose up
```

> Note: PostgreSQL is already running as part of the dev container. The `docker compose up` in the `application/` directory starts the frontend and backend as containers. For development, you'll typically run the backend directly with `vp dev` instead.

### Rebuild the dev container

If you need to rebuild from scratch (e.g., after changing devcontainer config):
- **VS Code**: open the Command Palette (`Ctrl+Shift+P`) → **Dev Containers: Rebuild Container**
- **Codespaces**: open the Command Palette → **Codespaces: Full Rebuild Container**

---

## Troubleshooting

### "Docker daemon is not running" error

The Docker-in-Docker feature may take a few seconds to start. Wait a moment and retry. If it persists, rebuild the container.

### Testcontainers fails to start

Testcontainers requires Docker-in-Docker. Verify Docker is available:
```bash
docker version
```
If it doesn't respond, the Docker-in-Docker feature may not have initialized. Try reopening the container.

### Port already in use

If port 3000 or 3001 shows as in use, check for running processes:
```bash
lsof -i :3000
lsof -i :3001
```
Stop any conflicting processes, or use the VS Code Ports panel to reassign.

### Slow first build

The first container build downloads images and installs all dependencies. Subsequent rebuilds are cached and much faster. GitHub Codespaces provides prebuilds to speed this up — ask your organizer if prebuilds are configured.
