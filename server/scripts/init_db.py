"""
Initialize and upgrade the database schema
Run this script to create or update the database
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'database_schema.sql')

def init_database():
    """Initialize or upgrade the database with the latest schema"""
    print(f"Initializing database at: {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    
    # Read and execute schema
    with open(SCHEMA_PATH, 'r') as f:
        schema_sql = f.read()
    
    # Execute schema (CREATE IF NOT EXISTS is idempotent)
    cur.executescript(schema_sql)
    
    print("✓ Database schema initialized successfully")
    
    # Show table count
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = cur.fetchall()
    print(f"✓ Total tables: {len(tables)}")
    for table in tables:
        print(f"  - {table['name']}")
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_database()
