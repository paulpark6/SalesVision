from app.db.base import Base
from app.db.session import engine
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.client import Client
from app.models.product import Product
# Import all other models to ensure they are registered with Base
from app.models.sale import Sale
from app.models.credit import Credit
from app.models.cash import Cash
from app.models.cheque import Cheque
from app.models.commission import Commission
from app.models.monthly_sales_target import MonthlySalesTarget
from app.models.overdue_collection import OverdueCollection
from app.models.price_list import PriceList
from app.models.expenditure import Expenditure
from app.models.stock import Stock

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset successfully!")

if __name__ == "__main__":
    reset_database()
