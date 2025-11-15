import numpy as np

def infer_sample_seconds(df):
    if df.empty: return 60
    g = df.sort_values('ts').groupby('machine_id')['ts'].diff().dropna().dt.total_seconds()
    if g.empty:
        return 60
    return int(g.median())

def planned_mask(ts):
    # planned production window: 08:00–20:00
    hr = ts.dt.hour
    return (hr >= 8) & (hr < 20)

def compute_oee_proxy(df, target_rpm=1500):
    if df.empty:
        return dict(availability=0.0, performance=0.0, quality=0.0, oee=0.0)
    df = df.copy()
    samp_sec = infer_sample_seconds(df)
    # Availability
    df['planned'] = planned_mask(df['ts'])
    planned_time = df.loc[df['planned']].shape[0] * samp_sec
    runtime = df.loc[df['planned'] & (df['is_running']==True)].shape[0] * samp_sec
    availability = (runtime / planned_time) if planned_time > 0 else 0.0

    # Performance proxy: avg spindle / target
    perf = (df.loc[df['is_running']==True, 'spindle_speed_rpm'].mean() or 0.0) / target_rpm
    perf = float(np.clip(perf, 0, 1.2))

    # Quality: 1 - defect rate
    defect_rate = float(df['defect_flag'].mean() or 0.0)
    quality = max(0.0, 1.0 - defect_rate)

    oee = availability * perf * quality
    return dict(availability=availability, performance=perf, quality=quality, oee=oee)
