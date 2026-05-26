'use client';

import { useState } from 'react';
import { useWeather } from '@/hooks/use-weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Cloud, Droplets, Wind, Eye, Gauge } from 'lucide-react';

export default function LiveWeather() {
  const [city, setCity] = useState('');
  const { data, loading, error, fetchWeather, clearWeather } = useWeather();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      await fetchWeather(city);
    }
  };

  const handleClearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCity(newValue);
    // Clear weather data when input is emptied
    if (!newValue.trim()) {
      clearWeather();
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/40 dark:border-slate-700/40 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Live Weather Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter city name (e.g., London, New York)"
              value={city}
              onChange={handleClearInput}
              className="flex-1 bg-white dark:bg-slate-700"
            />
            <Button
              type="submit"
              disabled={loading || !city.trim()}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
            >
              {loading ? <Spinner /> : 'Search'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Location and Temperature */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {data.location}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">
                  {data.temperature}°
                </span>
                <span className="text-slate-600 dark:text-slate-400 capitalize">
                  {data.weather_type} - {data.weather_description}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Feels like {data.feels_like}° | Min: {data.temp_min}° | Max: {data.temp_max}°
              </p>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Humidity */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Humidity
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.humidity}%
                </span>
              </div>

              {/* Wind Speed */}
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Wind Speed
                  </span>
                </div>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {data.wind_speed} m/s
                </span>
              </div>

              {/* Cloud Cover */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Cloud Cover
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {data.cloud_cover}%
                </span>
              </div>

              {/* Visibility */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Visibility
                  </span>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.visibility_km} km
                </span>
              </div>

              {/* Pressure */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pressure
                  </span>
                </div>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.pressure} hPa
                </span>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Enter a city name to get live weather data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
