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

## Front-end Overview

The Next.js app lives in `apps/web` and follows an app router structure:

- `src/app` hosts route segments and page components.
- `src/components` provides reusable UI elements built on Radix UI.
- `src/lib` contains data helpers and mock data (used by dashboard views).
- `public/` (currently empty) is reserved for static assets such as favicons or Open Graph images.

The project uses path aliases (`@/...`) defined in both `tsconfig.json` and `jsconfig.json`, so keep import casing consistent with the actual file paths (Linux builds are case sensitive).

## Deployment Notes

- `apps/web/Dockerfile` builds the front-end container for Cloud Run.
- `apps/api/Dockerfile` builds the FastAPI service.
- Store migration files in `db/` and wire them into Cloud Build/Cloud Run jobs as needed.
- Infrastructure configs remain under `infra/`; adjust paths to reference the new locations when you update Terraform or gcloud scripts.

### Deploying `apps/web` to Cloud Run

The commands below reproduce the deploy that produced the live service URL shown afterward. Run them from the repository root.

```bash
# 1. Build linux/amd64 image locally (needed on Apple Silicon)
docker buildx build --platform linux/amd64 -t web-local apps/web --load

# 2. (Optional) Smoke test locally
docker run --rm -p 3000:8080 -e PORT=8080 --platform linux/amd64 web-local

# 3. Tag and push to Artifact Registry
PROJECT_ID=youngintlsaleswebapp
REGION=us-central1
REPO=salesvision-web
IMAGE=frontend
TAG="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M)-amd64"

gcloud auth configure-docker $REGION-docker.pkg.dev
docker tag web-local $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG

# 4. Deploy to Cloud Run
gcloud run deploy salesvision-frontend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG \
  --region $REGION \
  --allow-unauthenticated

# 5. Retrieve service URL
gcloud run services describe salesvision-frontend \
  --region $REGION \
  --format='value(status.url)'
```

If you rebuild with a different tag, re-run steps 3–5. Ensure the Cloud Run service has `PORT` injected (handled automatically) and that the container’s start script continues to bind to `0.0.0.0`.

### Live Environment

- **Cloud Run service**: `salesvision-frontend`
- **URL**: https://salesvision-frontend-244979794407.us-central1.run.app

Use this URL for smoke testing and to connect a custom domain through Cloud Run or Cloud DNS once you are ready.

## Next Steps

1. Flesh out the FastAPI application (routers, models, services) and connect it to Cloud SQL via SQLAlchemy.
2. Move authentication to Google IAP once the web service is deployed to Cloud Run.
3. Update CI/CD to build and deploy both `apps/web` and `apps/api` images.
4. Port the Streamlit/LLM logic into the FastAPI service or a dedicated worker.

Refer to `docs/local-db.md` for the detailed local Postgres plan.
