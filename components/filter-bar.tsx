import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import DataExport from '@/components/data-export';
import { WeatherRecord } from '@/lib/weather-data';

interface FilterBarProps {
  season: string;
  location: string;
  weatherType: string;
  onSeasonChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onWeatherTypeChange: (value: string) => void;
  seasons: string[];
  locations: string[];
  weatherTypes: string[];
  chartRefs?: {
    temperature?: React.RefObject<HTMLDivElement | null>;
    weatherType?: React.RefObject<HTMLDivElement | null>;
    humidityWind?: React.RefObject<HTMLDivElement | null>;
    precipitation?: React.RefObject<HTMLDivElement | null>;
  };
  filteredData?: WeatherRecord[];
}

export default function FilterBar({
  season,
  location,
  weatherType,
  onSeasonChange,
  onLocationChange,
  onWeatherTypeChange,
  seasons,
  locations,
  weatherTypes,
  chartRefs,
  filteredData = [],
}: FilterBarProps) {
  const handleReset = () => {
    onSeasonChange('all');
    onLocationChange('all');
    onWeatherTypeChange('all');
  };

  return (
    <div className="mb-8 rounded-2xl border border-indigo-200/40 dark:border-indigo-700/40 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-cyan-600 rounded-full"></span>
          Filter Analytics
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Season</label>
          <Select value={season} onValueChange={onSeasonChange}>
            <SelectTrigger className="bg-white/90 dark:bg-slate-700/90 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <SelectValue placeholder="All Seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className="bg-white/90 dark:bg-slate-700/90 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Weather Type</label>
          <Select value={weatherType} onValueChange={onWeatherTypeChange}>
            <SelectTrigger className="bg-white/90 dark:bg-slate-700/90 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {weatherTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col justify-end gap-3">
          <div className="flex gap-2">
            <DataExport data={filteredData} chartRefs={chartRefs} isCompact={true} />
            <Button
              onClick={handleReset}
              className="flex-1 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
