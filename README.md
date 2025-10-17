# SalesVision Monorepo

SalesVision is evolving into a full-stack planner that combines a Next.js web UI, a FastAPI backend, and a PostgreSQL database layer. The repository now follows a multi-app layout so each service can be built, deployed, and scaled independently.

## Folder Layout

```
.
├── apps/
│   ├── web/         # Next.js front-end (moved from the old repo root)
│   └── api/         # FastAPI backend scaffold
├── db/              # Alembic migrations & seed scripts
├── docker/          # Local Compose stack & shared Docker bits
├── infra/           # Cloud Run / Terraform / gcloud deployment assets
├── docs/            # Project documentation (local DB plan, etc.)
├── .env.example     # Shared env template
├── .dockerignore
├── package.json     # Monorepo workspace definitions
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Python 3.12+
- Docker (for local full-stack environment)

### Install Dependencies

From the repository root run:

```bash
npm install
```

This installs workspace dependencies for `apps/web`. Python dependencies for the API live in `apps/api/requirements.txt`.

### Run Front-end (Next.js)

```bash
npm run dev:web
```

This proxies to `npm run dev` inside `apps/web` and still serves on port `9002` by default.

### Run Back-end (FastAPI)

```
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The scaffold exposes `/` and `/healthz/*` as smoke-test endpoints. Extend it with domain routes as you port functionality from the Streamlit/LLM prototype.

### Run the Full Stack with Docker Compose

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

Services started:

- `db`: PostgreSQL 16 with a persistent volume
- `api`: FastAPI container (port `8000`)
- `web`: Next.js dev server (port `3000`)

Update environment values in `.env.example` (copy to `.env`) before running.

## Deployment Notes

- `apps/web/Dockerfile` builds the front-end container for Cloud Run.
- `apps/api/Dockerfile` builds the FastAPI service.
- Store migration files in `db/` and wire them into Cloud Build/Cloud Run jobs as needed.
- Infrastructure configs remain under `infra/`; adjust paths to reference the new locations when you update Terraform or gcloud scripts.

## Next Steps

1. Flesh out the FastAPI application (routers, models, services) and connect it to Cloud SQL via SQLAlchemy.
2. Move authentication to Google IAP once the web service is deployed to Cloud Run.
3. Update CI/CD to build and deploy both `apps/web` and `apps/api` images.
4. Port the Streamlit/LLM logic into the FastAPI service or a dedicated worker.

Refer to `docs/local-db.md` for the detailed local Postgres plan.
