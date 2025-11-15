import os
import pandas as pd
import numpy as np
import streamlit as st
import plotly.express as px
import requests
from datetime import datetime, timedelta
import time
from streamlit_autorefresh import st_autorefresh

# Auto refresh every 30 sec
st_autorefresh(interval=30 * 1000, key="datarefresh")

st.set_page_config(page_title='CNCMate MVP', layout='wide')

st.title('🛠️ CNCMate — CNC Analytics (MVP)')

# ============ LOAD DATA ============
@st.cache_data
def load_data():
    df = pd.read_csv('data/machine_readings.csv', parse_dates=['ts'])
    return df

df = load_data()

# ============ SIDEBAR FILTERS ============
machines = sorted(df['machine_id'].unique().tolist())
sel_m = st.sidebar.selectbox('Machine', machines)

# Limit selection to last 3 days only
min_allowed = df['ts'].max().date() - timedelta(days=2)  # last 3 days
start_date = st.sidebar.date_input('From', value=(df['ts'].max().date() - timedelta(days=2)), 
                                   min_value=min_allowed, max_value=df['ts'].max().date())
end_date = st.sidebar.date_input('To', value=df['ts'].max().date(),
                                 min_value=min_allowed, max_value=df['ts'].max().date())

# Chart type toggle
chart_type = st.sidebar.radio("Chart Type", ["Line", "Area"])

# Auto-refresh toggle
auto_refresh = st.sidebar.checkbox("Auto Refresh every 30s", value=False)

# ============ DATA FILTER ============
mask = (df['machine_id'] == sel_m) & (df['ts'].dt.date >= start_date) & (df['ts'].dt.date <= end_date)
d = df[mask].copy()

# ============ METRICS ============
st.subheader('Factory Overview')
col1, col2, col3, col4 = st.columns(4)
running_rate = (d['is_running'].mean() if len(d) else 0.0) * 100
avg_vib = d['vibration_g'].mean() if len(d) else 0.0
avg_temp = d['temperature_c'].mean() if len(d) else 0.0
defect_rate = (d['defect_flag'].mean() if len(d) else 0.0) * 100
col1.metric('Utilization %', f"{running_rate:0.1f}%")
col2.metric('Avg Vibration (g)', f"{avg_vib:0.3f}")
col3.metric('Avg Temp (°C)', f"{avg_temp:0.1f}")
col4.metric('Defect Rate %', f"{defect_rate:0.2f}%")

st.markdown('---')

# ============ TIME SERIES ============
st.subheader('Time Series — Vibration & Temperature')
if len(d):
    if chart_type == "Line":
        fig1 = px.line(d, x='ts', y='vibration_g', title='Vibration (g)')
        fig2 = px.line(d, x='ts', y='temperature_c', title='Temperature (°C)')
    else:  # Area chart
        fig1 = px.area(d, x='ts', y='vibration_g', title='Vibration (g)')
        fig2 = px.area(d, x='ts', y='temperature_c', title='Temperature (°C)')
    st.plotly_chart(fig1, use_container_width=True)
    st.plotly_chart(fig2, use_container_width=True)
else:
    st.info('No data for selected range.')

st.markdown('---')

# ============ MAINTENANCE PREDICTION ============
st.subheader('Maintenance Prediction (via FastAPI)')
st.caption('Enter a hypothetical reading to get failure probability and anomaly score.')

c1, c2, c3, c4 = st.columns(4)
spindle = c1.number_input('Spindle RPM', min_value=0, max_value=10000,
                          value=int(d['spindle_speed_rpm'].median() if len(d) else 1500))
vib = float(c2.number_input('Vibration g', min_value=0.0, max_value=2.0,
                            value=float(d['vibration_g'].median() if len(d) else 0.3)))
temp = float(c3.number_input('Temperature °C', min_value=0.0, max_value=120.0,
                             value=float(d['temperature_c'].median() if len(d) else 45.0)))
wear = float(c4.number_input('Tool Wear %', min_value=0.0, max_value=100.0,
                             value=float(d['tool_wear_pct'].median() if len(d) else 35.0)))

api_url = st.text_input('API Base URL', value='http://localhost:8000')

if st.button('Predict'):
    payload = {
        'spindle_speed_rpm': int(spindle),
        'vibration_g': float(vib),
        'temperature_c': float(temp),
        'tool_wear_pct': float(wear)
    }
    try:
        pm = requests.post(f"{api_url}/predict_maintenance", json=payload, timeout=5).json()
        an = requests.post(f"{api_url}/anomaly_score", json=payload, timeout=5).json()
        st.success(f"Failure Probability: {pm.get('failure_probability', None):0.3f}")
        st.warning(f"Anomaly Score: {an.get('anomaly_score', None):0.3f}")
    except Exception as e:
        st.error(f"API call failed: {e}")

# ============ AUTO REFRESH ============
if auto_refresh:
    st_autorefresh(interval=30 * 1000, key="datarefresh")
