import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    hour: `${item._id.hour}:00`,
    total: item.total,
    suspicious: item.suspicious || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#3B82F6" 
          strokeWidth={2}
          name="Total Activity"
        />
        <Line 
          type="monotone" 
          dataKey="suspicious" 
          stroke="#EF4444" 
          strokeWidth={2}
          name="Suspicious Activity"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
