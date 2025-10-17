"""FastAPI entrypoint for the SalesVision backend."""

from fastapi import FastAPI

from .routers import health

app = FastAPI(
    title="SalesVision API",
    description="Backend services for SalesVision planner.",
    version="0.1.0",
)

app.include_router(health.router)


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Simple root endpoint for smoke testing."""
    return {"status": "ok"}
