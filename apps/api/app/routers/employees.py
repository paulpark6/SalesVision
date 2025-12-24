from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from ..services.csv_manager import CSVManager

router = APIRouter(prefix="/employees", tags=["employees"])
csv_manager = CSVManager()

CATEGORY = "employees"
FILENAME = "employees.csv"

class EmployeeBase(BaseModel):
    value: str
    label: str
    name: str
    role: str
    manager: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    label: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    manager: Optional[str] = None

@router.get("/", response_model=List[EmployeeBase])
async def get_employees():
    try:
        data = csv_manager.read_csv(CATEGORY, FILENAME)
        # Filter out empty rows if any
        return [row for row in data if row.get("value")]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=EmployeeBase)
async def create_employee(employee: EmployeeCreate):
    try:
        # Check for duplicate ID
        current_data = csv_manager.read_csv(CATEGORY, FILENAME)
        if any(row['value'] == employee.value for row in current_data):
            raise HTTPException(status_code=400, detail="Employee with this ID already exists")
            
        csv_manager.append_row(CATEGORY, FILENAME, employee.dict())
        return employee
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{employee_id}", response_model=EmployeeBase)
async def update_employee(employee_id: str, employee_update: EmployeeUpdate):
    try:
        # We need to fetch the existing record first to merge
        current_data = csv_manager.read_csv(CATEGORY, FILENAME)
        existing = next((row for row in current_data if str(row['value']) == str(employee_id)), None)
        
        if not existing:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Merge updates
        update_data = employee_update.dict(exclude_unset=True)
        new_data = {**existing, **update_data}
        
        success = csv_manager.update_row(CATEGORY, FILENAME, "value", employee_id, new_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update record")
            
        return new_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    try:
        success = csv_manager.delete_row(CATEGORY, FILENAME, "value", employee_id)
        if not success:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"message": "Employee deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
