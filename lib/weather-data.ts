// Interface matching CSV column names exactly for Supabase import
// CSV Headers: id,Temperature,Humidity,Wind_Speed,Precipitation(%),Cloud_Cover,Atmospheric_Pressure,UV_Index,Season,Visibility(km),Location,Weather_Type
export interface SupabaseWeatherRecord {
  id: number;
  Temperature: number;
  Humidity: number;
  Wind_Speed: number;
  "Precipitation(%)": number;
  Cloud_Cover: string;
  Atmospheric_Pressure: number;
  UV_Index: number;
  Season: string;
  "Visibility(km)": number;
  Location: string;
  Weather_Type: string;
}

// Normalized interface for use in app components (lowercase properties)
export interface WeatherRecord {
  id: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation_percent: number;
  cloud_cover: string;
  atmospheric_pressure: number;
  uv_index: number;
  season: string;
  visibility_km: number;
  location: string;
  weather_type: string;
}

// Helper function to normalize data from Supabase to a consistent format
export function normalizeWeatherRecord(record: SupabaseWeatherRecord): WeatherRecord {
  return {
    id: record.id,
    temperature: record.Temperature,
    humidity: record.Humidity,
    wind_speed: record.Wind_Speed,
    precipitation_percent: record["Precipitation(%)"],
    cloud_cover: record.Cloud_Cover,
    atmospheric_pressure: record.Atmospheric_Pressure,
    uv_index: record.UV_Index,
    season: record.Season,
    visibility_km: record["Visibility(km)"],
    location: record.Location,
    weather_type: record.Weather_Type,
  };
}

// Sample data in normalized format for local development/fallback
export const weatherData: WeatherRecord[] = [
  { id: 1, temperature: 14, humidity: 73, wind_speed: 9.5, precipitation_percent: 82, cloud_cover: 'partly cloudy', atmospheric_pressure: 1010.82, uv_index: 2, season: 'Winter', visibility_km: 3.5, location: 'inland', weather_type: 'Rainy' },
  { id: 2, temperature: 39, humidity: 96, wind_speed: 8.5, precipitation_percent: 71, cloud_cover: 'partly cloudy', atmospheric_pressure: 1011.43, uv_index: 7, season: 'Spring', visibility_km: 10, location: 'inland', weather_type: 'Cloudy' },
  { id: 3, temperature: 30, humidity: 64, wind_speed: 7, precipitation_percent: 16, cloud_cover: 'clear', atmospheric_pressure: 1018.72, uv_index: 5, season: 'Spring', visibility_km: 5.5, location: 'mountain', weather_type: 'Sunny' },
  { id: 4, temperature: 38, humidity: 83, wind_speed: 1.5, precipitation_percent: 82, cloud_cover: 'clear', atmospheric_pressure: 1026.25, uv_index: 7, season: 'Spring', visibility_km: 1, location: 'coastal', weather_type: 'Sunny' },
  { id: 5, temperature: 27, humidity: 74, wind_speed: 17, precipitation_percent: 66, cloud_cover: 'overcast', atmospheric_pressure: 990.67, uv_index: 1, season: 'Winter', visibility_km: 2.5, location: 'mountain', weather_type: 'Rainy' },
];
