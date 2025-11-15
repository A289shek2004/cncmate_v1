import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--readings', type=str, required=True)
args = ap.parse_args()

df = pd.read_csv(args.readings, parse_dates=['ts'])

# Label (synthetic failure label): if high vibration & high temp & high tool wear -> 1
df['failure_soon'] = ((df['vibration_g'] > 0.6) & (df['temperature_c'] > 60) & (df['tool_wear_pct'] > 70)).astype(int)

features = ['spindle_speed_rpm','vibration_g','temperature_c','tool_wear_pct']
X = df[features].values
y = df['failure_soon'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

clf = RandomForestClassifier(n_estimators=150, random_state=42, class_weight='balanced')
clf.fit(X_train_s, y_train)
y_pred = clf.predict(X_test_s)

report = classification_report(y_test, y_pred, output_dict=True)
Path('artifacts').mkdir(exist_ok=True, parents=True)
joblib.dump({'model': clf, 'scaler': scaler, 'features': features}, 'artifacts/pm_model.pkl')

# Save metrics
import json
with open('artifacts/pm_metrics.json','w') as f:
    json.dump(report, f, indent=2)

print('Saved model -> artifacts/pm_model.pkl')
print('Saved metrics -> artifacts/pm_metrics.json')
