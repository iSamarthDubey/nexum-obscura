import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { API_URL } from '../utils/api';

const TrafficFlowChart = ({ timeRange = '24h', onTimeRangeChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('line');

  useEffect(() => {
    fetchTrafficData();
  }, [timeRange]);

  const fetchTrafficData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/traffic-flow?timeRange=${timeRange}&granularity=hour`);
      if (!response.ok) throw new Error('Failed to fetch traffic flow data');
      
      const result = await response.json();
      
      if (result.hasData) {
        // Format data for charts
        const formattedData = result.data.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullTime: item.timestamp,
          'Total Calls': item.callVolume,
          'Incoming': item.incomingCalls,
          'Outgoing': item.outgoingCalls,
          'Suspicious': item.suspiciousActivity,
          'Avg Duration': Math.round(item.averageDuration / 60), // Convert to minutes
          'Unique Numbers': item.uniqueNumbers
        }));
        
        setData(formattedData);
        setStats(result.statistics);
      } else {
        setData([]);
        setStats(null);
      }
    } catch (err) {
      console.error('Error fetching traffic flow data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Traffic Data</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Traffic Flow Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">Real-time communication patterns and volume trends</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* View Type Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setViewType('area')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'area' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Area Chart
            </button>
          </div>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            onClick={fetchTrafficData}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Calls</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCalls.toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Peak Volume</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{stats.peakVolume}</div>
            <div className="text-xs text-blue-600 mt-1">
              at {new Date(stats.peakHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Avg/Hour</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{stats.averageCallsPerHour}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wide">Suspicious</div>
            <div className="text-2xl font-bold text-red-900 mt-1">{stats.totalSuspicious}</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-96">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Total Calls" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Incoming" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Outgoing" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Suspicious" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Total Calls"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="Suspicious"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">No Traffic Data</h3>
              <p className="text-sm text-gray-500 mt-1">Upload IPDR files to analyze traffic patterns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficFlowChart;
