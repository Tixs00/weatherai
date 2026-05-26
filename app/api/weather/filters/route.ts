import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function GET() {
  try {
    // Read CSV file
    const filePath = join(process.cwd(), 'data', 'sample_data.csv');
    const csvData = readFileSync(filePath, 'utf-8');
    
    // Parse CSV
    const { data: records } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Extract unique values
    const seasons = [...new Set((records as any[]).map(r => r.Season))].sort() as string[];
    const locations = [...new Set((records as any[]).map(r => r.Location))].sort() as string[];
    const weatherTypes = [...new Set((records as any[]).map(r => r.Weather_Type))].sort() as string[];
    const totalRecords = records.length;

    return NextResponse.json({
      seasons,
      locations,
      weatherTypes,
      totalRecords,
    });
  } catch (error) {
    console.error('[API] Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options', details: String(error) },
      { status: 500 }
    );
  }
}
