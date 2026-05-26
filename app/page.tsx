'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import KPICards from '@/components/kpi-cards';
import ChartsSection, { ChartsSectionRef } from '@/components/charts-section';
import FilterBar from '@/components/filter-bar';
import LiveWeather from '@/components/live-weather';
import AIInsightsPanel from '@/components/ai-insights-panel';
import AIChatPanel from '@/components/ai-chat-panel';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WeatherRecord } from '@/lib/weather-data';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [season, setSeason] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [weatherType, setWeatherType] = useState<string>('all');
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  // Data and filter states
  const [filteredData, setFilteredData] = useState<WeatherRecord[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [weatherTypes, setWeatherTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Chart refs for PNG export
  const chartsSectionRef = useRef<ChartsSectionRef>(null);

  // Seasonal background mapping
  const getSeasonalBackgroundClass = (seasonFilter: string) => {
    const lowerSeason = seasonFilter.toLowerCase();
    if (lowerSeason.includes('spring')) {
      return 'season-spring';
    } else if (lowerSeason.includes('summer')) {
      return 'season-summer';
    } else if (lowerSeason.includes('autumn') || lowerSeason.includes('fall')) {
      return 'season-autumn';
    } else if (lowerSeason.includes('winter')) {
      return 'season-winter';
    }
    return 'season-default';
  };

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        console.log('[v0] Fetching filter options from Supabase...');
        const res = await fetch('/api/weather/filters');
        if (!res.ok) throw new Error('Failed to fetch filters');
        const data = await res.json();
        console.log('[v0] Filter options received:', data);
        setSeasons(data.seasons || []);
        setLocations(data.locations || []);
        setWeatherTypes(data.weatherTypes || []);
        setTotalRecords(data.totalRecords || 0);
      } catch (err) {
        console.error('[v0] Error fetching filters:', err);
        setError('Failed to load filter options');
      }
    };

    fetchFilters();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('[v0] Fetching weather data with filters:', { season, location, weatherType });
        const params = new URLSearchParams();
        if (season !== 'all') params.append('season', season);
        if (location !== 'all') params.append('location', location);
        if (weatherType !== 'all') params.append('weatherType', weatherType);
        params.append('limit', '1000');

        const res = await fetch(`/api/weather?${params}`);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        console.log('[v0] Weather data received. Records:', data.count);
        setFilteredData(data.data || []);
        setError(null);
      } catch (err) {
        console.error('[v0] Error fetching data:', err);
        setError('Failed to load weather data');
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [season, location, weatherType]);

  // Determine background image based on selection
  useEffect(() => {
    let bgImage = '/weather-bg.jpg'; // default

    if (season !== 'all') {
      const seasonMap: { [key: string]: string } = {
        'Winter': '/bg-winter.jpg',
        'Spring': '/bg-spring.jpg',
        'Summer': '/bg-summer.jpg',
        'Autumn': '/bg-autumn.jpg',
      };
      bgImage = seasonMap[season] || bgImage;
    } else if (weatherType !== 'all') {
      const weatherMap: { [key: string]: string } = {
        'Rainy': '/bg-rainy.jpg',
        'Sunny': '/bg-sunny.jpg',
        'Cloudy': '/bg-cloudy.jpg',
        'Snowy': '/bg-snow.jpg',
      };
      bgImage = weatherMap[weatherType] || bgImage;
    }

    setBackgroundImage(bgImage);
  }, [season, weatherType]);

  // Create chart refs object for export - always provide refs even if not yet available
  const chartRefs = {
    temperature: chartsSectionRef.current?.temperatureRef,
    weatherType: chartsSectionRef.current?.weatherTypeRef,
    humidityWind: chartsSectionRef.current?.humidityWindRef,
    precipitation: chartsSectionRef.current?.precipitationRef,
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${getSeasonalBackgroundClass(season)}`}>
      {/* Header Section - Distinct from Body */}
      <div className="header-section relative border-b-2 border-white/20 dark:border-slate-700/30">
        <DashboardHeader />
      </div>

      {/* Body Section - Main Content */}
      <main className="body-section">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="space-y-8">
            {/* Filter Bar */}
            <FilterBar
              season={season}
              location={location}
              weatherType={weatherType}
              onSeasonChange={setSeason}
              onLocationChange={setLocation}
              onWeatherTypeChange={setWeatherType}
              seasons={seasons}
              locations={locations}
              weatherTypes={weatherTypes}
              chartRefs={chartRefs}
              filteredData={filteredData}
            />

            {/* Live Weather Section */}
            <LiveWeather />

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg">
                Error: {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : filteredData.length > 0 ? (
              <>
                <KPICards data={filteredData} />
                <ChartsSection ref={chartsSectionRef} data={filteredData} />

                {/* AI Features Section */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
                    AI-Powered Analysis
                  </h2>
                  
                  <Tabs defaultValue="insights" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur">
                      <TabsTrigger value="insights" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Insights
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ask Questions
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="insights" className="mt-6">
                      <AIInsightsPanel
                        data={filteredData}
                        filters={{ season, location, weatherType }}
                      />
                    </TabsContent>
                    
                    <TabsContent value="chat" className="mt-6">
                      <AIChatPanel data={filteredData} />
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur p-12 rounded-lg text-center">
                <p className="text-slate-600 dark:text-slate-300">No data available for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
