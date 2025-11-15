import argparse
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--readings', type=str, required=True)
args = ap.parse_args()

df = pd.read_csv(args.readings, parse_dates=['ts'])
features = ['spindle_speed_rpm','vibration_g','temperature_c','tool_wear_pct']
X = df[features].values

iso = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
iso.fit(X)

Path('artifacts').mkdir(exist_ok=True, parents=True)
joblib.dump({'model': iso, 'features': features}, 'artifacts/anomaly_model.pkl')
print('Saved anomaly model -> artifacts/anomaly_model.pkl')
