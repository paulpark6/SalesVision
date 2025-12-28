from typing import List, Optional
from pydantic import BaseModel
from datetime import date


class EmployeeTargetResponse(BaseModel):
    employee_id: int
    employee_name: str
    current_sales: float
    target_sales: float
    achievement_rate: float

    class Config:
        from_attributes = True


class TeamPerformanceResponse(BaseModel):
    month: str
    year: int
    employees: List[dict]  # {name: str, target: float, actual: float, prior_year: float}
    total_target: float
    total_actual: float
    total_prior_year: float
    achievement_rate: float
    yoy_growth: float

    class Config:
        from_attributes = True


class CustomerCreditResponse(BaseModel):
    customer_id: int
    customer_name: str
    employee_name: str
    nearing: float
    due: float
    overdue: float
    total: float

    class Config:
        from_attributes = True


class SalesTrendDataPoint(BaseModel):
    date: date
    sales_amount: float

    class Config:
        from_attributes = True


class SalesTrendsResponse(BaseModel):
    data_points: List[SalesTrendDataPoint]
    total_sales: float
    start_date: date
    end_date: date

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    """Summary statistics for the dashboard."""
    total_sales: float
    active_clients: int
    inventory_value: float
    commission_due: float
    sales_growth_percent: Optional[float] = None

    class Config:
        from_attributes = True
