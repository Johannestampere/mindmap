import os
import time
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get connection string from .env file or use fallback
connection_string = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:Reaal1.2345@iafhvkdyydxhckznncno.supabase.co:5432/postgres?sslmode=require"
)

print(f"Using connection string: {connection_string}")
print("Attempting to connect to database...")
start_time = time.time()

try:
    # Set a shorter timeout for the connection attempt
    engine = create_engine(
        connection_string, 
        connect_args={"connect_timeout": 10}
    )
    
    # Test connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print(f"Successfully connected to database! Result: {result.fetchone()}")
        
        # Try to get a list of tables
        tables = connection.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
        ))
        print("Tables in database:")
        for table in tables:
            print(f"  - {table[0]}")
            
    print(f"Connection test completed in {time.time() - start_time:.2f} seconds")
    
except Exception as e:
    print(f"Failed to connect to database after {time.time() - start_time:.2f} seconds")
    print(f"Error: {e}")
    print(f"Error type: {type(e).__name__}")
