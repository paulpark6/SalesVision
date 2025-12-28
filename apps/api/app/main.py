"""FastAPI entrypoint for the SalesVision backend."""

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from .routers import (
    health, employees, sales, clients, products,
    cash, cheque, commission, credit, expenditure,
    monthly_sales_target, overdue_collection, price_list,
    stock, user, analytics
)

app = FastAPI(
    title="SalesVision API",
    description="Backend services for SalesVision planner.",
    version="0.1.0",
    redirect_slashes=False,
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
app.include_router(sales.router)
app.include_router(clients.router)
app.include_router(products.router)
app.include_router(cash.router)
app.include_router(cheque.router)
app.include_router(commission.router)
app.include_router(credit.router)
app.include_router(expenditure.router)
app.include_router(monthly_sales_target.router)
app.include_router(overdue_collection.router)
app.include_router(price_list.router)
app.include_router(stock.router)
app.include_router(user.router)
app.include_router(analytics.router)


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Simple root endpoint for smoke testing."""
    # Debug: Print all routes
    return {"status": "ok"}
