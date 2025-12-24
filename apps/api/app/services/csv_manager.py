import pandas as pd
import os
from pathlib import Path
from typing import List, Dict, Any

class CSVManager:
    def __init__(self):
        # Assuming the structure is:
        # project_root/
        #   apps/api/app/services/csv_manager.py
        #   db/csv/
        # So we go up 4 levels to get to project root
        current_file = Path(__file__).resolve()
        # Go up 5 levels: services -> app -> api -> apps -> project_root
        self.project_root = current_file.parents[4]
        self.db_path = self.project_root / "db" / "csv"

    def _get_file_path(self, category: str, filename: str) -> Path:
        """Constructs the absolute path to the CSV file."""
        return self.db_path / category / filename

    def read_csv(self, category: str, filename: str) -> List[Dict[str, Any]]:
        """Reads a CSV file and returns a list of dictionaries.
        
        Args:
            category: The subdirectory in db/csv (e.g., 'employees')
            filename: The name of the file (e.g., 'employees.csv')
            
        Returns:
            List of records handling NaNs as None/empty strings where appropriate
        """
        file_path = self._get_file_path(category, filename)
        if not file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {file_path}")

        # Read CSV, replacing NaN with None to be JSON compatible
        df = pd.read_csv(file_path)
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient='records')

    def write_csv(self, category: str, filename: str, data: List[Dict[str, Any]]) -> None:
        """Writes a list of dictionaries to a CSV file.
        
        Args:
            category: The subdirectory in db/csv
            filename: The name of the file
            data: List of dicts to write
        """
        file_path = self._get_file_path(category, filename)
        
        # Ensure directory exists
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        df = pd.DataFrame(data)
        df.to_csv(file_path, index=False)

    def append_row(self, category: str, filename: str, row: Dict[str, Any]) -> None:
        """Appends a single row to a CSV file."""
        file_path = self._get_file_path(category, filename)
        
        # If file doesn't exist, create it with this row
        if not file_path.exists():
            self.write_csv(category, filename, [row])
            return

        # Append using mode 'a', but need to handle header if file empty? 
        # Pandas to_csv mode='a' writes header by default, which we don't want if appending.
        # Safer to read, append, write for consistency unless performance is critical
        data = self.read_csv(category, filename)
        data.append(row)
        self.write_csv(category, filename, data)

    def update_row(self, category: str, filename: str, id_field: str, id_value: Any, new_data: Dict[str, Any]) -> bool:
        """Updates a row where id_field matches id_value."""
        data = self.read_csv(category, filename)
        updated = False
        for i, row in enumerate(data):
            # Convert both to string for comparison safety
            if str(row.get(id_field)) == str(id_value):
                data[i] = {**row, **new_data}
                updated = True
                break
        
        if updated:
            self.write_csv(category, filename, data)
            return True
        return False

    def delete_row(self, category: str, filename: str, id_field: str, id_value: Any) -> bool:
        """Deletes a row where id_field matches id_value."""
        data = self.read_csv(category, filename)
        original_len = len(data)
        data = [row for row in data if str(row.get(id_field)) != str(id_value)]
        
        if len(data) < original_len:
            self.write_csv(category, filename, data)
            return True
        return False
