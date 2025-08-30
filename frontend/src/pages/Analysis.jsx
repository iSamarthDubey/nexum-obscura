import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    hasData: false,
    suspiciousConnections: [],
    patterns: [],
    anomalies: []
  });

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading analysis data from backend...');
      const response = await fetch('http://localhost:5000/api/analysis');
      if (!response.ok) {
        throw new Error(`Failed to load analysis data: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Analysis data loaded:', data);
      setAnalysisData(data);
    } catch (error) {
      console.error('❌ Error loading analysis data:', error);
      // Set empty data instead of mock data
      setAnalysisData({
        hasData: false,
        message: 'Failed to load analysis data. Please check backend connection.',
        suspiciousConnections: [],
        patterns: [],
        anomalies: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return '0s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    // Simulate search - in real implementation, this would call the backend with search parameters
    await new Promise(resolve => setTimeout(resolve, 1500));
    await loadAnalysisData(); // Reload analysis data
    setLoading(false);
  };

  const tabs = [
    { id: 'search', name: 'Search & Filter', icon: MagnifyingGlassIcon },
    { id: 'anomalies', name: 'Anomaly Detection', icon: ExclamationTriangleIcon },
    { id: 'patterns', name: 'Pattern Analysis', icon: ChartBarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">IPDR Analysis</h1>
        <p className="page-subtitle">
          Advanced pattern detection and anomaly analysis for investigative insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card-cyber p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyber-blue text-black font-medium'
                    : 'text-cyber-text-muted hover:text-cyber-text hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Filters */}
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Search IPDR Records
            </h3>
            
            <div className="grid-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter A-Party or B-Party number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-cyber w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">Date Range</label>
                <input
                  type="date"
                  className="input-cyber w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">Risk Level</label>
                <select className="select-cyber w-full">
                  <option>All Levels</option>
                  <option>Critical</option>
                  <option>High Risk</option>
                  <option>Medium Risk</option>
                  <option>Low Risk</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-cyber"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="spinner-cyber mr-2"></div>
                  Searching...
                </span>
              ) : (
                'Search Records'
              )}
            </button>
          </div>

          {/* Search Results */}
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4">Suspicious Connections</h3>
            <div className="overflow-x-auto">
              <table className="table-cyber">
                <thead>
                  <tr>
                    <th>A-Party</th>
                    <th>B-Party</th>
                    <th>Frequency</th>
                    <th>Total Duration</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.suspiciousConnections.map((connection) => (
                    <tr key={connection.id}>
                      <td className="font-mono-cyber">{connection.aParty}</td>
                      <td className="font-mono-cyber">{connection.bParty}</td>
                      <td>{connection.frequency}</td>
                      <td>{formatDuration(connection.totalDuration || connection.duration)}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (connection.avgRiskScore || connection.riskScore) >= 90 ? 'bg-red-900/30 text-red-300' :
                          (connection.avgRiskScore || connection.riskScore) >= 70 ? 'bg-yellow-900/30 text-yellow-300' :
                          'bg-green-900/30 text-green-300'
                        }`}>
                          {connection.avgRiskScore || connection.riskScore}%
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          connection.status === 'Critical' ? 'bg-red-900/30 text-red-300' :
                          connection.status === 'High Risk' ? 'bg-yellow-900/30 text-yellow-300' :
                          'bg-blue-900/30 text-blue-300'
                        }`}>
                          {connection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Detected Anomalies
            </h3>
            
            <div className="grid-2 gap-6">
              {analysisData.anomalies.map((anomaly, index) => (
                <div key={index} className="p-4 border border-cyber-border rounded-lg hover:border-cyber-blue/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-cyber-text">{anomaly.type} Anomaly</h4>
                    <span className="text-cyber-red font-cyber text-lg">{anomaly.count}</span>
                  </div>
                  <p className="text-sm text-cyber-text-muted">{anomaly.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4">Anomaly Timeline</h3>
            <div className="h-64 flex items-center justify-center border border-cyber-border rounded-lg">
              <p className="text-cyber-text-muted">Anomaly timeline chart will be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Communication Patterns
            </h3>
            
            <div className="space-y-4">
              {analysisData.patterns.map((pattern, index) => (
                <div key={index} className="p-4 border border-cyber-border rounded-lg hover:border-cyber-blue/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-cyber-text">{pattern.pattern}</h4>
                      <p className="text-sm text-cyber-text-muted">{pattern.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyber-blue font-cyber text-lg">{pattern.instances}</p>
                      <p className="text-xs text-cyber-text-muted">instances</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      pattern.severity === 'Critical' ? 'bg-red-900/30 text-red-300' :
                      pattern.severity === 'High' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-blue-900/30 text-blue-300'
                    }`}>
                      {pattern.severity} Severity
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4">Pattern Visualization</h3>
            <div className="h-64 flex items-center justify-center border border-cyber-border rounded-lg">
              <p className="text-cyber-text-muted">Pattern analysis charts will be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card-cyber p-6">
        <h3 className="text-lg font-cyber text-cyber-blue mb-4">Investigation Actions</h3>
        <div className="grid-3 gap-4">
          <button className="p-4 border border-cyber-border rounded-lg hover:border-cyber-blue hover:shadow-cyber transition-all text-left">
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-medium text-cyber-text mb-1">Deep Dive Analysis</h4>
            <p className="text-sm text-cyber-text-muted">Run comprehensive pattern analysis</p>
          </button>
          
          <button className="p-4 border border-cyber-border rounded-lg hover:border-cyber-green hover:shadow-cyber-green transition-all text-left">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-cyber-text mb-1">Generate Report</h4>
            <p className="text-sm text-cyber-text-muted">Create investigation summary</p>
          </button>
          
          <button className="p-4 border border-cyber-border rounded-lg hover:border-cyan-500 hover:shadow-cyber transition-all text-left">
            <div className="text-2xl mb-2">🌐</div>
            <h4 className="font-medium text-cyber-text mb-1">View Network</h4>
            <p className="text-sm text-cyber-text-muted">Open network visualization</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
