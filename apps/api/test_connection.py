"""Test database connection and list tables."""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
conn = engine.connect()

result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
print('Tables in database:')
for row in result:
    print(f'  - {row[0]}')

# Count records
result = conn.execute(text("SELECT COUNT(*) FROM users"))
user_count = result.scalar()
print(f'\nUsers table: {user_count} records')

conn.close()
print('\n✅ Connection successful!')
