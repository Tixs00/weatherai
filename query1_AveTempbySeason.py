import pandas as pd

# -----------------------------------
# LOAD CLEANED DATA
# -----------------------------------
df = pd.read_csv("cleaned_weather_data.csv")

print("Total rows:", df.shape)

# -----------------------------------
# QUERY 1: Average Temperature by Season
# -----------------------------------
q1 = df.groupby("Season")["Temperature"].mean().sort_values(ascending=False)

print("\n=== Avg Temperature by Season ===")
print(q1)

q1.to_csv("query1_temperature_by_season.csv")
