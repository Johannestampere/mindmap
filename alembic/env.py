import sys
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ──────────────────────────────────────────────────────────────────────────────
# Make sure the 'backend' folder (containing your app package) is on sys.path
project_dir = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(project_dir))
# ──────────────────────────────────────────────────────────────────────────────

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ──────────────────────────────────────────────────────────────────────────────
# Import your app's settings and Base metadata for 'autogenerate'
from backend.app.core.config import settings
from backend.app.models.base import Base  # ensure Base = declarative_base()

# Use the DATABASE_URL from your .env via settings
config.set_main_option("sqlalchemy.url", str(settings.DATABASE_URL))

# point Alembic at your model's MetaData
target_metadata = Base.metadata
# ──────────────────────────────────────────────────────────────────────────────


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
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
