'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PrecipitationChartProps {
  data: Array<{
    name: string;
    precipitation: number;
  }>;
}

export default function PrecipitationChart({ data }: PrecipitationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '2px solid #3b82f6',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#1a1f3a', fontWeight: 'bold' }}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar
          dataKey="precipitation"
          fill="#3b82f6"
          name="Avg Precipitation (%)"
          radius={[8, 8, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
