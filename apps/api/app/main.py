"""FastAPI entrypoint for the SalesVision backend."""

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from .routers import health, employees

app = FastAPI(
    title="SalesVision API",
    description="Backend services for SalesVision planner.",
    version="0.1.0",
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:9002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:9002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(employees.router)


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Simple root endpoint for smoke testing."""
    # Debug: Print all routes
    return {"status": "ok"}
