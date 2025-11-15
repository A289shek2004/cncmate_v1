# CNCMate MVP — AI-powered CNC Manufacturing Analytics (College/Portfolio)

https://chatgpt.com/share/68ac027b-4d74-8011-a4f7-c56b25a5b66d


This repository is a **starter template** to help you build an MVP that demonstrates
**Data Engineering, Data Analytics, Data Science, Machine Learning, and AI** skills end-to-end.

## What you get
- **Data Simulation** for CNC signals (vibration, temperature, spindle speed, tool wear)
- **PostgreSQL schema** and ETL scripts
- **Dashboards** with Streamlit (OEE, Utilization, Downtime, Operator productivity)
- **ML models** (Predictive maintenance + Anomaly detection) with FastAPI serving
- **Notebooks** for EDA/DS
- **Step-by-step commands** to run locally

> You can extend this to TimescaleDB later by enabling the extension on your PostgreSQL server.

---

## Prerequisites
- Python 3.10+
- PostgreSQL 14+ (local or cloud)
- (Optional) TimescaleDB extension enabled on your Postgres instance
- Git

## Setup
```bash
git clone <your-repo-url>
cd cncmate_mvp
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # then edit the values
```

## Environment variables (.env)
```
# PostgreSQL connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cncmate
DB_USER=postgres
DB_PASS=postgres

# FastAPI
API_HOST=0.0.0.0
API_PORT=8000
```

Create the database manually (once), e.g. in psql:
```sql
CREATE DATABASE cncmate;
```

## Initialize DB schema
```bash
python src/db/init_db.py
```

## Generate sample data (CSV) and quick load into DB
```bash
python data/simulate_cnc.py --machines 3 --days 7 --to_csv data/machine_readings.csv
python src/etl/load_csv_to_db.py --readings data/machine_readings.csv
```

## Train ML models
```bash
python src/ml/train_predictive_maintenance.py --readings data/machine_readings.csv
python src/ml/train_anomaly.py --readings data/machine_readings.csv
```

## Run FastAPI service (serves predictions)
```bash
uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
# endpoints:
#   GET  /health
#   POST /predict_maintenance
#   POST /anomaly_score
```

## Run Streamlit dashboard (visual analytics)
```bash
streamlit run dashboards/app.py
```

Open the browser:
- FastAPI docs: http://localhost:8000/docs
- Streamlit app: http://localhost:8501

---

## OEE Formula (used in dashboard)
- **Availability** = Runtime / Planned Production Time
- **Performance** = (Ideal Cycle Time × Total Count) / Runtime
- **Quality** = Good Count / Total Count
- **OEE** = Availability × Performance × Quality

In this MVP, we simulate counts from cycle time and flags.

---

## Suggested Folder Map
```
cncmate_mvp/
├─ artifacts/                  # saved models, metrics
├─ config/
├─ dashboards/
│  └─ app.py                  # Streamlit dashboard
├─ data/
│  └─ simulate_cnc.py         # data simulator
├─ notebooks/
│  └─ eda_starter.py
├─ scripts/
│  └─ run_all.sh
├─ src/
│  ├─ api/app.py              # FastAPI server
│  ├─ db/init_db.py           # create tables
│  ├─ db/schema.sql
│  ├─ etl/load_csv_to_db.py
│  └─ ml/
│     ├─ train_predictive_maintenance.py
│     └─ train_anomaly.py
├─ .env.example
├─ requirements.txt
└─ README.md
```

## Week-by-week plan (8 weeks, beginner-friendly)
- **Week 1**: Install tools, initialize repo, DB, run simulator, load data
- **Week 2**: Build basic Streamlit dashboard (Overview + Machine page)
- **Week 3**: Add OEE, utilization, downtime, operator views
- **Week 4**: EDA + DS notebook (correlations, trends, basic regression)
- **Week 5**: Train predictive maintenance model
- **Week 6**: Train anomaly detection, save models
- **Week 7**: Expose ML via FastAPI; connect Streamlit -> API
- **Week 8**: Polish UI, write README, record demo video, optional cloud deploy

Good luck! 🚀
