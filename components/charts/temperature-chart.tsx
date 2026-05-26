'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TemperatureChartProps {
  data: Array<{
    name: string;
    temperature: number;
  }>;
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '2px solid #ff6b35',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#1a1f3a', fontWeight: 'bold' }}
          cursor={{ stroke: '#ff6b35', opacity: 0.2 }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ff6b35"
          strokeWidth={3}
          dot={{ fill: '#ff6b35', r: 6, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8, strokeWidth: 3 }}
          name="Temperature (°C)"
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
