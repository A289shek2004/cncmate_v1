# EDA Starter Script (run as: python notebooks/eda_starter.py)
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/machine_readings.csv', parse_dates=['ts'])
print(df.head())

# Correlation between vibration and temperature
print("\nCorrelation matrix:")
print(df[['vibration_g','temperature_c','spindle_speed_rpm','tool_wear_pct']].corr())

# Simple plots
df.set_index('ts')['vibration_g'].resample('1H').mean().plot(title='Avg Vibration per Hour')
plt.xlabel('Time'); plt.ylabel('g'); plt.tight_layout(); plt.show()

df.set_index('ts')['temperature_c'].resample('1H').mean().plot(title='Avg Temperature per Hour')
plt.xlabel('Time'); plt.ylabel('°C'); plt.tight_layout(); plt.show()
