import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, filters, conversationHistory } = body;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided for analysis' },
        { status: 400 }
      );
    }

    // Rate limiting delay to prevent hitting API quota limits and server errors (430-503)
    // 5 seconds delay ensures stable response generation and prevents timeout errors
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Build a comprehensive data summary for the AI
    const dataSummary = buildDataSummary(data);

    // Chain-of-thought system prompt for richer insights
    const systemPrompt = `You are an expert weather data analyst providing actionable insights.

ANALYSIS FRAMEWORK (use chain-of-thought reasoning):

Step 1: DATA UNDERSTANDING
- Identify the data scope (locations, seasons, weather types)
- Note the sample size and patterns

Step 2: PATTERN DETECTION
- Look for correlations (temperature-humidity, precipitation-cloud cover)
- Identify seasonal variations
- Spot location-based differences

Step 3: ANOMALY IDENTIFICATION
- Find outliers or unusual readings
- Note any concerning patterns

Step 4: ACTIONABLE INSIGHTS
- Provide specific, actionable recommendations
- Consider practical applications

FORMAT YOUR RESPONSE:
- Use clear sections with headers
- Keep insights specific and data-driven
- Include specific numbers and percentages
- End with 2-3 actionable recommendations

Current filters applied: Season=${filters.season}, Location=${filters.location}, Weather Type=${filters.weatherType}`;

    // Build messages array with conversation history for multi-turn context
    const conversationMessages = [
      ...(conversationHistory || []),
      {
        role: 'user',
        parts: [
          {
            text: `Analyze this weather dataset and provide insightful observations using chain-of-thought reasoning:

${dataSummary}

Provide comprehensive, actionable insights. Consider patterns, anomalies, and practical recommendations.`,
          },
        ],
      },
    ];

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContentStream({
      contents: conversationMessages as any,
    });

    // Convert to streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            if (chunk.text()) {
              const text = chunk.text();
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[AI Insights Error]:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function buildDataSummary(data: any[]): string {
  if (!data || data.length === 0) {
    return 'No data available for analysis.';
  }

  // Calculate comprehensive statistics
  const temps = data.map(d => d.temperature || 0).filter(t => !isNaN(t));
  const humidities = data.map(d => d.humidity || 0).filter(h => !isNaN(h));
  const windSpeeds = data.map(d => d.wind_speed || 0).filter(w => !isNaN(w));
  const precipitations = data.map(d => d.precipitation_percent || 0).filter(p => !isNaN(p));
  const pressures = data.map(d => d.atmospheric_pressure || 0).filter(p => !isNaN(p));
  const uvIndexes = data.map(d => d.uv_index || 0).filter(u => !isNaN(u));
  const visibilities = data.map(d => d.visibility_km || 0).filter(v => !isNaN(v));

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const min = (arr: number[]) => (arr.length > 0 ? Math.min(...arr) : 0);
  const max = (arr: number[]) => (arr.length > 0 ? Math.max(...arr) : 0);

  // Count by categories
  const seasonCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const weatherTypeCounts: Record<string, number> = {};

  data.forEach(d => {
    if (d.season) seasonCounts[d.season] = (seasonCounts[d.season] || 0) + 1;
    if (d.location) locationCounts[d.location] = (locationCounts[d.location] || 0) + 1;
    if (d.weather_type) weatherTypeCounts[d.weather_type] = (weatherTypeCounts[d.weather_type] || 0) + 1;
  });

  // Season-specific averages
  const seasonStats = Object.keys(seasonCounts).map(season => {
    const seasonData = data.filter(d => d.season === season);
    const sTemps = seasonData.map(d => d.temperature || 0).filter(t => !isNaN(t));
    const sHumidities = seasonData.map(d => d.humidity || 0).filter(h => !isNaN(h));
    const sPrecips = seasonData.map(d => d.precipitation_percent || 0).filter(p => !isNaN(p));
    return {
      season,
      count: seasonData.length,
      avgTemp: avg(sTemps).toFixed(1),
      avgHumidity: avg(sHumidities).toFixed(1),
      avgPrecip: avg(sPrecips).toFixed(1),
    };
  });

  // Location-specific averages
  const locationStats = Object.keys(locationCounts).map(location => {
    const locData = data.filter(d => d.location === location);
    const lTemps = locData.map(d => d.temperature || 0).filter(t => !isNaN(t));
    const lWinds = locData.map(d => d.wind_speed || 0).filter(w => !isNaN(w));
    return {
      location,
      count: locData.length,
      avgTemp: avg(lTemps).toFixed(1),
      avgWind: avg(lWinds).toFixed(1),
    };
  });

  return `
📊 DATASET OVERVIEW
- Total Records: ${data.length}
- Seasons: ${Object.entries(seasonCounts).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Locations: ${Object.entries(locationCounts).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Weather Types: ${Object.entries(weatherTypeCounts).map(([k, v]) => `${k}: ${v}`).join(', ')}

🌡️ TEMPERATURE ANALYSIS
- Range: ${min(temps)}°C to ${max(temps)}°C
- Average: ${avg(temps).toFixed(1)}°C

💧 HUMIDITY STATISTICS
- Range: ${min(humidities)}% to ${max(humidities)}%
- Average: ${avg(humidities).toFixed(1)}%

💨 WIND SPEED
- Average: ${avg(windSpeeds).toFixed(1)} km/h (range: ${min(windSpeeds)} to ${max(windSpeeds)})

🌧️ PRECIPITATION
- Average: ${avg(precipitations).toFixed(1)}% (range: ${min(precipitations)}% to ${max(precipitations)}%)

🔬 ATMOSPHERIC PRESSURE
- Average: ${avg(pressures).toFixed(1)} hPa (range: ${min(pressures).toFixed(1)} to ${max(pressures).toFixed(1)})

☀️ UV INDEX
- Average: ${avg(uvIndexes).toFixed(1)} (range: ${min(uvIndexes)} to ${max(uvIndexes)})

👁️ VISIBILITY
- Average: ${avg(visibilities).toFixed(1)} km (range: ${min(visibilities)} to ${max(visibilities)} km)

📅 SEASONAL BREAKDOWN
${seasonStats.map(s => `- ${s.season}: ${s.count} records | Temp: ${s.avgTemp}°C | Humidity: ${s.avgHumidity}% | Precipitation: ${s.avgPrecip}%`).join('\n')}

📍 LOCATION BREAKDOWN
${locationStats.map(l => `- ${l.location}: ${l.count} records | Avg Temp: ${l.avgTemp}°C | Avg Wind: ${l.avgWind} km/h`).join('\n')}
`;
}

