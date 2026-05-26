import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherRecord } from '@/lib/weather-data';

interface KPICardsProps {
  data: WeatherRecord[];
}

export default function KPICards({ data }: KPICardsProps) {
  const totalRecords = data.length;
  
  const avgTemperature = data.length > 0
    ? (data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)
    : 0;

  const maxHumidity = data.length > 0
    ? Math.max(...data.map((item) => item.humidity))
    : 0;

  const avgPrecipitation = data.length > 0
    ? (data.reduce((sum, item) => sum + item.precipitation_percent, 0) / data.length).toFixed(1)
    : 0;

  const avgWindSpeed = data.length > 0
    ? (data.reduce((sum, item) => sum + item.wind_speed, 0) / data.length).toFixed(1)
    : 0;

  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Records</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500 bg-clip-text text-transparent">{totalRecords}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data points in dataset</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-800 border-orange-200 dark:border-orange-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Avg Temperature</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 opacity-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-500 bg-clip-text text-transparent">{avgTemperature}°C</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Average temperature</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-800 border-cyan-200 dark:border-cyan-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Max Humidity</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">{maxHumidity}%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Maximum humidity level</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Avg Precipitation</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 opacity-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent">{avgPrecipitation}%</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Average precipitation</p>
        </CardContent>
      </Card>
    </div>
  );
}
