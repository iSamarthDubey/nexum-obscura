import React, { useState, useEffect } from 'react';

const SystemHealthMonitor = () => {
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
  // TODO: Integrate with real system health metrics API
  setSystemMetrics(null);
  setLoading(false);
    } catch (error) {
      console.error('Error loading system metrics:', error);
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!systemMetrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <p>Unable to load system metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Resources */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              💻 System Health
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Monitoring</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                <span className="text-sm text-gray-600">{systemMetrics.cpu}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(systemMetrics.cpu)}`}
                  style={{ width: `${systemMetrics.cpu}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Memory</span>
                <span className="text-sm text-gray-600">{systemMetrics.memory}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(systemMetrics.memory)}`}
                  style={{ width: `${systemMetrics.memory}%` }}
                ></div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Disk Space</span>
                <span className="text-sm text-gray-600">{systemMetrics.disk}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(systemMetrics.disk)}`}
                  style={{ width: `${systemMetrics.disk}%` }}
                ></div>
              </div>
            </div>

            {/* Network Throughput */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Network</span>
                <span className="text-sm text-gray-600">{systemMetrics.network} Mbps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((systemMetrics.network / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* System Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}</div>
              <div className="text-xs text-gray-500">System Uptime</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{systemMetrics.activeConnections.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Active Connections</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.processedLogs.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Logs Processed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{systemMetrics.threatsBlocked}</div>
              <div className="text-xs text-gray-500">Threats Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            🔧 Service Status
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(systemMetrics.serviceStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getHealthIcon(status)}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getHealthColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
