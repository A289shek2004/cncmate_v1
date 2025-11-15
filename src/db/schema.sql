
-- Core tables for CNCMate MVP
CREATE TABLE IF NOT EXISTS machines (
    machine_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ideal_cycle_time_sec INTEGER DEFAULT 60
);

CREATE TABLE IF NOT EXISTS machine_readings (
    id BIGSERIAL PRIMARY KEY,
    machine_id INTEGER REFERENCES machines(machine_id),
    ts TIMESTAMP NOT NULL,
    spindle_speed_rpm INTEGER,
    vibration_g REAL,
    temperature_c REAL,
    tool_wear_pct REAL,
    is_running BOOLEAN,
    defect_flag BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS operators (
    operator_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    machine_id INTEGER REFERENCES machines(machine_id),
    operator_id INTEGER REFERENCES operators(operator_id),
    start_ts TIMESTAMP,
    end_ts TIMESTAMP,
    total_count INTEGER,
    good_count INTEGER
);

CREATE TABLE IF NOT EXISTS defects (
    defect_id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(job_id),
    machine_id INTEGER REFERENCES machines(machine_id),
    ts TIMESTAMP,
    defect_type TEXT,
    notes TEXT
);
