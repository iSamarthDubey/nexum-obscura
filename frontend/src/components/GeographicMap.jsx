import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';
import { getChartData } from '../utils/sampleData';

const GeographicMapEnhanced = () => {
  const [geoData, setGeoData] = useState([]);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    fetchGeographicData();
    
    // Set up auto-refresh
    const interval = setInterval(fetchGeographicData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchGeographicData = async () => {
    try {
      const response = await fetch(`${API_URL}/geographic-data`);
      if (!response.ok) throw new Error('Failed to fetch geographic data');
      
      const result = await response.json();
      
      if (result.hasData) {
        setGeoData(result.regions);
        setThreats(result.threats);
        setStats(result.statistics);
        setError(null);
      } else {
        setGeoData([]);
        setThreats([]);
        setStats(null);
      }
    } catch (err) {
      console.error('Error fetching geographic data:', err);
      setError(err.message);
      
      // Use comprehensive sample data
      const sampleGeoData = getChartData('geographic');
      const sampleThreats = getChartData('suspicious');
      
      setGeoData(sampleGeoData);
      setThreats(sampleThreats);
      setStats({
        totalRegions: sampleGeoData.length,
        totalConnections: sampleGeoData.reduce((sum, region) => sum + region.count, 0),
        suspiciousActivity: sampleGeoData.reduce((sum, region) => sum + (region.suspicious || 0), 0),
        highRiskRegions: sampleGeoData.filter(region => (region.suspicious || 0) > 5).length
      });
    } finally {
      setLoading(false);
    }
  };

  const getThreatColor = (threatLevel) => {
    switch (threatLevel) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Geographic Data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header with Statistics */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Geographic Threat Distribution</h3>
          <button
            onClick={fetchGeographicData}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRegions}</div>
              <div className="text-xs text-blue-600">Total Regions</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highRiskRegions}</div>
              <div className="text-xs text-red-600">High Risk Areas</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.totalCalls?.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Total Activities</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalThreats}</div>
              <div className="text-xs text-yellow-600">Active Threats</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.criticalThreats}</div>
              <div className="text-xs text-orange-600">Critical Alerts</div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map-like Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 rounded-lg p-6 h-full min-h-[400px] relative border-2 border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">India Network Activity Map</h4>
            
            {/* Map Background */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border border-gray-300">
              {/* Simulated map regions */}
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Background map shape (simplified India outline) */}
                <path
                  d="M80 50 L120 40 L160 50 L200 60 L240 70 L280 80 L320 90 L340 120 L350 160 L340 200 L320 230 L280 250 L240 260 L200 250 L160 240 L120 220 L100 180 L80 140 Z"
                  fill="#e0f2fe"
                  stroke="#0891b2"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                
                {geoData.map((region, index) => {
                  const x = (region.coordinates.lng - 68) * 4; // Adjust for map scale
                  const y = (35 - region.coordinates.lat) * 8; // Adjust for map scale
                  const size = Math.max(8, Math.min(20, (region.callVolume / 50) * 10));
                  
                  return (
                    <g key={index}>
                      {/* City marker */}
                      <circle
                        cx={x}
                        cy={y}
                        r={size}
                        fill={getThreatColor(region.threatLevel)}
                        stroke="#fff"
                        strokeWidth="2"
                        className="cursor-pointer drop-shadow-md hover:stroke-4 transition-all"
                        onClick={() => setSelectedRegion(region)}
                      />
                      
                      {/* Threat level indicator */}
                      {(region.threatLevel === 'high' || region.threatLevel === 'critical') && (
                        <circle
                          cx={x}
                          cy={y}
                          r={size + 8}
                          fill="none"
                          stroke={getThreatColor(region.threatLevel)}
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* City label */}
                      <text
                        x={x}
                        y={y + size + 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                      >
                        {region.city}
                      </text>
                    </g>
                  );
                })}
                
                {/* Threat connections */}
                {threats.slice(0, 3).map((threat, index) => {
                  const x = (threat.location.lng - 68) * 4;
                  const y = (35 - threat.location.lat) * 8;
                  return (
                    <g key={`threat-${index}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="25"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        className="animate-ping opacity-75"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-xs font-medium text-gray-700 mb-2">Threat Levels</div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>High Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Region Details Panel */}
        <div className="space-y-4">
          {selectedRegion && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3">{selectedRegion.city}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Threat Level:</span>
                  <span className={`font-medium ${
                    selectedRegion.threatLevel === 'high' ? 'text-red-600' :
                    selectedRegion.threatLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {selectedRegion.threatLevel.charAt(0).toUpperCase() + selectedRegion.threatLevel.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Score:</span>
                  <span className="font-medium">{selectedRegion.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Activities:</span>
                  <span className="font-medium">{selectedRegion.callVolume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Blocked:</span>
                  <span className="font-medium text-red-600">{selectedRegion.blockedCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Volume:</span>
                  <span className="font-medium">{(selectedRegion.totalBytes / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Threat Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Active Threat Alerts</h4>
            <div className="space-y-3">
              {threats.slice(0, 3).map((threat) => (
                <div key={threat.id} className="border-l-4 border-red-500 pl-3">
                  <div className="text-sm font-medium text-gray-900">{threat.city}</div>
                  <div className="text-xs text-gray-500">{threat.description}</div>
                  <div className="text-xs text-red-600 mt-1">
                    {new Date(threat.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Regional Overview</h4>
            <div className="space-y-2">
              {geoData.slice(0, 5).map((region, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getThreatColor(region.threatLevel) }}
                    ></div>
                    <span className="text-gray-700">{region.city}</span>
                  </div>
                  <div className="text-gray-500">{region.callVolume}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicMapEnhanced;
