'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HumidityVsWindChartProps {
  data: Array<{
    name: string;
    humidity: number;
    wind_speed: number;
  }>;
}

export default function HumidityVsWindChart({ data }: HumidityVsWindChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '2px solid #06b6d4',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#1a1f3a', fontWeight: 'bold' }}
          cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar 
          dataKey="humidity" 
          fill="#06b6d4" 
          name="Humidity (%)" 
          radius={[8, 8, 0, 0]}
          animationDuration={800}
        />
        <Bar 
          dataKey="wind_speed" 
          fill="#8b5cf6" 
          name="Wind Speed (km/h)" 
          radius={[8, 8, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
