import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnomalyChart = ({ data, type = 'timeline' }) => {
  // Generate mock data if no data provided
  const mockTimelineData = [
    { time: '00:00', anomalies: 2 },
    { time: '04:00', anomalies: 1 },
    { time: '08:00', anomalies: 5 },
    { time: '12:00', anomalies: 8 },
    { time: '16:00', anomalies: 12 },
    { time: '20:00', anomalies: 6 }
  ];

  const mockTypeData = [
    { type: 'Volume', count: 15, severity: 'High' },
    { type: 'Pattern', count: 8, severity: 'Medium' },
    { type: 'Duration', count: 23, severity: 'Critical' },
    { type: 'Location', count: 5, severity: 'Low' }
  ];

  const chartData = data || (type === 'timeline' ? mockTimelineData : mockTypeData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg border" style={{ 
          background: 'var(--cyber-surface)', 
          borderColor: 'var(--cyber-border)',
          color: 'var(--cyber-text)'
        }}>
          <p style={{ color: 'var(--cyber-blue)' }}>{`${label}`}</p>
          <p style={{ color: 'var(--cyber-text)' }}>
            {type === 'timeline' ? `Anomalies: ${payload[0].value}` : `Count: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (type === 'timeline') {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cyber-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--cyber-text-muted)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--cyber-text-muted)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="anomalies" 
              stroke="var(--cyber-red)" 
              strokeWidth={2}
              dot={{ fill: 'var(--cyber-red)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--cyber-red)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cyber-border)" />
          <XAxis 
            dataKey="type" 
            stroke="var(--cyber-text-muted)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--cyber-text-muted)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="var(--cyber-blue)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyChart;
