#!/usr/bin/env bash
# Quick helper to run everything (assumes .env configured, models trained)
# Terminal 1 (API):
#   uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
# Terminal 2 (Streamlit):
#   streamlit run dashboards/app.py
echo "See comments above for commands."
