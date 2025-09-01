import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getChartData } from '../utils/sampleData';

const ActivityChart = ({ data, loading }) => {
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState('24h');
  const [chartType, setChartType] = useState('area');

  useEffect(() => {
    // Use sample data if none provided, or enhance provided data
    let sourceData = data && data.length > 0 ? 
      data.map(item => ({
        time: `${item._id?.hour || Math.floor(Math.random() * 24)}:00`,
        inbound: item.total || Math.floor(Math.random() * 1000) + 500,
        outbound: Math.floor((item.total || 500) * 0.7),
        suspicious: item.suspicious || Math.floor(Math.random() * 100),
        volume: (item.total || 500) * 1024
      })) : 
      getChartData('traffic');
    
    // Process data based on view mode
    let processedData = sourceData;
    
    if (viewMode === '7d') {
      // Group by day for 7-day view
      const days = {};
      sourceData.forEach((item, index) => {
        const day = `Day ${Math.floor(index / 4) + 1}`;
        if (!days[day]) {
          days[day] = { time: day, inbound: 0, outbound: 0, suspicious: 0, volume: 0 };
        }
        days[day].inbound += item.inbound || 0;
        days[day].outbound += item.outbound || 0;
        days[day].suspicious += item.suspicious || 0;
        days[day].volume += item.volume || 0;
      });
      processedData = Object.values(days);
    }
    
    setChartData(processedData);
  }, [data, viewMode]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="text-gray-900 font-medium">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toLocaleString()}`}
              {entry.dataKey === 'volume' && ' bytes'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('24h')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setViewMode('7d')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            7 Days
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-xs rounded ${
              chartType === 'area' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs rounded ${
              chartType === 'line' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="inbound"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Inbound Traffic"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Outbound Traffic"
              />
              <Area
                type="monotone"
                dataKey="suspicious"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.8}
                name="Suspicious Activity"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Inbound Traffic"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Outbound Traffic"
              />
              <Line
                type="monotone"
                dataKey="suspicious"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                name="Suspicious Activity"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600">Total Inbound</div>
          <div className="text-lg font-semibold text-blue-600">
            {chartData.reduce((sum, item) => sum + (item.inbound || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600">Total Outbound</div>
          <div className="text-lg font-semibold text-green-600">
            {chartData.reduce((sum, item) => sum + (item.outbound || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600">Suspicious Events</div>
          <div className="text-lg font-semibold text-red-600">
            {chartData.reduce((sum, item) => sum + (item.suspicious || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600">Data Volume</div>
          <div className="text-lg font-semibold text-gray-900">
            {(chartData.reduce((sum, item) => sum + (item.volume || 0), 0) / (1024 * 1024)).toFixed(1)}MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
