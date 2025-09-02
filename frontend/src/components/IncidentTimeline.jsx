import React, { useState, useEffect } from 'react';

const IncidentTimeline = () => {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call for incident timeline
    setIncidents([]);
    setLoading(false);
  }, []);
  // const loadIncidentData = async () => {
  //   // This function can be used to fetch real incident data in the future
  // };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-red-600 bg-red-50';
      case 'investigating': return 'text-orange-600 bg-orange-50';
      case 'contained': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'intrusion attempt': return '🚨';
      case 'malware detection': return '🦠';
      case 'data exfiltration': return '📤';
      case 'phishing attempt': return '🎣';
      case 'vulnerability scan': return '🔍';
      default: return '⚠️';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ⏱️ Incident Timeline
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'investigating', 'contained', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 text-xs">
                  ({incidents.filter(i => i.status.toLowerCase() === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {filteredIncidents.map((incident, index) => (
              <li key={incident.id}>
                <div className="relative pb-8">
                  {index !== filteredIncidents.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full ${getSeverityColor(incident.severity)} flex items-center justify-center ring-8 ring-white`}>
                        <span className="text-white text-xs">
                          {getTypeIcon(incident.type)}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {incident.type}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {incident.description}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Source:</span> {incident.source}
                          </div>
                          <div>
                            <span className="font-medium">Target:</span> {incident.target}
                          </div>
                          <div>
                            <span className="font-medium">Assignee:</span> {incident.assignee}
                          </div>
                          <div>
                            <span className="font-medium">Severity:</span> {incident.severity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={incident.timestamp.toISOString()}>
                          {formatTimeAgo(incident.timestamp)}
                        </time>
                        <div className="text-xs text-gray-400">
                          {incident.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;
