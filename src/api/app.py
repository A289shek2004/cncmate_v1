import os
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="CNCMate MVP API", version="0.1.0")

pm_bundle = joblib.load('artifacts/pm_model.pkl')
anom_bundle = joblib.load('artifacts/anomaly_model.pkl')

class Reading(BaseModel):
    spindle_speed_rpm: int
    vibration_g: float
    temperature_c: float
    tool_wear_pct: float

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.post('/predict_maintenance')
def predict_pm(r: Reading):
    x = np.array([[r.spindle_speed_rpm, r.vibration_g, r.temperature_c, r.tool_wear_pct]])
    x_s = pm_bundle['scaler'].transform(x)
    proba = float(pm_bundle['model'].predict_proba(x_s)[0,1])
    return {'failure_probability': proba}

@app.post('/anomaly_score')
def anomaly_score(r: Reading):
    x = np.array([[r.spindle_speed_rpm, r.vibration_g, r.temperature_c, r.tool_wear_pct]])
    score = float(anom_bundle['model'].score_samples(x)[0])
    return {'anomaly_score': score}
