'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { WeatherRecord } from '@/lib/weather-data';
import { Download, FileSpreadsheet, Image, ChevronDown, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ChartInfo {
  name: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  selector?: string; // Fallback selector if ref is not available
}

interface DataExportProps {
  data: WeatherRecord[];
  chartRefs?: {
    temperature?: React.RefObject<HTMLDivElement | null>;
    weatherType?: React.RefObject<HTMLDivElement | null>;
    humidityWind?: React.RefObject<HTMLDivElement | null>;
    precipitation?: React.RefObject<HTMLDivElement | null>;
  };
  isCompact?: boolean;
}

export default function DataExport({ data, chartRefs, isCompact = false }: DataExportProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [chartsFound, setChartsFound] = useState<Array<{ name: string; element: HTMLElement }>>([]);

  // Detect available charts when data changes
  useEffect(() => {
    // Small delay to allow DOM to fully render
    const timer = setTimeout(() => {
      const charts = getChartElements();
      setChartsFound(charts);
      console.log(`[v0] Charts detected: ${charts.length}`);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  const downloadCSV = () => {
    if (data.length === 0) {
      setExportStatus('No data to export');
      setTimeout(() => setExportStatus(null), 2000);
      return;
    }

    try {
      setExportStatus(`Exporting ${data.length} records...`);

      // Define CSV headers
      const headers = [
        'ID',
        'Temperature (°C)',
        'Humidity (%)',
        'Wind Speed (km/h)',
        'Precipitation (%)',
        'Cloud Cover',
        'Atmospheric Pressure (hPa)',
        'UV Index',
        'Visibility (km)',
        'Season',
        'Location',
        'Weather Type',
      ];

      // Helper function to escape CSV cells
      const escapeCSVCell = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, quotes, or newline
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      // Convert data to CSV rows
      const rows = data.map(record => [
        record.id,
        record.temperature,
        record.humidity,
        record.wind_speed,
        record.precipitation_percent,
        record.cloud_cover,
        record.atmospheric_pressure,
        record.uv_index,
        record.visibility_km,
        record.season,
        record.location,
        record.weather_type,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.map(escapeCSVCell).join(','),
        ...rows.map(row => row.map(escapeCSVCell).join(',')),
      ].join('\n');

      // Add BOM for UTF-8 (helps with Excel on Windows)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `weather_data_${timestamp}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

      setExportStatus('CSV downloaded!');
      setTimeout(() => setExportStatus(null), 2000);
    } catch (error) {
      console.error('[Export] Error exporting CSV:', error);
      setExportStatus('CSV export failed');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const downloadChartAsPNG = async (chartName: string) => {
    try {
      setExportStatus(`Exporting ${chartName}...`);
      
      // Use the current chartsFound state to get the correct chart
      const chart = chartsFound.find(c => c.name === chartName);
      
      if (!chart) {
        console.log(`[v0] Chart not found in chartsFound. Available:`, chartsFound.map(c => c.name));
        setExportStatus(`${chartName} not found`);
        setTimeout(() => setExportStatus(null), 2000);
        return;
      }
      
      console.log(`[v0] Exporting chart: ${chartName}`);
      
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the actual chart SVG/recharts container within the card
      const chartElement = chart.element.querySelector('[class*="recharts-surface"]') ||
                          chart.element.querySelector('svg') ||
                          chart.element.querySelector('[role="img"]');
      
      if (!chartElement) {
        console.error(`[v0] No chart SVG found in element for ${chartName}`);
        throw new Error(`Chart visualization not found for ${chartName}`);
      }
      
      // Ensure element has dimensions
      if (chartElement.offsetWidth === 0 || chartElement.offsetHeight === 0) {
        console.error(`[v0] Chart element has invalid dimensions:`, {
          width: chartElement.offsetWidth,
          height: chartElement.offsetHeight
        });
        throw new Error(`Chart element not properly rendered`);
      }
      
      console.log(`[v0] Chart dimensions:`, {
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight
      });
      
      // Create a canvas to export just the chart area with padding
      const dataUrl = await toPng(chartElement, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        quality: 1,
        cacheBust: true,
        padding: 20,
      });

      // Validate data URL before download
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        throw new Error('Invalid chart export data');
      }

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${chartName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.png`;
      
      link.download = filename;
      link.href = dataUrl;
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`[v0] Successfully exported: ${filename}`);

      setExportStatus(`${chartName} exported!`);
      setTimeout(() => setExportStatus(null), 2000);
    } catch (error) {
      console.error(`[Export] Error exporting ${chartName}:`, error);
      setExportStatus(`Failed to export ${chartName}`);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const downloadAllCharts = async () => {
    if (chartsFound.length === 0) {
      console.log('[v0] No charts available for export');
      setExportStatus('No charts available');
      setTimeout(() => setExportStatus(null), 2000);
      return;
    }

    console.log(`[v0] Starting batch export of ${chartsFound.length} charts`);
    setExportStatus(`Exporting ${chartsFound.length} chart${chartsFound.length > 1 ? 's' : ''}...`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < chartsFound.length; i++) {
      const { name, element } = chartsFound[i];
      try {
        console.log(`[v0] Exporting chart ${i + 1}/${chartsFound.length}: ${name}`);
        
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Find the actual chart SVG/recharts container
        const chartElement = element.querySelector('[class*="recharts-surface"]') ||
                            element.querySelector('svg') ||
                            element.querySelector('[role="img"]');
        
        if (!chartElement) {
          throw new Error(`Chart visualization not found for ${name}`);
        }
        
        if (chartElement.offsetWidth === 0 || chartElement.offsetHeight === 0) {
          throw new Error(`Chart not properly rendered for ${name}`);
        }
        
        const dataUrl = await toPng(chartElement, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          quality: 1,
          cacheBust: true,
          padding: 20,
        });

        if (!dataUrl || !dataUrl.startsWith('data:image')) {
          throw new Error('Invalid chart export data');
        }

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.png`;
        link.download = filename;
        link.href = dataUrl;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`[v0] Successfully exported: ${filename}`);
        successCount++;

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        failureCount++;
        console.error(`[Export] Error exporting ${name}:`, error);
      }
    }

    const message = failureCount > 0 
      ? `Exported ${successCount}/${chartsFound.length} charts`
      : 'All charts exported!';
    
    console.log(`[v0] Batch export complete: ${message}`);
    setExportStatus(message);
    setTimeout(() => setExportStatus(null), 2000);
  };

  // Get chart elements - prioritize refs, fallback to DOM selectors
  const getChartElements = () => {
    const charts: Array<{ name: string; element: HTMLElement }> = [];
    
    // Chart order and identifiers with more specific matching
    const chartConfigs = [
      { 
        name: 'Temperature Chart', 
        titles: ['Temperature by Season'],
        id: 'temperature-chart'
      },
      { 
        name: 'Weather Type Chart', 
        titles: ['Weather Type Distribution'],
        id: 'weather-type-chart'
      },
      { 
        name: 'Humidity Wind Chart', 
        titles: ['Humidity & Wind Speed', 'Humidity & Wind'],
        id: 'humidity-wind-chart'
      },
      { 
        name: 'Precipitation Chart', 
        titles: ['Precipitation by Location'],
        id: 'precipitation-chart'
      },
    ];
    
    // Strategy 1: Look for all text nodes that match our titles
    const allElements = document.querySelectorAll('*');
    const foundCharts = new Set<HTMLElement>();
    
    for (const config of chartConfigs) {
      let found = false;
      
      // Search through all elements for matching titles
      for (const element of Array.from(allElements)) {
        const text = element.textContent || '';
        
        // Check if this element contains one of our target titles
        if (config.titles.some(title => text.includes(title))) {
          // Find the closest card/section parent that contains an SVG
          let parent = element.closest('[class*="Card"]') || 
                      element.closest('section') ||
                      element.closest('[role="region"]');
          
          // If no proper parent found, walk up the tree
          if (!parent) {
            let current: Element | null = element;
            for (let i = 0; i < 10; i++) {
              current = current?.parentElement || null;
              if (!current) break;
              
              // Look for a div with bg or rounded classes (typical card styling)
              if (current.className && 
                  (current.className.includes('bg-') || 
                   current.className.includes('rounded') ||
                   current.className.includes('border'))) {
                parent = current;
                break;
              }
            }
          }
          
          // Verify the parent contains an SVG (the actual chart)
          if (parent && parent.querySelector('svg') && !foundCharts.has(parent as HTMLElement)) {
            charts.push({ 
              name: config.name, 
              element: parent as HTMLElement 
            });
            foundCharts.add(parent as HTMLElement);
            console.log(`[v0] Found chart: ${config.name}`);
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        console.log(`[v0] Chart not found: ${config.name}`);
      }
    }
    
    return charts;
  };
  
  const availableChartsCount = chartsFound.length;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`${
              isCompact 
                ? 'h-10 px-3' 
                : 'px-4'
            } bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative`}
            title={`Export ${data.length} records and ${availableChartsCount} chart${availableChartsCount !== 1 ? 's' : ''}`}
          >
            <Download className="w-4 h-4 mr-2" />
            {!isCompact && 'Export'}
            <ChevronDown className="w-4 h-4 ml-2" />
            {exportStatus && (
              <span className="ml-2 text-xs text-green-300 flex items-center">
                <Check className="w-3 h-3 mr-1" />
                {exportStatus}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2 border-b border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Current Dataset</p>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
              {data.length} records
            </span>
            {availableChartsCount > 0 && (
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                {availableChartsCount} chart{availableChartsCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
          <div>
            <div className="font-medium">Download CSV</div>
            <div className="text-xs text-slate-500">All {data.length} records</div>
          </div>
        </DropdownMenuItem>

        {availableChartsCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Chart Images</DropdownMenuLabel>

            {chartsFound.some(c => c.name === 'Temperature Chart') && (
              <DropdownMenuItem
                onClick={() => downloadChartAsPNG('Temperature Chart')}
                className="cursor-pointer"
              >
                <Image className="w-4 h-4 mr-2 text-orange-500" />
                Temperature Chart (PNG)
              </DropdownMenuItem>
            )}

            {chartsFound.some(c => c.name === 'Weather Type Chart') && (
              <DropdownMenuItem
                onClick={() => downloadChartAsPNG('Weather Type Chart')}
                className="cursor-pointer"
              >
                <Image className="w-4 h-4 mr-2 text-purple-500" />
                Weather Type Chart (PNG)
              </DropdownMenuItem>
            )}

            {chartsFound.some(c => c.name === 'Humidity Wind Chart') && (
              <DropdownMenuItem
                onClick={() => downloadChartAsPNG('Humidity Wind Chart')}
                className="cursor-pointer"
              >
                <Image className="w-4 h-4 mr-2 text-red-500" />
                Humidity & Wind Chart (PNG)
              </DropdownMenuItem>
            )}

            {chartsFound.some(c => c.name === 'Precipitation Chart') && (
              <DropdownMenuItem
                onClick={() => downloadChartAsPNG('Precipitation Chart')}
                className="cursor-pointer"
              >
                <Image className="w-4 h-4 mr-2 text-cyan-500" />
                Precipitation Chart (PNG)
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={downloadAllCharts} className="cursor-pointer">
              <Download className="w-4 h-4 mr-2 text-blue-500" />
              <div>
                <div className="font-medium">Download All Charts</div>
                <div className="text-xs text-slate-500">Export all as PNG</div>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
