// DemoDashboard.jsx
// This file was renamed from VisualizationEnhanced.jsx for clarity

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChartData } from '../utils/sampleData';
import ProtocolDistribution from '../components/ProtocolDistribution';
import GeographicMapEnhanced from '../components/GeographicMapEnhanced';
import NetworkGraph from '../components/NetworkGraph';
import ActivityChart from '../components/ActivityChart';
import AnomalyChart from '../components/AnomalyChart';
import LogTable from '../components/LogTable';
import {
  ChartBarIcon,
  GlobeAsiaAustraliaIcon,
  ShareIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';


const DemoDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataStats, setDataStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDataStats();
  }, []);

  const loadDataStats = () => {
    setRefreshing(true);
    setTimeout(() => {
      const stats = getChartData('stats');
      const logs = getChartData('logs');
      const anomalies = getChartData('anomalies');
      const geoData = getChartData('geographic');
      const protocols = getChartData('protocols');
      setDataStats({
        totalLogs: logs.length,
        timeRange: '7 days',
        locationsCount: geoData.length,
        protocolsCount: protocols.length,
        anomaliesCount: anomalies.length,
        suspiciousPercentage: ((logs.filter(l => l.suspicious).length / logs.length) * 100).toFixed(1),
        dataVolume: stats.dataProcessed,
        lastUpdated: new Date().toLocaleString()
      });
      setRefreshing(false);
    }, 1000);
  };

  const tabs = [
    { id: 'overview', name: 'Data Overview', icon: ChartBarIcon },
    { id: 'protocols', name: 'Protocol Analysis', icon: ShareIcon },
    { id: 'geographic', name: 'Geographic Distribution', icon: GlobeAsiaAustraliaIcon },
    { id: 'network', name: 'Network Topology', icon: ShareIcon },
    { id: 'timeline', name: 'Activity Timeline', icon: ClockIcon },
    { id: 'anomalies', name: 'Anomaly Detection', icon: ExclamationTriangleIcon },
    { id: 'logs', name: 'Raw Data Logs', icon: DocumentTextIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demo Dashboard : 500+ Sample Dataset</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive analysis of {dataStats?.totalLogs || '500+'} IPDR entries from {dataStats?.timeRange || '7 days'}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Home
              </Link>
              <button
                onClick={loadDataStats}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
          {/* Data Summary Cards */}
          {dataStats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-blue-600">{dataStats.totalLogs}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-green-600">{dataStats.locationsCount}</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-purple-600">{dataStats.protocolsCount}</div>
                <div className="text-sm text-gray-600">Protocols</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-orange-600">{dataStats.anomaliesCount}</div>
                <div className="text-sm text-gray-600">Anomaly Types</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-red-600">{dataStats.suspiciousPercentage}%</div>
                <div className="text-sm text-gray-600">Suspicious</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-gray-900">{dataStats.dataVolume}</div>
                <div className="text-sm text-gray-600">Data Volume</div>
              </div>
            </div>
          )}
        </div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Activity Over Time</h3>
                <ActivityChart />
              </div>
              <div className="bg-white rounded-lg shadow border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Distribution</h3>
                <ProtocolDistribution protocolData={getChartData('protocols')} />
              </div>
              <div className="bg-white rounded-lg shadow border p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Data Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Geographic Coverage</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Data spans across 20+ Indian cities including Mumbai, Delhi, Bangalore, and Chennai
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Threat Detection</h4>
                    <p className="text-sm text-green-700 mt-1">
                      15% of traffic shows suspicious patterns including DDoS, malware, and data exfiltration
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Real-time Analysis</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Comprehensive anomaly detection across traffic volume, port scanning, and geographic patterns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'protocols' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Analysis Dashboard</h3>
              <ProtocolDistribution protocolData={getChartData('protocols')} />
            </div>
          )}
          {activeTab === 'geographic' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution Analysis</h3>
              <GeographicMapEnhanced />
            </div>
          )}
          {activeTab === 'network' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Topology Visualization</h3>
              <div className="h-96">
                <NetworkGraph data={getChartData('network')} />
              </div>
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline Analysis</h3>
              <ActivityChart />
            </div>
          )}
          {activeTab === 'anomalies' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Detection Dashboard</h3>
              <AnomalyChart />
            </div>
          )}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw IPDR Data Logs</h3>
              <div className="text-sm text-gray-600 mb-4">
                Showing latest entries from the comprehensive 500+ record dataset
              </div>
              <LogTable logs={getChartData('logs').slice(0, 50)} />
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo dataset contains {dataStats?.totalLogs || '500+'} synthetic IPDR records • Last updated: {dataStats?.lastUpdated || 'Loading...'}</p>
          <p className="mt-1">Data includes realistic cybersecurity patterns for demonstration purposes</p>
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;