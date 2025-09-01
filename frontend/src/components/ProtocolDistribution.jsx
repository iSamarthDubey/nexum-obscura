import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getChartData } from '../utils/sampleData';

const ProtocolDistribution = () => {
  const [protocolData, setProtocolData] = useState([]);
  const [callTypeData, setCallTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('pie');

  useEffect(() => {
    fetchProtocolData();
  }, []);

  const fetchProtocolData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always use sample data for demo dashboard
      const sampleProtocols = getChartData('protocols');
      setProtocolData(sampleProtocols);
      setCallTypeData([
        { name: 'Voice Call', count: 45, percentage: 56.3, description: 'Standard voice communications' },
        { name: 'SMS', count: 23, percentage: 28.7, description: 'Text messaging services' },
        { name: 'Data', count: 12, percentage: 15.0, description: 'Internet data usage' }
      ]);
      setStats({
        totalRecords: 80,
        totalProtocols: sampleProtocols.length,
        dominantProtocol: sampleProtocols[0]?.name || 'HTTP',
        dominantPercentage: sampleProtocols[0]?.percentage || 0,
        riskDistribution: {
          low: sampleProtocols.filter(p => p.riskLevel === 'low').reduce((sum, p) => sum + p.count, 0),
          medium: sampleProtocols.filter(p => p.riskLevel === 'medium').reduce((sum, p) => sum + p.count, 0),
          high: sampleProtocols.filter(p => p.riskLevel === 'high').reduce((sum, p) => sum + p.count, 0)
        },
        lastUpdated: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Error loading protocol data:', err);
      setError('Unable to load protocol data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600 mb-2">{data.description}</p>
          <p className="text-sm">
            <span className="font-medium">Count:</span> {data.count.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Percentage:</span> {data.percentage}%
          </p>
          <p className="text-sm">
            <span className="font-medium">Risk Level:</span> 
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              data.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
              data.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {data.riskLevel}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

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
            <h3 className="text-sm font-medium text-red-800">Error Loading Protocol Data</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Protocol Distribution Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">Communication protocols and risk assessment</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* View Type Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('pie')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'pie' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setViewType('bar')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bar Chart
            </button>
          </div>

          <button
            onClick={fetchProtocolData}
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
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Protocols</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProtocols}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Dominant Protocol</div>
            <div className="text-lg font-bold text-blue-900 mt-1">{stats.dominantProtocol}</div>
            <div className="text-xs text-blue-600 mt-1">{stats.dominantPercentage}% usage</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Low Risk</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{stats.riskDistribution?.low?.toLocaleString() || 0}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wide">High Risk</div>
            <div className="text-2xl font-bold text-red-900 mt-1">{stats.riskDistribution?.high?.toLocaleString() || 0}</div>
          </div>
        </div>
      )}

      {protocolData && protocolData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {/* Protocol Distribution Chart */}
          <div className="flex flex-col">
            <h4 className="text-md font-medium text-gray-900 mb-4">Protocol Distribution</h4>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={protocolData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {protocolData && protocolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={protocolData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call Type Distribution */}
          <div className="flex flex-col">
            <h4 className="text-md font-medium text-gray-900 mb-4">Action Type Distribution</h4>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {callTypeData && callTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No Protocol Data</h3>
            <p className="text-sm text-gray-500">Upload IPDR files to see protocol analysis</p>
          </div>
        </div>
      )}

      {/* Protocol Details Table */}
      {protocolData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Protocol Details</h4>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protocolData && protocolData.map((protocol, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: protocol.color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">{protocol.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {protocol.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {protocol.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        protocol.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        protocol.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {protocol.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {protocol.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolDistribution;
