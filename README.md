# Workshop: From Git to Deploy — Pianificazione

> Documento di lavoro per Davide Imola e Lorenzo Bugli
> Conferenza: OSDev — 11:30 / 13:00 (90 minuti)
> Pubblico: junior developer e professionisti intermedi

---

## L'app: `link-pulse`

Un URL Shortener con contatore visite. Semplice, comprensibile in 5 secondi, con logica di business sufficiente per scrivere test significativi.

**Funzionalità base (già pronte nel repo):**
- Creazione di un short URL (slug generato casualmente)
- Redirect dal short URL all'URL originale
- Pagina frontend per creare e listare i propri link

**Micro-feature implementata live durante il workshop:**
- Contatore di visite per ogni short URL (incrementato a ogni redirect)

---

## Stack tecnico

| Componente | Tecnologia |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Node.js + Hono (TypeScript) |
| Database | PostgreSQL |
| Test | Vitest + Testcontainers (integration test con DB reale) |
| Containerizzazione | Docker (Dockerfile per frontend e backend) |
| Orchestrazione locale | Docker Compose |
| CI/CD | GitHub Actions |
| Registry immagini | GitHub Container Registry (ghcr.io) |

**Prerequisiti per i partecipanti (da comunicare 3+ giorni prima):**
- Node.js (LTS)
- Docker Desktop
- Git
- Account GitHub
- Editor (VS Code consigliato)

Il monorepo usa un solo runtime (Node.js), quindi i partecipanti non devono installare Go, Python o altri linguaggi.

---

## Struttura del repository

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
│   │   └── integration/    # usa Testcontainers
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── backend.yml     # path filter: backend/**
│       └── frontend.yml    # path filter: frontend/**
└── README.md               # prerequisiti + setup locale
```

---

## Flusso del workshop (90 minuti)

### Fase 1 — Setup e introduzione (10 min)
- Clone del repo `link-pulse`
- `docker compose up` — l'app è già funzionante localmente
- Spiegazione rapida della struttura del progetto

### Fase 2 — Aggiunta della micro-feature con test (25 min)
1. Si mostra che il contatore visite non esiste ancora
2. Si scrive il **test unitario** che fallisce (red)
3. Si implementa la feature nel backend Hono (green)
4. Si scrive l'**integration test** con Testcontainers (DB PostgreSQL reale in container)
5. Tutti i test passano in locale

> Concetti mostrati: TDD, differenza tra unit test e integration test, Testcontainers

### Fase 3 — Scrittura del workflow GitHub Actions (live) (25 min)
Si scrive da zero il file `.github/workflows/backend.yml` con questi step:

```yaml
# Step 1 — Lint
# Perché: garantisce stile uniforme, rileva errori prima di runnare i test

# Step 2 — Test
# Perché: verifica che la feature funzioni e che non ci siano regressioni
# Include: unit test + integration test con Testcontainers

# Step 3 — Build immagine Docker
# Perché: pacchettizza l'app in modo riproducibile

# Step 4 — Push su ghcr.io
# Trigger: solo su merge in main
# Perché: rende l'immagine disponibile per il deploy
```

> Concetti mostrati: CI/CD, pipeline, perché ogni step esiste, path filters

### Fase 4 — Dockerfile e Docker Compose (15 min)
- I Dockerfile sono già nel repo — si spiegano (multi-stage build per il backend)
- Si scrive o si mostra il `docker-compose.yml` con i 3 servizi: frontend, backend, postgres
- `docker compose up` con l'immagine aggiornata

> Concetti mostrati: containerizzazione, multi-stage build, orchestrazione locale

### Fase 5 — Deploy e Q&A (15 min)
- Si fa vedere la pipeline girare su GitHub dopo una PR
- L'immagine appare su ghcr.io
- Deploy locale con `docker compose pull && docker compose up -d`
- Menzione opzionale di **Fly.io** per chi vuole un deploy reale gratuito
- Q&A

---

## Cosa è già pronto nel repo vs cosa si fa live

| Componente | Già pronto | Fatto live |
|---|---|---|
| App funzionante (frontend + backend + DB) | Si | |
| Dockerfile frontend + backend | Si (spiegati) | |
| Docker Compose base | Si (mostrato/spiegato) | |
| GitHub Actions workflow | | Si |
| Micro-feature: contatore visite | | Si |
| Test unitario + integration test | | Si |

---

## Decisioni aperte da discutere

### Backend language
Da decidere insieme tra:

| Opzione | Pro | Contro |
|---|---|---|
| **TypeScript/Hono** (raccomandato) | Un solo runtime (Node.js), coerente col frontend Next.js, Hono è moderno e TypeScript-first | Meno conosciuto di Express tra i junior |
| **Go** | Stack di Davide, Dockerfile minimale, `go test` built-in | Richiede secondo runtime installato, meno familiare ai junior |
| **Python/FastAPI** | Stack di Lorenzo, pytest intuitivo, leggibilissimo | Richiede secondo runtime installato |

**Raccomandazione:** TypeScript/Hono — un solo runtime da installare abbassa il rischio di problemi sulle macchine dei partecipanti.

### Deploy e "effetto wow"
Il deploy locale (`docker compose up`) è la scelta più sicura e non richiede infrastruttura.

Opzioni alternative se si vuole un deploy reale:
- **Fly.io (gratis):** ogni partecipante fa `fly deploy` dal terminale — wow individuale, richiede account e CLI pre-installata
- **VPS condivisa (5€/mese):** GitHub Action fa SSH + `docker compose pull && up` — wow collettivo sul proiettore, richiede un server vostro
- **GitHub Pages:** solo per il frontend statico, perde il senso del Docker workflow

**Raccomandazione:** Deploy locale come default + menzione Fly.io come bonus per chi vuole provare.

---

## README del repo (sezione prerequisiti)

Da mandare ai partecipanti almeno 3 giorni prima:

```markdown
## Prerequisiti

Prima del workshop, verifica di avere installato:

- [ ] Git — `git --version`
- [ ] Node.js LTS — `node --version`
- [ ] Docker Desktop — `docker --version` e `docker compose version`
- [ ] Account GitHub
- [ ] VS Code (o editor preferito)

### Test dell'ambiente
git clone https://github.com/[org]/link-pulse
cd link-pulse
docker compose up
# Apri http://localhost:3000 — deve apparire l'app
```
