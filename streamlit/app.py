import pandas as pd
import streamlit as st
import plotly.express as px
from dotenv import load_dotenv
from datetime import timedelta

from utils.oee import compute_oee_proxy
from utils.db import get_engine_from_env, list_machines, load_readings

st.set_page_config(page_title="CNC Analytics — Week 2 Scratch", layout="wide")
st.title("🛠️ CNC Analytics Dashboard (Week 2 — from scratch)")

load_dotenv()

# ---- Data source ----
src = st.sidebar.radio("Data source", ["CSV", "PostgreSQL"], index=0)

@st.cache_data(show_spinner=False)
def load_csv(path):
    df = pd.read_csv(path, parse_dates=['ts'])
    return df

df = pd.DataFrame()
machine_ids = []
date_min, date_max = None, None

if src == "CSV":
    default_csv = "data/machine_readings_small.csv"
    csv_path = st.sidebar.text_input("CSV path", value=default_csv)
    try:
        df = load_csv(csv_path)
        machine_ids = sorted(df['machine_id'].unique().tolist())
        date_min = df['ts'].min().date()
        date_max = df['ts'].max().date()
    except Exception as e:
        st.error(f"Failed to load CSV: {e}")
else:
    try:
        eng = get_engine_from_env()
        machine_ids = list_machines(eng)
        import pandas as pd
        with eng.begin() as conn:
            rng = pd.read_sql("SELECT MIN(ts) AS min_ts, MAX(ts) AS max_ts FROM machine_readings", conn)
        if not rng.empty:
            date_min = pd.to_datetime(rng.loc[0,'min_ts']).date()
            date_max = pd.to_datetime(rng.loc[0,'max_ts']).date()
    except Exception as e:
        st.error(f"DB connection failed: {e}")

# ---- Filters ----
if machine_ids and date_min and date_max:
    sel_machs = st.sidebar.multiselect("Machines", machine_ids, default=machine_ids[:3])
    date_from = st.sidebar.date_input("From", value=date_min, min_value=date_min, max_value=date_max)
    date_to   = st.sidebar.date_input("To", value=date_max, min_value=date_min, max_value=date_max)

    if src == "CSV":
        dmask = (df['machine_id'].isin(sel_machs)) & (df['ts'].dt.date >= date_from) & (df['ts'].dt.date <= date_to)
        d = df.loc[dmask].copy()
    else:
        start = pd.to_datetime(date_from)
        end = pd.to_datetime(date_to) + timedelta(days=1) - timedelta(seconds=1)
        d = load_readings(eng, sel_machs, start, end)

    st.caption(f"{len(d):,} rows selected.")
else:
    d = pd.DataFrame()

# ---- KPIs ----
col1, col2, col3, col4, col5 = st.columns(5)

if d.empty:
    col1.metric("Utilization %", "0.0%")
    col2.metric("Avg Vibration (g)", "0.000")
    col3.metric("Avg Temp (°C)", "0.0")
    col4.metric("Defect Rate %", "0.00%")
    col5.metric("OEE (proxy)", "0.0%")
else:
    util = float(d['is_running'].mean() * 100.0)
    vib  = float(d['vibration_g'].mean())
    temp = float(d['temperature_c'].mean())
    defect_pct = float(d['defect_flag'].mean() * 100.0)
    oee = compute_oee_proxy(d)
    col1.metric("Utilization %", f"{util:0.1f}%")
    col2.metric("Avg Vibration (g)", f"{vib:0.3f}")
    col3.metric("Avg Temp (°C)", f"{temp:0.1f}")
    col4.metric("Defect Rate %", f"{defect_pct:0.2f}%")
    col5.metric("OEE (proxy)", f"{oee['oee']*100:0.1f}%")

st.markdown("---")

# ---- Charts ----
if not d.empty:
    st.subheader("Time Series — Vibration & Temperature")
    fig1 = px.line(d, x="ts", y="vibration_g", color="machine_id", title="Vibration (g)")
    st.plotly_chart(fig1, use_container_width=True)

    fig2 = px.line(d, x="ts", y="temperature_c", color="machine_id", title="Temperature (°C)")
    st.plotly_chart(fig2, use_container_width=True)

    st.subheader("Daily Defect Rate (%)")
    dd = d.copy()
    dd['day'] = dd['ts'].dt.date
    grp = dd.groupby(['day'])['defect_flag'].mean().reset_index()
    grp['defect_pct'] = grp['defect_flag'] * 100.0
    fig3 = px.bar(grp, x="day", y="defect_pct", title="Defect Rate by Day (%)")
    st.plotly_chart(fig3, use_container_width=True)

    st.subheader("Utilization by Machine (%)")
    util_m = d.groupby('machine_id')['is_running'].mean().reset_index()
    util_m['util_pct'] = util_m['is_running'] * 100.0
    fig4 = px.bar(util_m, x="machine_id", y="util_pct", title="Utilization by Machine (%)")
    st.plotly_chart(fig4, use_container_width=True)
