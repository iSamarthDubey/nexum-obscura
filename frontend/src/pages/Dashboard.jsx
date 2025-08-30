import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import ActivityChart from '../components/ActivityChart';
import SuspiciousActivities from '../components/SuspiciousActivities';
import TopSourceIPs from '../components/TopSourceIPs';
import LogsTable from '../components/LogsTable';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [apiConnected, setApiConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
      setLastUpdate(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  // Real-time clock update every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data from backend API...');
      
      // Fetch real data from backend API
      const response = await fetch('http://localhost:5000/api/dashboard');
      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Dashboard data loaded from API:', data);
      setDashboardData(data);
      setApiConnected(true);
    } catch (error) {
      console.error('❌ Failed to load dashboard data from API:', error);
      setApiConnected(false);
      // Set empty/zero data instead of mock data
      const emptyData = {
        overview: {
          totalRecords: 0,
          activeConnections: 0,
          flaggedNumbers: 0,
          investigationCases: 0,
          suspiciousPatterns: 0,
          networkNodes: 0,
          dataProcessed: "0",
          riskScore: 0
        },
        recentActivity: [
          { time: '--:--', event: 'No data available - Backend API not responding', level: 'info', source: 'System' },
          { time: '--:--', event: 'Please check backend connection and upload IPDR files', level: 'info', source: 'System' }
        ],
        activeInvestigations: [],
        networkStats: {
          totalCells: 0,
          activeCells: 0,
          roamingActive: 0,
          internationalCalls: 0
        }
      };
      setDashboardData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-cyber"></div>
        <span className="loading-text">Loading Investigation Dashboard...</span>
      </div>
    );
  }

  const { overview, recentActivity, activeInvestigations, networkStats } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Investigation Dashboard</h1>
        <p className="page-subtitle">
          Real-time IPDR analysis and threat monitoring • Live: {currentTime.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })}
          {dashboardData?.source && (
            <span className="ml-2 text-xs text-cyber-blue">• Data from: {dashboardData.source}</span>
          )}
          <span className={`ml-2 text-xs ${apiConnected ? 'text-cyber-green' : 'text-cyber-red'}`}>
            • Backend: {apiConnected ? 'Connected' : 'Disconnected'}
          </span>
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-cyber-text">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-cyber"
          >
            <option value="1">Last 1 Hour</option>
            <option value="6">Last 6 Hours</option>
            <option value="24">Last 24 Hours</option>
            <option value="168">Last 7 Days</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full status-online ${apiConnected ? 'bg-gray-400' : 'bg-red-500'}`}></div>
          <span className="text-xs text-cyber-text-muted">
            {apiConnected ? 'API Connected' : 'Using Mock Data'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="status-online w-2 h-2 rounded-full bg-cyber-green"></div>
          <span className="text-sm text-cyber-green">Live Monitoring Active</span>
        </div>
      </div>

      {/* Critical Metrics Grid */}
      <div className="grid-4">
        <div className="card-cyber p-6 cyber-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyber-text-muted text-sm">Total IPDR Records</p>
              <p className="text-2xl font-cyber text-cyber-blue">
                {overview?.totalRecords?.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-2 text-xs text-cyber-text-muted">
            {overview?.dataProcessed} GB processed
          </div>
        </div>

        <div className="card-cyber p-6 cyber-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyber-text-muted text-sm">Active Connections</p>
              <p className="text-2xl font-cyber text-cyber-green">
                {overview?.activeConnections?.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🌐</div>
          </div>
          <div className="mt-2 text-xs text-cyber-text-muted">
            Real-time monitoring
          </div>
        </div>

        <div className="card-cyber p-6 cyber-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyber-text-muted text-sm">Flagged Numbers</p>
              <p className="text-2xl font-cyber text-cyber-red">
                {overview?.flaggedNumbers}
              </p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
          <div className="mt-2 text-xs text-cyber-text-muted">
            Requiring investigation
          </div>
        </div>

        <div className="card-cyber p-6 cyber-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyber-text-muted text-sm">Risk Score</p>
              <p className="text-2xl font-cyber text-yellow-400">
                {overview?.riskScore}/100
              </p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
          <div className="progress-cyber mt-2">
            <div 
              className="progress-cyber-fill" 
              style={{ width: `${overview?.riskScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="card-cyber p-6">
          <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Recent Threat Activity
          </h3>
          <div className="space-y-3">
            {recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded border border-cyber-border hover:border-cyber-blue/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.level === 'high' ? 'bg-cyber-red animate-pulse-cyber' :
                  activity.level === 'medium' ? 'bg-yellow-500' : 'bg-cyber-blue'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-cyber-text">{activity.event}</p>
                  <p className="text-xs text-cyber-text-muted">{activity.source}</p>
                </div>
                <div className="text-xs text-cyber-text-muted">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Investigations */}
        <div className="card-cyber p-6">
          <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
            <span className="mr-2">🕵️</span>
            Active Investigations
          </h3>
          <div className="space-y-3">
            {activeInvestigations && activeInvestigations.length > 0 ? (
              activeInvestigations.map((investigation, index) => (
                <div key={index} className="p-3 rounded border border-cyber-border hover:border-cyber-blue/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-cyber text-cyber-blue text-sm">{investigation.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      investigation.priority === 'Critical' ? 'bg-red-900/30 text-red-300' :
                      investigation.priority === 'High' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-blue-900/30 text-blue-300'
                    }`}>
                      {investigation.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyber-text">{investigation.suspect}</p>
                      <p className="text-xs text-cyber-text-muted">{investigation.status}</p>
                    </div>
                    <div className="text-xs text-cyber-text-muted">{investigation.lastActivity}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-cyber-text-muted">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm">No active investigations</p>
                <p className="text-xs mt-1">Upload IPDR files to start investigation</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network Status Grid */}
      <div className="grid-4">
        <div className="card-cyber p-4 cyber-glow">
          <h4 className="text-sm font-medium text-cyber-text-muted mb-2">Total Cell Towers</h4>
          <p className="text-xl font-cyber text-cyber-text">{networkStats?.totalCells?.toLocaleString()}</p>
        </div>
        <div className="card-cyber p-4 cyber-glow">
          <h4 className="text-sm font-medium text-cyber-text-muted mb-2">Active Cells</h4>
          <p className="text-xl font-cyber text-cyber-green">{networkStats?.activeCells?.toLocaleString()}</p>
        </div>
        <div className="card-cyber p-4 cyber-glow">
          <h4 className="text-sm font-medium text-cyber-text-muted mb-2">Roaming Active</h4>
          <p className="text-xl font-cyber text-cyan-400">{networkStats?.roamingActive?.toLocaleString()}</p>
        </div>
        <div className="card-cyber p-4 cyber-glow">
          <h4 className="text-sm font-medium text-cyber-text-muted mb-2">International</h4>
          <p className="text-xl font-cyber text-yellow-400">{networkStats?.internationalCalls}</p>
        </div>
      </div>

      {/* IPDR Logs Table */}
      <LogsTable 
        logEntries={dashboardData?.logEntries || []}
        totalEntries={dashboardData?.totalLogEntries || 0}
      />

      {/* Quick Action Panel */}
      <div className="card-cyber p-6">
        <h3 className="text-lg font-cyber text-cyber-blue mb-4">Quick Actions</h3>
        <div className="grid-3">
          <Link
            to="/upload"
            className="p-4 border border-cyber-border rounded-lg hover:border-cyber-blue hover:shadow-cyber transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📤</div>
            <h4 className="font-medium text-cyber-text mb-1">Upload IPDR</h4>
            <p className="text-sm text-cyber-text-muted">Import new log files for analysis</p>
          </Link>
          
          <Link
            to="/analysis"
            className="p-4 border border-cyber-border rounded-lg hover:border-cyber-green hover:shadow-cyber-green transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
            <h4 className="font-medium text-cyber-text mb-1">Deep Analysis</h4>
            <p className="text-sm text-cyber-text-muted">Run pattern detection algorithms</p>
          </Link>
          
          <Link
            to="/visualization"
            className="p-4 border border-cyber-border rounded-lg hover:border-cyan-500 hover:shadow-cyber transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌐</div>
            <h4 className="font-medium text-cyber-text mb-1">Network Map</h4>
            <p className="text-sm text-cyber-text-muted">Visualize connection patterns</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
