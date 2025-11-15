import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "cncmate")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "A289shek")

def run_sql(path: str):
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS
    )
    conn.autocommit = True
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.close()

if __name__ == "__main__":
    schema_path = Path(__file__).with_name("schema.sql")
    print(f"Initializing DB using {schema_path} ...")
    run_sql(str(schema_path))
    print("Done.")
