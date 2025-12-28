from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta, date
from typing import List, Optional

from ..core.deps import get_db
from ..models.sale import Sale
from ..models.employee import Employee
from ..models.client import Client
from ..models.credit import Credit
from ..models.commission import Commission
from ..models.product import Product
from ..models.stock import Stock
from ..schemas.analytics import (
    EmployeeTargetResponse,
    TeamPerformanceResponse,
    CustomerCreditResponse,
    SalesTrendsResponse,
    SalesTrendDataPoint,
    DashboardSummary
)

router = APIRouter(prefix="/analytics", tags=["analytics"], redirect_slashes=False)


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get dashboard summary statistics from Cloud SQL.
    - Total sales amount
    - Active clients count
    - Inventory value
    - Commission due
    """
    # Total sales from Sale table (use sale_amount field)
    total_sales = db.query(func.sum(Sale.sale_amount)).scalar() or 0.0
    
    # Active clients count (all clients in the system)
    active_clients = db.query(func.count(Client.client_number)).scalar() or 0
    
    # Inventory value from Stock table (unit_cost * stock_qty)
    inventory_value = 0.0
    try:
        # Join stocks with products to calculate inventory value
        stocks = db.query(Stock).all()
        for stock in stocks:
            if stock.stock_qty and stock.product_code:
                # Get the product to find unit_cost
                product = db.query(Product).filter(Product.product_code == stock.product_code).first()
                if product and product.unit_cost:
                    inventory_value += float(product.unit_cost) * float(stock.stock_qty)
    except Exception as e:
        # If stock calculation fails, just use 0
        print(f"Error calculating inventory value: {e}")
        pass
    
    # Commission due (sum of unpaid commissions)
    commission_due = db.query(func.sum(Commission.commission)).scalar() or 0.0
    
    # Calculate sales growth (optional - need historical data)
    sales_growth_percent = None  # TODO: Compare with previous period
    
    return DashboardSummary(
        total_sales=float(total_sales),
        active_clients=int(active_clients),
        inventory_value=float(inventory_value),
        commission_due=float(commission_due),
        sales_growth_percent=sales_growth_percent
    )



@router.get("/employee-targets", response_model=List[EmployeeTargetResponse])
def get_employee_targets(
    db: Session = Depends(get_db)
):
    """
    Get employee sales targets and current performance.
    """
    # Get all employees
    employees = db.query(Employee).all()
    
    results = []
    for employee in employees:
        # Calculate current sales (simplified - get all sales for this employee)
        current_sales = db.query(func.sum(Sale.amount)).filter(
            Sale.staff == employee.staff_number
        ).scalar() or 0.0
        
        # Default target
        target_sales = 45000.0
        
        achievement_rate = (current_sales / target_sales * 100) if target_sales > 0 else 0.0
        
        results.append(EmployeeTargetResponse(
            employee_id=employee.id,
            employee_name=employee.name,
            current_sales=float(current_sales),
            target_sales=target_sales,
            achievement_rate=achievement_rate
        ))
    
    return results


@router.get("/team-performance", response_model=TeamPerformanceResponse)
def get_team_performance(
    db: Session = Depends(get_db)
):
    """
    Get team performance comparison.
    """
    employees_data = []
    total_target = 0.0
    total_actual = 0.0
    total_prior_year = 0.0
    
    employees = db.query(Employee).all()
    
    for employee in employees:
        # Get all sales for this employee
        current_sales = db.query(func.sum(Sale.amount)).filter(
            Sale.staff == employee.staff_number
        ).scalar() or 0.0
        
        # Default target and prior year
        target = 45000.0
        prior_year_sales = 0.0
        
        employees_data.append({
            "name": employee.name,
            "target": target,
            "actual": float(current_sales),
            "prior_year": prior_year_sales
        })
        
        total_target += target
        total_actual += float(current_sales)
        total_prior_year += prior_year_sales
    
    achievement_rate = (total_actual / total_target * 100) if total_target > 0 else 0.0
    yoy_growth = 0.0  # No prior year data yet
    
    return TeamPerformanceResponse(
        month=datetime.now().strftime("%B"),
        year=datetime.now().year,
        employees=employees_data,
        total_target=total_target,
        total_actual=total_actual,
        total_prior_year=total_prior_year,
        achievement_rate=achievement_rate,
        yoy_growth=yoy_growth
    )


@router.get("/customer-credit", response_model=List[CustomerCreditResponse])
def get_customer_credit(db: Session = Depends(get_db)):
    """
    Get customer credit summary (simplified).
    Returns empty list for now - needs Credit model fields verified.
    """
    # Return empty list to prevent errors
    return []


@router.get("/sales-trends", response_model=SalesTrendsResponse)
def get_sales_trends(
    db: Session = Depends(get_db)
):
    """
    Get sales trends (simplified).
    """
    today = datetime.now().date()
    start_date = today - timedelta(days=365)
    
    # Return empty data points for now
    return SalesTrendsResponse(
        data_points=[],
        total_sales=0.0,
        start_date=start_date,
        end_date=today
    )
