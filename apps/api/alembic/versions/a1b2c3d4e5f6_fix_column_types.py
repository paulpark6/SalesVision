"""fix column types: commissions.date -> date, overdue credit_amount -> numeric, stocks timestamps

Revision ID: a1b2c3d4e5f6
Revises: 00f6022eb4f9
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '00f6022eb4f9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 'YYYY-MM' becomes the 1st of the month; blanks become NULL
    op.alter_column('commissions', 'date', type_=sa.Date(), postgresql_using=(
        "CASE WHEN date ~ '^\\d{4}-\\d{2}$' THEN (date || '-01')::date "
        "ELSE NULLIF(date, '')::date END"))
    op.alter_column('overdue_collections', 'credit_amount', type_=sa.Numeric(15, 2))
    op.add_column('stocks', sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))
    op.add_column('stocks', sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))


def downgrade() -> None:
    op.drop_column('stocks', 'updated_at')
    op.drop_column('stocks', 'created_at')
    op.alter_column('overdue_collections', 'credit_amount', type_=sa.Integer())
    op.alter_column('commissions', 'date', type_=sa.String(10), postgresql_using="to_char(date, 'YYYY-MM-DD')")
