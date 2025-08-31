import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';
import { 
  ExclamationTriangleIcon, 
  ShieldExclamationIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    loadAlerts();
    // Auto-refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/alerts`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ShieldExclamationIcon className="w-5 h-5 text-red-400" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-950/30';
      case 'high':
        return 'border-orange-500 bg-orange-950/30';
      case 'medium':
        return 'border-yellow-500 bg-yellow-950/30';
      default:
        return 'border-blue-500 bg-blue-950/30';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (collapsed) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-cyber-card border border-cyber-border rounded-lg p-3 shadow-lg hover:border-cyber-blue/50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ShieldExclamationIcon className="w-5 h-5 text-cyber-blue" />
            <span className="text-sm text-cyber-text">
              {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-96 max-h-96 overflow-y-auto z-50">
      <div className="bg-cyber-card border border-cyber-border rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-cyber-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldExclamationIcon className="w-5 h-5 text-cyber-blue" />
              <h3 className="text-lg font-cyber text-cyber-text">Security Alerts</h3>
              {loading && (
                <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-cyber-text-muted hover:text-cyber-text transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-4 mt-2 text-xs">
            <span className="text-red-400">
              Critical: {alerts.filter(a => a.severity === 'critical').length}
            </span>
            <span className="text-orange-400">
              High: {alerts.filter(a => a.severity === 'high').length}
            </span>
            <span className="text-yellow-400">
              Medium: {alerts.filter(a => a.severity === 'medium').length}
            </span>
          </div>
        </div>

        {/* Alerts List */}
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-cyber-text-muted">
              <InformationCircleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={alert.id || index}
                  className={`p-3 rounded border ${getSeverityColor(alert.severity)} hover:border-opacity-70 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-cyber-text mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-cyber-text-muted mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-cyber-text-muted">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.severity === 'critical' ? 'bg-red-900/30 text-red-300' :
                            alert.severity === 'high' ? 'bg-orange-900/30 text-orange-300' :
                            alert.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                            'bg-blue-900/30 text-blue-300'
                          }`}>
                            {alert.type}
                          </span>
                        </div>
                        {alert.details && (
                          <div className="mt-2 text-xs text-cyber-text-muted">
                            <details className="cursor-pointer">
                              <summary className="hover:text-cyber-text">View Details</summary>
                              <div className="mt-1 pl-2 border-l border-cyber-border">
                                {alert.details.map((detail, idx) => (
                                  <div key={idx} className="py-1">
                                    {detail.aParty} ↔ {detail.bParty} 
                                    <span className="ml-2 text-red-400">
                                      Risk: {detail.riskScore}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-cyber-text-muted hover:text-cyber-text ml-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyber-border bg-cyber-card-accent">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyber-text-muted">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={loadAlerts}
              className="text-cyber-blue hover:text-cyber-blue-light transition-colors"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
