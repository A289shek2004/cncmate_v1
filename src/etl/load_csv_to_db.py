import argparse
import os
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "cncmate")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "A289shek")

def upsert_machines(conn, df):
    with conn.cursor() as cur:
        cur.execute("SELECT machine_id FROM machines")
        existing = {r[0] for r in cur.fetchall()}
        for mid in sorted(df['machine_id'].unique()):
            if mid not in existing:
                cur.execute("INSERT INTO machines(machine_id, name, ideal_cycle_time_sec) VALUES(%s, %s, %s)",
                            (int(mid), f"Machine {int(mid)}", 60))
    conn.commit()

def load_readings(conn, df):
    with conn.cursor() as cur:
        rows = list(df.itertuples(index=False, name=None))
        args_str = ",".join(["(%s,%s,%s,%s,%s,%s,%s,%s)"] * len(rows))
        flat = []
        for r in rows:
            flat.extend(r)
        cur.execute(
            "INSERT INTO machine_readings(machine_id, ts, spindle_speed_rpm, vibration_g, temperature_c, tool_wear_pct, is_running, defect_flag) VALUES " + args_str,
            flat
        )
    conn.commit()

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--readings", type=str, required=True)
    args = ap.parse_args()

    df = pd.read_csv(args.readings, parse_dates=['ts'])
    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
    upsert_machines(conn, df)
    load_readings(conn, df)
    conn.close()
    print(f"Loaded {len(df)} readings into PostgreSQL.")
