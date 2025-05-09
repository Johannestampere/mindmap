from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import settings # settings.DATABASE_URL

# 1. Engine using DATABASE_URL from config (Represents the core interface to the database)
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,               # log SQL to stdout (dev only)
    future=True              # use SQLAlchemy 2.0 style
)

# 2. Create a session factory (When called, returns a new SQLAlchemy ORM Session bound to our engine)
SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine,             # ties session to database engine.
    future=True
)

# 3. Dependency in every endpoint that needs database access (FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
