"""Health-check endpoints."""

from fastapi import APIRouter

router = APIRouter(prefix="/healthz", tags=["health"])


@router.get("/ready", summary="Readiness probe")
async def readiness() -> dict[str, str]:
    """Return a simple readiness response."""
    return {"status": "ready"}


@router.get("/live", summary="Liveness probe")
async def liveness() -> dict[str, str]:
    """Return a simple liveness response."""
    return {"status": "alive"}
