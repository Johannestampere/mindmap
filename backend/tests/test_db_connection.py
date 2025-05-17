import os
import pytest
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def test_database_connection():
    """Test if we can connect to the database"""
    assert DATABASE_URL is not None, "DATABASE_URL not found in environment variables"

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        assert version is not None
        print(f"PostgreSQL version: {version}")


def test_tables_exist():
    """Test if all required tables exist"""
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        result = conn.execute(text("""
                                   SELECT table_name
                                   FROM information_schema.tables
                                   WHERE table_schema = 'public'
                                     AND table_name IN ('users', 'mindmaps', 'nodes', 'votes')
                                   ORDER BY table_name
                                   """))

        tables = [row[0] for row in result.fetchall()]
        print(f"Found tables: {tables}")

        expected_tables = ['mindmaps', 'nodes', 'users', 'votes']
        assert len(tables) == 4, f"Expected 4 tables, found {len(tables)}"

        for table in expected_tables:
            assert table in tables, f"Table {table} not found"


def test_alembic_version():
    """Test if alembic version table exists"""
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        result = conn.execute(text("""
                                   SELECT EXISTS (SELECT
                                                  FROM information_schema.tables
                                                  WHERE table_schema = 'public'
                                                    AND table_name = 'alembic_version')
                                   """))

        has_alembic = result.fetchone()[0]
        if has_alembic:
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            version = result.fetchone()
            if version:
                print(f"Alembic version: {version[0]}")
        else:
            pytest.fail("Alembic version table not found - run migrations")


if __name__ == "__main__":
    print("Testing database connection...")
    test_database_connection()
    print("Database connection successful")

    print("Testing tables...")
    test_tables_exist()
    print("All tables exist")

    print("Testing alembic...")
    test_alembic_version()
    print("Alembic check complete")

    print("All tests passed!")
