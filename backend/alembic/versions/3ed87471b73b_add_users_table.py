"""add users table

Revision ID: 3ed87471b73b
Revises: 446a2d942bc5
Create Date: 2026-10-01 14:09:19.609253

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3ed87471b73b"
down_revision: Union[str, Sequence[str], None] = "446a2d942bc5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create users table."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("password", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.String(length=20),
            nullable=False,
            server_default="user"
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email")
    )

    op.create_index(
        op.f("ix_users_id"),
        "users",
        ["id"],
        unique=False
    )


def downgrade() -> None:
    """Remove users table."""
    op.drop_index(
        op.f("ix_users_id"),
        table_name="users"
    )
    op.drop_table("users")
    