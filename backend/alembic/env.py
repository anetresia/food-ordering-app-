from logging.config import fileConfig

from alembic import context

from app.database import Base, engine

# Models import panrom
from app.models.category import Category
from app.models.food import Food
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem


# Alembic configuration
config = context.config


# Logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# SQLAlchemy models oda metadata
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    # app.database-la create pannina engine-a use panrom
    with engine.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()