import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get('season');
    const location = searchParams.get('location');
    const weatherType = searchParams.get('weatherType');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Read CSV file as fallback
    const filePath = join(process.cwd(), 'data', 'sample_data.csv');
    const csvData = readFileSync(filePath, 'utf-8');
    
    // Parse CSV
    const { data: records } = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Filter data
    let filtered = records as any[];
    
    if (season && season !== 'all') {
      filtered = filtered.filter(r => r.Season === season);
    }
    if (location && location !== 'all') {
      filtered = filtered.filter(r => r.Location === location);
    }
    if (weatherType && weatherType !== 'all') {
      filtered = filtered.filter(r => r.Weather_Type === weatherType);
    }

    // Apply pagination
    const paginatedData = filtered.slice(offset, offset + limit);

    // Normalize the data to match WeatherRecord interface
    const normalizedData = paginatedData.map((record: any, idx: number) => ({
      id: offset + idx + 1,
      temperature: record.Temperature,
      humidity: record.Humidity,
      wind_speed: record.Wind_Speed,
      precipitation_percent: parseFloat(record['Precipitation(%)']),
      cloud_cover: record.Cloud_Cover,
      atmospheric_pressure: record.Atmospheric_Pressure,
      uv_index: record.UV_Index,
      season: record.Season,
      visibility_km: parseFloat(record['Visibility(km)']),
      location: record.Location,
      weather_type: record.Weather_Type,
    }));

    return NextResponse.json({
      data: normalizedData,
      count: filtered.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Error reading CSV:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: String(error) },
      { status: 500 }
    );
  }
}
