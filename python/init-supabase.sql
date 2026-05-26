-- Weather Data Insights Dashboard - Supabase Setup Script
-- NOTE: This script is for reference. The actual table "weatherdata" has already been created via migration.

-- Table structure (already created in Supabase):
-- Table name: weatherdata (no underscore)
-- CSV Headers: id,Temperature,Humidity,Wind_Speed,Precipitation(%),Cloud_Cover,Atmospheric_Pressure,UV_Index,Season,Visibility(km),Location,Weather_Type

/*
CREATE TABLE public.weatherdata (
  id BIGINT PRIMARY KEY,
  "Temperature" DOUBLE PRECISION NOT NULL,
  "Humidity" BIGINT NOT NULL,
  "Wind_Speed" DOUBLE PRECISION NOT NULL,
  "Precipitation(%)" BIGINT NOT NULL,
  "Cloud_Cover" TEXT NOT NULL,
  "Atmospheric_Pressure" DOUBLE PRECISION NOT NULL,
  "UV_Index" BIGINT NOT NULL,
  "Season" TEXT NOT NULL,
  "Visibility(km)" DOUBLE PRECISION NOT NULL,
  "Location" TEXT NOT NULL,
  "Weather_Type" TEXT NOT NULL
);

-- RLS Policy already applied:
-- "Allow public read access" - allows SELECT for all users
*/
