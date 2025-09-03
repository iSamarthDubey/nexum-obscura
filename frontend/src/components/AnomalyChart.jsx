import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnomalyChart = ({ data, type = 'timeline' }) => {
  // Only show chart if real data is present
  const hasData = Array.isArray(data) && data.length > 0;

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
    if (!hasData) {
      return (
        <div className="h-64 flex items-center justify-center text-cyber-text-muted text-lg">
          No anomaly timeline data available. Upload logs to view anomaly trends.
        </div>
      );
    }
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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

  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-cyber-text-muted text-lg">
        No anomaly type data available. Upload logs to view anomaly types.
      </div>
    );
  }
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
