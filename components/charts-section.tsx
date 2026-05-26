'use client';

import { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherRecord } from '@/lib/weather-data';
import TemperatureChart from './charts/temperature-chart';
import WeatherTypeChart from './charts/weather-type-chart';
import HumidityVsWindChart from './charts/humidity-vs-wind-chart';
import PrecipitationChart from './charts/precipitation-chart';

interface ChartsSectionProps {
  data: WeatherRecord[];
}

export interface ChartsSectionRef {
  temperatureRef: React.RefObject<HTMLDivElement | null>;
  weatherTypeRef: React.RefObject<HTMLDivElement | null>;
  humidityWindRef: React.RefObject<HTMLDivElement | null>;
  precipitationRef: React.RefObject<HTMLDivElement | null>;
}

const ChartsSection = forwardRef<ChartsSectionRef, ChartsSectionProps>(({ data }, ref) => {
  const temperatureRef = useRef<HTMLDivElement>(null);
  const weatherTypeRef = useRef<HTMLDivElement>(null);
  const humidityWindRef = useRef<HTMLDivElement>(null);
  const precipitationRef = useRef<HTMLDivElement>(null);

  // Expose refs to parent
  useImperativeHandle(ref, () => ({
    temperatureRef,
    weatherTypeRef,
    humidityWindRef,
    precipitationRef,
  }));

  // Calculate temperature distribution by season
  const temperatureBySeason = useMemo(() => {
    const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    return seasons.map((season) => {
      const seasonData = data.filter((d) => d.season === season);
      const avgTemp = seasonData.length > 0
        ? seasonData.reduce((sum, item) => sum + item.temperature, 0) / seasonData.length
        : 0;
      return {
        name: season,
        temperature: parseFloat(avgTemp.toFixed(1)),
      };
    });
  }, [data]);

  // Calculate weather type distribution
  const weatherTypeDistribution = useMemo(() => {
    const types = new Map<string, number>();
    data.forEach((item) => {
      types.set(item.weather_type, (types.get(item.weather_type) || 0) + 1);
    });
    return Array.from(types, ([name, value]) => ({ name, value }));
  }, [data]);

  // Calculate humidity vs wind correlation
  const humidityWindData = useMemo(() => {
    return data.slice(0, 20).map((item) => ({
      name: `Record ${item.id}`,
      humidity: item.humidity,
      wind_speed: item.wind_speed,
    }));
  }, [data]);

  // Calculate precipitation by location
  const precipitationByLocation = useMemo(() => {
    const locations = new Map<string, { total: number; count: number }>();
    data.forEach((item) => {
      const current = locations.get(item.location) || { total: 0, count: 0 };
      locations.set(item.location, {
        total: current.total + item.precipitation_percent,
        count: current.count + 1,
      });
    });
    return Array.from(locations, ([name, { total, count }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      precipitation: parseFloat((total / count).toFixed(1)),
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Temperature by Season - Line Chart */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/40 dark:border-slate-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Temperature by Season
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Average temperature across seasons</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={temperatureRef}>
              <TemperatureChart data={temperatureBySeason} />
            </div>
          </CardContent>
        </Card>

        {/* Weather Type Distribution - Pie Chart */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/40 dark:border-slate-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Weather Type Distribution
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Count of each weather type</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={weatherTypeRef}>
              <WeatherTypeChart data={weatherTypeDistribution} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Humidity vs Wind Speed - Bar Chart */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/40 dark:border-slate-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Humidity & Wind Speed
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Sample of records showing humidity and wind speed</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={humidityWindRef}>
              <HumidityVsWindChart data={humidityWindData} />
            </div>
          </CardContent>
        </Card>

        {/* Precipitation by Location - Bar Chart */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/40 dark:border-slate-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Precipitation by Location
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Average precipitation across locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={precipitationRef}>
              <PrecipitationChart data={precipitationByLocation} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ChartsSection.displayName = 'ChartsSection';

export default ChartsSection;
