import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  EyeIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { fetchDashboardData } from '../utils/api';
import StatsCard from '../components/StatsCard';
import ActivityChart from '../components/ActivityChart';
import SuspiciousActivities from '../components/SuspiciousActivities';
import TopSourceIPs from '../components/TopSourceIPs';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData({ hours: timeRange });
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { overview, protocolDistribution, topSuspiciousIPs, timeline } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Nexum Obscura</h1>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
              <Link to="/upload" className="text-gray-500 hover:text-gray-700">Upload</Link>
              <Link to="/analysis" className="text-gray-500 hover:text-gray-700">Analysis</Link>
              <Link to="/visualization" className="text-gray-500 hover:text-gray-700">Visualization</Link>
              <Link to="/reports" className="text-gray-500 hover:text-gray-700">Reports</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="mb-6">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="1">Last 1 Hour</option>
            <option value="6">Last 6 Hours</option>
            <option value="24">Last 24 Hours</option>
            <option value="168">Last 7 Days</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Logs"
            value={overview?.totalLogs?.toLocaleString() || '0'}
            icon={ServerIcon}
            color="blue"
          />
          <StatsCard
            title="Suspicious Activities"
            value={overview?.suspiciousLogs?.toLocaleString() || '0'}
            icon={ExclamationTriangleIcon}
            color="yellow"
            percentage={overview?.suspiciousPercentage}
          />
          <StatsCard
            title="Critical Threats"
            value={overview?.criticalLogs?.toLocaleString() || '0'}
            icon={ShieldCheckIcon}
            color="red"
          />
          <StatsCard
            title="Monitoring Status"
            value="Active"
            icon={EyeIcon}
            color="green"
            subtext="Real-time monitoring"
          />
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Timeline */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Activity Timeline
            </h3>
            <ActivityChart data={timeline} />
          </div>

          {/* Protocol Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Protocol Distribution
            </h3>
            <div className="space-y-3">
              {protocolDistribution?.map((protocol, index) => (
                <div key={protocol._id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{protocol._id}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(protocol.count / protocolDistribution[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{protocol.count.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Suspicious IPs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              Top Suspicious Source IPs
            </h3>
            <TopSourceIPs data={topSuspiciousIPs} />
          </div>

          {/* Recent Suspicious Activities */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Suspicious Activities
            </h3>
            <SuspiciousActivities />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/upload"
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">Upload New Logs</h4>
              <p className="text-sm text-gray-500 mt-1">Import CSV log files for analysis</p>
            </Link>
            <Link
              to="/analysis"
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">Run Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">Analyze patterns and detect anomalies</p>
            </Link>
            <Link
              to="/reports"
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">Generate Report</h4>
              <p className="text-sm text-gray-500 mt-1">Create security analysis reports</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
