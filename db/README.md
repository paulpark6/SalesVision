# Database Migrations

This directory is reserved for Alembic migrations and seed scripts.

Suggested layout:

```
db/
├─ alembic.ini
├─ versions/
│  └─ *.py
└─ seeds/
   └─ *.sql
```

Generate a new migration once the SQLAlchemy models are defined in the API package:

```bash
alembic revision --autogenerate -m "create users table"
```

Apply migrations locally with Docker Compose (see `docker/docker-compose.dev.yml`) or via Cloud SQL proxy in CI/CD.
