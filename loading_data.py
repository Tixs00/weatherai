import os
from supabase import create_client
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(url, key)

# 1. LOAD SAMPLE DATA FROM SUPABASE
response = supabase.table("weatherdata").select("*").limit(10).execute()

# Convert to DataFrame
df = pd.DataFrame(response.data)

print("Original Data Shape:", df.shape)
print(df.head())