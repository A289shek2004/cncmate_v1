import argparse
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

def simulate_readings(machines=3, days=7, freq_sec=30, seed=42):
    random.seed(seed)
    np.random.seed(seed)
    rows = []
    start = datetime.now() - timedelta(days=days)
    timestamps = int(days*24*60*60 / freq_sec)
    for m in range(1, machines+1):
        for i in range(timestamps):
            ts = start + timedelta(seconds=i*freq_sec)
            is_running = (ts.hour >= 8 and ts.hour < 20) and (np.random.rand() > 0.05)
            spindle = int(np.clip(np.random.normal(1500, 400), 200, 3000)) if is_running else 0
            vibration = float(np.clip(np.random.normal(0.25, 0.08), 0.05, 1.2))
            temperature = float(np.clip(np.random.normal(40 + spindle/200, 3), 20, 90))
            tool_wear = float(np.clip(np.random.normal(30 + (i / timestamps)*60, 5), 0, 100))
            defect = bool(np.random.rand() < 0.01 and is_running and vibration > 0.45)
            rows.append([m, ts, spindle, vibration, temperature, tool_wear, is_running, defect])
    df = pd.DataFrame(rows, columns=[
        "machine_id","ts","spindle_speed_rpm","vibration_g","temperature_c","tool_wear_pct","is_running","defect_flag"
    ])
    return df

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--machines", type=int, default=3)
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--freq", type=int, default=30, help="seconds")
    ap.add_argument("--to_csv", type=str, default="data/machine_readings.csv")
    args = ap.parse_args()

    df = simulate_readings(args.machines, args.days, args.freq)
    out = args.to_csv
    df.to_csv(out, index=False)
    print(f"Saved {len(df)} rows -> {out}")
