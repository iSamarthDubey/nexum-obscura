import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  GlobeAltIcon, 
  ShareIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { getTopologyData, getDashboardData } from '../utils/api';
import NetworkGraph from '../components/NetworkGraph';
import GeographicMap from '../components/GeographicMap';
import TrafficFlow from '../components/TrafficFlow';
import ProtocolChart from '../components/ProtocolChart';

const Visualization = () => {
  const [activeView, setActiveView] = useState('network');
  const [topologyData, setTopologyData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    minConnections: 5,
    showOnlySuspicious: false
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [topology, dashboard] = await Promise.all([
        getTopologyData({ limit: 100 }),
        getDashboardData({ hours: 24 })
      ]);
      setTopologyData(topology);
      setDashboardData(dashboard);
    } catch (error) {
      console.error('Failed to load visualization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const views = [
    { id: 'network', name: 'Network Topology', icon: ShareIcon },
    { id: 'geographic', name: 'Geographic View', icon: GlobeAltIcon },
    { id: 'traffic', name: 'Traffic Flow', icon: ChartBarIcon },
    { id: 'protocols', name: 'Protocol Analysis', icon: AdjustmentsHorizontalIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Network Visualization</h1>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link to="/upload" className="text-gray-500 hover:text-gray-700">Upload</Link>
              <Link to="/analysis" className="text-gray-500 hover:text-gray-700">Analysis</Link>
              <Link to="/visualization" className="text-blue-600 hover:text-blue-800">Visualization</Link>
              <Link to="/reports" className="text-gray-500 hover:text-gray-700">Reports</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* View Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === view.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {view.name}
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="1h">Last 1 Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suspicious-only"
                  checked={filters.showOnlySuspicious}
                  onChange={(e) => setFilters({ ...filters, showOnlySuspicious: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="suspicious-only" className="ml-2 text-sm text-gray-700">
                  Show only suspicious
                </label>
              </div>

              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Content */}
        <div className="bg-white rounded-lg shadow">
          {activeView === 'network' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Network Topology</h3>
                <div className="text-sm text-gray-500">
                  {topologyData?.metadata && (
                    <>
                      {topologyData.metadata.totalNodes} nodes, {topologyData.metadata.totalConnections} connections
                    </>
                  )}
                </div>
              </div>
              <div className="h-96 border border-gray-200 rounded-lg">
                <NetworkGraph data={topologyData} loading={loading} />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Low Risk
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Medium Risk
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  High Risk
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Critical Risk
                </div>
              </div>
            </div>
          )}

          {activeView === 'geographic' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Geographic Distribution</h3>
              <div className="h-96 border border-gray-200 rounded-lg">
                <GeographicMap data={dashboardData} loading={loading} />
              </div>
            </div>
          )}

          {activeView === 'traffic' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Traffic Flow Analysis</h3>
              <div className="h-96">
                <TrafficFlow data={dashboardData?.timeline} loading={loading} />
              </div>
            </div>
          )}

          {activeView === 'protocols' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Protocol Distribution</h3>
              <div className="h-96">
                <ProtocolChart data={dashboardData?.protocolDistribution} loading={loading} />
              </div>
            </div>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Connections</h4>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {topologyData?.metadata?.totalConnections || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">Network connections</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Unique IPs</h4>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {topologyData?.metadata?.totalNodes || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">IP addresses</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Suspicious Rate</h4>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {dashboardData?.overview?.suspiciousPercentage || 0}%
            </p>
            <p className="mt-1 text-sm text-gray-600">Of total traffic</p>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Export Visualization</h4>
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Export as PNG
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Export as SVG
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
