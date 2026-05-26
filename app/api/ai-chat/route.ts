import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  question: string;
  data: Array<Record<string, any>>;
  conversationHistory: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { question, data, conversationHistory } = body;

    if (!question || !data || data.length === 0) {
      return NextResponse.json(
        { error: 'Question and data are required' },
        { status: 400 }
      );
    }

    // Rate limiting delay to prevent hitting API quota limits and server errors (430-503)
    // 5 seconds delay ensures stable response generation and prevents timeout errors
    await new Promise(resolve => setTimeout(resolve, 5000));

    const dataSummary = buildDataSummary(data);

    const systemPrompt = `You are a friendly weather data expert who answers questions about weather datasets.

GUIDELINES:
- Be clear and conversational
- Use specific data from the dataset to answer
- Include numbers and percentages when relevant
- If data is not available, say "This information is not in the dataset"
- Keep responses concise and helpful

DATASET INFORMATION:
${dataSummary}`;

    const conversationMessages = [
      ...(conversationHistory || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: question }],
      },
    ];

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContentStream({
      contents: conversationMessages as any,
    });

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
    console.error('[AI Chat Error]:', error);
    return NextResponse.json(
      {
        error: 'Failed to process your question',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function buildDataSummary(data: any[]): string {
  if (!data || data.length === 0) {
    return 'No data available.';
  }

  const temps = data.map(d => d.temperature || 0).filter(t => !isNaN(t));
  const humidities = data.map(d => d.humidity || 0).filter(h => !isNaN(h));
  const windSpeeds = data.map(d => d.wind_speed || 0).filter(w => !isNaN(w));
  const precipitations = data.map(d => d.precipitation_percent || 0).filter(p => !isNaN(p));

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const min = (arr: number[]) => (arr.length > 0 ? Math.min(...arr) : 0);
  const max = (arr: number[]) => (arr.length > 0 ? Math.max(...arr) : 0);

  const seasonCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const weatherTypeCounts: Record<string, number> = {};

  data.forEach(d => {
    if (d.season) seasonCounts[d.season] = (seasonCounts[d.season] || 0) + 1;
    if (d.location) locationCounts[d.location] = (locationCounts[d.location] || 0) + 1;
    if (d.weather_type) weatherTypeCounts[d.weather_type] = (weatherTypeCounts[d.weather_type] || 0) + 1;
  });

  const seasonList = Object.entries(seasonCounts)
    .map(([k, v]) => `${k} (${v})`)
    .join(', ');
  const locationList = Object.entries(locationCounts)
    .map(([k, v]) => `${k} (${v})`)
    .join(', ');
  const weatherList = Object.entries(weatherTypeCounts)
    .map(([k, v]) => `${k} (${v})`)
    .join(', ');

  return `
DATASET SUMMARY:
- Total Records: ${data.length}
- Seasons: ${seasonList || 'Not available'}
- Locations: ${locationList || 'Not available'}
- Weather Types: ${weatherList || 'Not available'}

WEATHER STATISTICS:
- Temperature: ${min(temps).toFixed(1)}°C to ${max(temps).toFixed(1)}°C (avg: ${avg(temps).toFixed(1)}°C)
- Humidity: ${min(humidities).toFixed(1)}% to ${max(humidities).toFixed(1)}% (avg: ${avg(humidities).toFixed(1)}%)
- Wind Speed: ${min(windSpeeds).toFixed(1)} to ${max(windSpeeds).toFixed(1)} km/h (avg: ${avg(windSpeeds).toFixed(1)} km/h)
- Precipitation: ${min(precipitations).toFixed(1)}% to ${max(precipitations).toFixed(1)}% (avg: ${avg(precipitations).toFixed(1)}%)
`;
}
