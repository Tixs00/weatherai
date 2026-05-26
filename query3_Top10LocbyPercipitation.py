import pandas as pd

# -----------------------------------
# LOAD CLEANED DATA
# -----------------------------------
df = pd.read_csv("cleaned_weather_data.csv")

print("Total rows:", df.shape)

# -----------------------------------
# QUERY 3: Top 10 Locations by Precipitation
# -----------------------------------
q3 = df.sort_values(by="Precipitation(%)", ascending=False).head(10)

print("\n=== Top 10 Locations by Precipitation ===")
print(q3[["Location", "Precipitation(%)", "Temperature"]])

q3.to_csv("query3_top_precipitation.csv", index=False)