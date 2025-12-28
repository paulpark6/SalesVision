from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.sale import Sale
from app.schemas.sale import Sale as SaleSchema, SaleCreate, SaleUpdate
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.product import Product
from app.models.client import Client

router = APIRouter(
    prefix="/sales",
    tags=["sales"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[SaleSchema])
def read_sales(
    skip: int = 0,
    limit: int = 100,
    months: Optional[str] = Query(None, description="Comma-separated list of months in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Sale)
    
    # Month Filtering
    if months:
        month_list = [m.strip() for m in months.split(',')]
        # Filter by extracting YYYY-MM from sale_date field
        # We can extract month from Date type using func.to_char or simply by comparing
        conditions = []
        for m in month_list:
            try:
                year, month = map(int, m.split('-'))
                conditions.append(
                    (func.extract('year', Sale.sale_date) == year) & 
                    (func.extract('month', Sale.sale_date) == month)
                )
            except ValueError:
                continue
        if conditions:
            from sqlalchemy import or_
            query = query.filter(or_(*conditions))
    
    # RBAC Filtering
    if current_user.role == UserRole.ADMIN:
        pass # See all
    elif current_user.role == UserRole.MANAGER:
        # See self + direct reports
        if current_user.employee_id:
            reports_subquery = db.query(Employee.id).filter(
                (Employee.manager_id == current_user.employee_id) | 
                (Employee.id == current_user.employee_id)
            )
            query = query.filter(Sale.employee_id.in_(reports_subquery))
    else:
        # Staff: See own only
        if current_user.employee_id:
            query = query.filter(Sale.employee_id == current_user.employee_id)
            
    sales = query.offset(skip).limit(limit).all()
    return sales

@router.get("/{sale_num}", response_model=SaleSchema)
def read_sale(sale_num: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.sale_num == sale_num).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.post("", response_model=SaleSchema, status_code=status.HTTP_201_CREATED)
def create_sale(
    sale: SaleCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Resolve Product
    if sale.product_code:
        product = db.query(Product).filter(Product.product_code == sale.product_code).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Invalid product_code: {sale.product_code}")
        sale.product_id = product.id
    
    if not sale.product_id:
         raise HTTPException(status_code=400, detail="Either product_id or product_code is required")

    # 2. Resolve Client
    if sale.client_number:
        client = db.query(Client).filter(Client.client_number == sale.client_number).first()
        if not client:
            raise HTTPException(status_code=400, detail=f"Invalid client_number: {sale.client_number}")
        sale.client_id = client.id
    
    if not sale.client_id:
         # Optionally, we could allow sales without client? Schema says client_id is int, so required.
         raise HTTPException(status_code=400, detail="Either client_id or client_number is required")

    # 3. Resolve Staff (Employee)
    target_employee_id = current_user.employee_id
    
    # Allow specifying staff_number if Admin/Manager
    if sale.staff_number:
        if current_user.role == UserRole.STAFF:
             raise HTTPException(status_code=403, detail="Staff cannot create sales for others")
             
        staff = db.query(Employee).filter(Employee.staff_number == sale.staff_number).first()
        if not staff:
             raise HTTPException(status_code=400, detail=f"Invalid staff_number: {sale.staff_number}")
        target_employee_id = staff.id
    elif sale.employee_id:
         # Using ID directly
         if current_user.role == UserRole.STAFF and sale.employee_id != current_user.employee_id:
              raise HTTPException(status_code=403, detail="Staff cannot create sales for others")
         target_employee_id = sale.employee_id
    
    if not target_employee_id:
        raise HTTPException(status_code=400, detail="Current user is not linked to an employee")

    # 4. Create Sale
    sale_data = sale.model_dump(exclude={'product_code', 'client_number', 'staff_number'})
    sale_data['employee_id'] = target_employee_id
    sale_data['product_id'] = sale.product_id
    sale_data['client_id'] = sale.client_id
    
    db_sale = Sale(**sale_data)
    
    # Audit Fields
    db_sale.created_by = current_user.email
    db_sale.updated_by = current_user.email
    
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.put("/{sale_id}", response_model=SaleSchema)
def update_sale(
    sale_id: int, 
    sale_update: SaleUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    # Security: Hierarchical Check for Modification
    if current_user.role == UserRole.STAFF:
        # Staff can only edit their own sales
        if db_sale.employee_id != current_user.employee_id:
            raise HTTPException(status_code=403, detail="Not authorized to edit this sale")
    elif current_user.role == UserRole.MANAGER:
        # Managers can edit own sales OR sales of their reports
        is_own = db_sale.employee_id == current_user.employee_id
        is_report = False
        if not is_own:
            # Check if staff reporting to manager
            sales_staff = db.query(Employee).filter(Employee.id == db_sale.employee_id).first()
            if sales_staff and sales_staff.manager_id == current_user.employee_id:
                is_report = True
        
        if not (is_own or is_report):
             raise HTTPException(status_code=403, detail="Not authorized to edit this sale (not a direct report)")

    # Perform Update
    update_data = sale_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_sale, key, value)
    
    # Audit Field
    db_sale.updated_by = current_user.email

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/{sale_num}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(
    sale_num: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_sale = db.query(Sale).filter(Sale.sale_num == sale_num).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    # Security: Only Admin and Managers can delete? Or same rules as update?
    # Let's enforce: Admins can delete anything. Managers can delete their team's. Staff CANNOT delete.
    if current_user.role == UserRole.STAFF:
        raise HTTPException(status_code=403, detail="Staff cannot delete sales records. Request a manager.")
        
    if current_user.role == UserRole.MANAGER:
        is_own = db_sale.employee_id == current_user.employee_id
        is_report = False
        if not is_own:
             sales_staff = db.query(Employee).filter(Employee.id == db_sale.employee_id).first()
             if sales_staff and sales_staff.manager_id == current_user.employee_id:
                is_report = True
        
        if not (is_own or is_report):
             raise HTTPException(status_code=403, detail="Not authorized to delete this sale")

    db.delete(db_sale)
    db.commit()
    return None
