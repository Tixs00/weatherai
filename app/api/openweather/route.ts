import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHERKEY || process.env.OpenWeather_API;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  name: string;
  cod: number;
}

interface ProcessedWeatherData {
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

/**
 * GET /api/openweather
 * Fetch current weather data from OpenWeatherMap API
 * Query params:
 *   - city: City name (e.g., "London")
 *   - lat: Latitude (e.g., 51.5074)
 *   - lon: Longitude (e.g., -0.1278)
 *   - units: Temperature units (metric, imperial) - default: metric
 */
export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      console.error('[OpenWeather API] Missing API key');
      return NextResponse.json(
        { error: 'OpenWeather API key not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const units = searchParams.get('units') || 'metric';

    let url = '';

    // Build appropriate API endpoint
    if (city) {
      url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    } else {
      return NextResponse.json(
        { error: 'Either city name or coordinates (lat, lon) must be provided' },
        { status: 400 }
      );
    }

    console.log('[OpenWeather API] Fetching from:', url.replace(API_KEY, '***'));

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[OpenWeather API] API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `OpenWeather API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: OpenWeatherResponse = await response.json();

    // Process and normalize the data
    const processedData: ProcessedWeatherData = {
      location: data.name,
      temperature: Math.round(data.main.temp * 10) / 10,
      feels_like: Math.round(data.main.feels_like * 10) / 10,
      temp_min: Math.round(data.main.temp_min * 10) / 10,
      temp_max: Math.round(data.main.temp_max * 10) / 10,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weather_type: data.weather[0].main,
      weather_description: data.weather[0].description,
      wind_speed: Math.round(data.wind.speed * 10) / 10,
      visibility_km: Math.round((data.visibility / 1000) * 10) / 10,
      cloud_cover: data.clouds.all,
      timestamp: data.dt,
    };

    console.log('[OpenWeather API] Successfully processed data for:', processedData.location);

    return NextResponse.json({
      success: true,
      data: processedData,
    });
  } catch (error) {
    console.error('[OpenWeather API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
