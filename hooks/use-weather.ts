import { useState, useCallback } from 'react';

export interface OpenWeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  weather_type: string;
  weather_description: string;
  wind_speed: number;
  visibility_km: number;
  cloud_cover: number;
  timestamp: number;
}

interface UseWeatherReturn {
  data: OpenWeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  clearWeather: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [data, setData] = useState<OpenWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useWeather] Fetching weather for city:', city);
      const response = await fetch(`/api/openweather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const result = await response.json();
      console.log('[useWeather] Weather data received:', result.data);
      setData(result.data);
    } catch (err) {
      console.error('[useWeather] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useWeather] Fetching weather for coordinates:', lat, lon);
      const response = await fetch(`/api/openweather?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const result = await response.json();
      console.log('[useWeather] Weather data received:', result.data);
      setData(result.data);
    } catch (err) {
      console.error('[useWeather] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    console.log('[useWeather] Clearing weather data');
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCoords,
    clearWeather,
  };
}
