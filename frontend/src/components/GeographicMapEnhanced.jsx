import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const GeographicMap = () => {
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

  const getRiskColor = (riskScore) => {
    if (riskScore >= 80) return '#dc2626'; // red
    if (riskScore >= 60) return '#ea580c'; // orange
    if (riskScore >= 40) return '#d97706'; // yellow
    return '#16a34a'; // green
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Geographic Data</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">Global threat analysis and call volume by region</p>
        </div>
        <button
          onClick={fetchGeographicData}
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Regions</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRegions}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wide">High Risk Regions</div>
            <div className="text-2xl font-bold text-red-900 mt-1">{stats.highRiskRegions}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Calls</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{stats.totalCalls.toLocaleString()}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Active Threats</div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.totalThreats}</div>
            <div className="text-xs text-yellow-600 mt-1">{stats.criticalThreats} critical</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 h-96 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Interactive world map visualization</p>
                <p className="text-xs text-gray-400 mt-1">Showing threat levels and call distribution</p>
              </div>
            </div>
            
            {/* Overlay threat indicators */}
            {geoData.map((region, index) => (
              <div
                key={index}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + (index * 15) - 30}%`,
                  top: `${40 + (index * 10) - 20}%`
                }}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                  style={{ backgroundColor: getRiskColor(region.riskScore) }}
                  title={`${region.country} - Risk: ${region.riskScore}`}
                ></div>
                {selectedRegion === region && (
                  <div className="absolute z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg mt-2 w-48">
                    <h4 className="font-medium text-gray-900">{region.country}</h4>
                    <p className="text-sm text-gray-600">Risk Score: {region.riskScore}</p>
                    <p className="text-sm text-gray-600">Calls: {region.callVolume.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Suspicious: {region.suspiciousCalls}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Regional Details */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Regional Overview</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {geoData.map((region, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: getRiskColor(region.riskScore) }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{region.country}</div>
                      <div className="text-xs text-gray-500">{region.countryCode}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{region.callVolume.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">calls</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>Risk: {region.riskScore}/100</span>
                  <span className={`font-medium ${
                    region.threatLevel === 'high' ? 'text-red-600' :
                    region.threatLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {region.threatLevel.toUpperCase()}
                  </span>
                </div>
                
                {/* Show city breakdown if region is selected */}
                {selectedRegion === region && region.regions && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-2">Major Cities:</div>
                    {region.regions.map((city, cityIndex) => (
                      <div key={cityIndex} className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{city.city}</span>
                        <span>{city.calls} calls (Risk: {city.risk})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Threats */}
      {threats.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Active Threats</h4>
          <div className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      threat.severity === 'critical' ? 'bg-red-600' :
                      threat.severity === 'high' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-red-800">{threat.type}</h5>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        threat.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        threat.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {threat.severity}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{threat.description}</p>
                    <p className="text-xs text-red-600 mt-2">
                      {new Date(threat.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Risk Level Legend</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Low (0-39)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-600">Medium (40-59)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm text-gray-600">High (60-79)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">Critical (80+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;
