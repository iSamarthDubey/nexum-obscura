import React, { useState, useEffect } from 'react';

const GeographicMap = () => {
  const [geoData, setGeoData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [viewMode, setViewMode] = useState('threats'); // threats, sources, targets
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeographicData();
    const interval = setInterval(loadGeographicData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadGeographicData = async () => {
    try {
      // Simulate geographic threat data
      const mockGeoData = [
        {
          country: 'United States',
          code: 'US',
          coordinates: { lat: 39.8283, lng: -98.5795 },
          threats: 156,
          sources: 89,
          targets: 67,
          riskLevel: 'High',
          topThreats: ['Malware', 'Phishing', 'DDoS'],
          recentActivity: '2 min ago'
        },
        {
          country: 'China',
          code: 'CN',
          coordinates: { lat: 35.8617, lng: 104.1954 },
          threats: 243,
          sources: 198,
          targets: 45,
          riskLevel: 'Critical',
          topThreats: ['APT', 'Data Breach', 'Ransomware'],
          recentActivity: '5 min ago'
        },
        {
          country: 'Russia',
          code: 'RU',
          coordinates: { lat: 61.5240, lng: 105.3188 },
          threats: 187,
          sources: 134,
          targets: 53,
          riskLevel: 'Critical',
          topThreats: ['State-sponsored', 'Ransomware', 'Banking Trojan'],
          recentActivity: '1 min ago'
        },
        {
          country: 'Germany',
          code: 'DE',
          coordinates: { lat: 51.1657, lng: 10.4515 },
          threats: 78,
          sources: 23,
          targets: 55,
          riskLevel: 'Medium',
          topThreats: ['Phishing', 'Malware', 'Identity Theft'],
          recentActivity: '8 min ago'
        },
        {
          country: 'Brazil',
          code: 'BR',
          coordinates: { lat: -14.2350, lng: -51.9253 },
          threats: 92,
          sources: 34,
          targets: 58,
          riskLevel: 'Medium',
          topThreats: ['Banking Malware', 'Phishing', 'Fraud'],
          recentActivity: '3 min ago'
        },
        {
          country: 'India',
          code: 'IN',
          coordinates: { lat: 20.5937, lng: 78.9629 },
          threats: 134,
          sources: 67,
          targets: 67,
          riskLevel: 'High',
          topThreats: ['Mobile Malware', 'Data Breach', 'Phishing'],
          recentActivity: '4 min ago'
        },
        {
          country: 'United Kingdom',
          code: 'GB',
          coordinates: { lat: 55.3781, lng: -3.4360 },
          threats: 67,
          sources: 19,
          targets: 48,
          riskLevel: 'Medium',
          topThreats: ['Phishing', 'Ransomware', 'Fraud'],
          recentActivity: '6 min ago'
        },
        {
          country: 'South Korea',
          code: 'KR',
          coordinates: { lat: 35.9078, lng: 127.7669 },
          threats: 89,
          sources: 34,
          targets: 55,
          riskLevel: 'High',
          topThreats: ['APT', 'Malware', 'DDoS'],
          recentActivity: '7 min ago'
        }
      ];

      setGeoData(mockGeoData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading geographic data:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getViewModeData = (country) => {
    switch (viewMode) {
      case 'sources': return country.sources;
      case 'targets': return country.targets;
      default: return country.threats;
    }
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'sources': return 'Attack Sources';
      case 'targets': return 'Attack Targets';
      default: return 'Total Threats';
    }
  };

  const sortedCountries = [...geoData].sort((a, b) => getViewModeData(b) - getViewModeData(a));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
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
            🌍 Geographic Threat Map
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live Data</span>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2">
          {['threats', 'sources', 'targets'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                viewMode === mode
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* World Map Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6 h-64 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm">Interactive World Map</p>
              <p className="text-xs text-gray-500 mt-1">Showing {getViewModeLabel()}</p>
            </div>
          </div>
          
          {/* Simulate threat markers */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse" title="High Activity"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Medium Activity"></div>
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-red-600 rounded-full animate-pulse" title="Critical Activity"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Low Activity"></div>
        </div>

        {/* Country Rankings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Top Countries by {getViewModeLabel()}
          </h4>
          
          <div className="space-y-2">
            {sortedCountries.slice(0, 8).map((country, index) => (
              <div
                key={country.code}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedCountry?.code === country.code
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCountry(selectedCountry?.code === country.code ? null : country)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded text-xs font-medium">
                    #{index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{country.code === 'US' ? '🇺🇸' : country.code === 'CN' ? '🇨🇳' : country.code === 'RU' ? '🇷🇺' : country.code === 'DE' ? '🇩🇪' : country.code === 'BR' ? '🇧🇷' : country.code === 'IN' ? '🇮🇳' : country.code === 'GB' ? '🇬🇧' : '🇰🇷'}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{country.country}</div>
                      <div className="text-xs text-gray-500">Last activity: {country.recentActivity}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskTextColor(country.riskLevel)}`}>
                    {country.riskLevel}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {getViewModeData(country).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {viewMode === 'threats' ? 'incidents' : viewMode}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Country Details */}
          {selectedCountry && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                📊 {selectedCountry.country} - Detailed Statistics
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{selectedCountry.threats}</div>
                  <div className="text-xs text-gray-600">Total Threats</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{selectedCountry.sources}</div>
                  <div className="text-xs text-gray-600">Attack Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{selectedCountry.targets}</div>
                  <div className="text-xs text-gray-600">Attack Targets</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">Top Threat Types:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedCountry.topThreats.map((threat, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-white text-gray-700 rounded border">
                      {threat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;
