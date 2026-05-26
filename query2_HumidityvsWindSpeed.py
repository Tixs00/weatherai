import pandas as pd

# -----------------------------------
# LOAD CLEANED DATA
# -----------------------------------
df = pd.read_csv("cleaned_weather_data.csv")

print("Total rows:", df.shape)

# -----------------------------------
# QUERY 2: Humidity vs Wind Speed
# -----------------------------------
q2 = df.groupby("Humidity")["Wind_Speed"].mean()

print("\n=== Humidity vs Wind Speed ===")
print(q2)

q2.to_csv("query2_humidity_wind.csv")
