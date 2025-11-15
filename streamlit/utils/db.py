import os
from sqlalchemy import create_engine, text

def get_engine_from_env():
    host = os.getenv("DB_HOST","localhost")
    port = os.getenv("DB_PORT","5432")
    name = os.getenv("DB_NAME","cncmate")
    user = os.getenv("DB_USER","postgres")
    pwd  = os.getenv("DB_PASS","A289shek")
    url = f"postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{name}"
    return create_engine(url, pool_pre_ping=True)

def list_machines(engine):
    with engine.begin() as conn:
        res = conn.execute(text("SELECT machine_id FROM machines ORDER BY machine_id"))
        return [r[0] for r in res.fetchall()]

def load_readings(engine, machine_ids, start, end):
    sql = text("""
        SELECT machine_id, ts, spindle_speed_rpm, vibration_g, temperature_c, tool_wear_pct, is_running, defect_flag
        FROM machine_readings
        WHERE machine_id = ANY(:mids)
          AND ts >= :start AND ts <= :end
        ORDER BY ts
    """)
    import pandas as pd
    with engine.begin() as conn:
        df = pd.read_sql(sql, conn, params={"mids": machine_ids, "start": start, "end": end})
    return df
