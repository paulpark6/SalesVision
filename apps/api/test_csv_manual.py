import sys
import os
from pathlib import Path

# Add app directory to sys.path so we can import services
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))

from app.services.csv_manager import CSVManager

def test_csv_manager():
    manager = CSVManager()
    print(f"Project root: {manager.project_root}")
    print(f"DB path: {manager.db_path}")

    # Test reading employees
    try:
        employees = manager.read_csv("employees", "employees.csv")
        print(f"Read {len(employees)} employees.")
        if employees:
            print(f"First employee: {employees[0]}")
    except Exception as e:
        print(f"Error reading employees: {e}")

if __name__ == "__main__":
    test_csv_manager()
