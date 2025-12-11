import os
import psycopg2
from dotenv import load_dotenv

# Load env vars from .env file in project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(project_root, '.env'))

DATABASE_URL = os.getenv('DATABASE_URL')
SCHEMA_FILE = os.path.join(project_root, 'server', 'database_schema_pg.sql')

def run_migration():
    if not DATABASE_URL:
        print("Error: DATABASE_URL not found in .env")
        return

    print("Connecting to database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print(f"Reading schema from {SCHEMA_FILE}...")
        with open(SCHEMA_FILE, 'r') as f:
            schema_sql = f.read()
            
        print("Executing migration...")
        # Execute the whole block. psycopg2 supports multiple statements.
        cur.execute(schema_sql)
        conn.commit()
        
        print("✅ Migration successful! New tables created.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == '__main__':
    run_migration()
