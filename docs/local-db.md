# 🧩 Local Database Plan (Option 1)

Set up a **Postgres database** for local development with **Docker Compose**.
Your FastAPI backend connects to it automatically; the frontend never talks to the DB directly.

---

## 🏗 Folder layout

```
repo-root/
├─ apps/
│  ├─ frontend/           # Next.js (no DB access)
│  └─ backend/            # FastAPI + SQLAlchemy
│     ├─ app/
│     │  ├─ db/
│     │  │  ├─ models.py
│     │  │  ├─ session.py        # engine + async session
│     │  │  └─ __init__.py
│     │  ├─ main.py
│     │  └─ ...
│     ├─ alembic/                # migrations
│     ├─ alembic.ini
│     └─ requirements.txt
├─ infra/
│  ├─ docker-compose.yml         # local Postgres + backend + frontend
│  └─ cloudrun/
│     ├─ api-service.yaml
│     └─ web-service.yaml
└─ README.md
```

---

## 🧱 Minimal DB schema (evolves later)

| Table          | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| `users`        | id, email, name, picture, created_at                            |
| `sessions`     | id, user_id, session_token, expires_at                          |
| `oauth_tokens` | id, user_id, provider, enc_blob (encrypted refresh), created_at |
| `events`       | id, user_id, gcal_event_id, title, start_ts, end_ts, meta_json  |
| `usage_events` | id, user_id (nullable), route, ts                               |

Create and update tables with **Alembic** migrations.

---

## ⚙️ `infra/docker-compose.yml`

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: appdb
    ports: ["5432:5432"]
    volumes:
      - dbdata:/var/lib/postgresql/data

  backend:
    build: ../apps/backend
    env_file: ../apps/backend/.env
    depends_on: [db]
    ports: ["8000:8000"]

  frontend:
    build: ../apps/frontend
    env_file: ../apps/frontend/.env
    depends_on: [backend]
    ports: ["3000:3000"]

volumes:
  dbdata:
```

---

## 🔑 Backend env file (`apps/backend/.env`)

```
DATABASE_URL=postgresql+asyncpg://app:app@db:5432/appdb
SESSION_SECRET=dev-session-secret
# Google OAuth vars arrive later…
```

---

## 🐍 Database session helper (`apps/backend/app/db/session.py`)

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

---

## ▶️ Run the stack

```bash
docker compose -f infra/docker-compose.yml up --build
```

You get:

* **Postgres** → `localhost:5432`
* **FastAPI** → `http://localhost:8000`
* **Next.js** → `http://localhost:3000`

---

## 🧪 Verify the database

1. Open a terminal:

   ```bash
   docker exec -it <db-container-id> psql -U app -d appdb
   ```

   then run:

   ```sql
   SELECT version();
   ```

2. Or add a FastAPI health check:

   ```python
   from fastapi import APIRouter, Depends
   from sqlalchemy import text
   from .db.session import get_db

   router = APIRouter()

   @router.get("/healthz/db")
   async def health_check(db=Depends(get_db)):
       result = await db.execute(text("SELECT 1"))
       return {"db_ok": bool(result.scalar())}
   ```

   Visit `http://localhost:8000/healthz/db` for `{"db_ok": true}`.

---

## 🪄 Apply migrations (after Alembic init)

```bash
cd apps/backend
alembic upgrade head
```

Tables live inside the `db` container’s persistent volume `dbdata`.

---

## ✅ Outcome

You now have a full **local stack**:

* persistent Postgres
* backend wired through `DATABASE_URL`
* frontend on port 3000

All ready for new models, migrations, and OAuth integration.
```
