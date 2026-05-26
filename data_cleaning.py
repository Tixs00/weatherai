import os
from supabase import create_client
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(url, key)

# 1. LOAD DATA FROM SUPABASE
response = supabase.table("weatherdata").select("*").execute()
df = pd.DataFrame(response.data)

print("Original Data Shape:", df.shape)

# -----------------------------------
# 2. HANDLE MISSING VALUES
# -----------------------------------

# Drop rows with missing important values
df = df.dropna(subset=["Temperature", "Humidity"])

# Fill remaining missing numeric values with mean
df["Wind_Speed"] = df["Wind_Speed"].fillna(df["Wind_Speed"].mean())
df["Precipitation(%)"] = df["Precipitation(%)"].fillna(df["Precipitation(%)"].mean())

# Fill categorical values with "Unknown"
df["Weather_Type"] = df["Weather_Type"].fillna("Unknown")
df["Location"] = df["Location"].fillna("Unknown")

print("After Handling Missing Values:", df.shape)

# -----------------------------------
# 3. NORMALIZATION (Min-Max Scaling)
# -----------------------------------

df["Humidity_Normalized"] = (
    df["Humidity"] - df["Humidity"].min()
) / (
    df["Humidity"].max() - df["Humidity"].min()
)

# -----------------------------------
# 4. OUTLIER REMOVAL (IQR METHOD)
# -----------------------------------

Q1 = df["Temperature"].quantile(0.25)
Q3 = df["Temperature"].quantile(0.75)
IQR = Q3 - Q1

df = df[
    (df["Temperature"] >= Q1 - 1.5 * IQR) &
    (df["Temperature"] <= Q3 + 1.5 * IQR)
]

print("After Removing Outliers:", df.shape)

# -----------------------------------
# 5. EXPORT CLEANED DATA
# -----------------------------------

df.to_csv("cleaned_weather_data.csv", index=False)

print("Cleaned dataset saved successfully!")
