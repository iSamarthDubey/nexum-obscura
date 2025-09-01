import React, { useState, useEffect } from 'react';
import { getChartData } from '../utils/sampleData';
import { 
  MapPinIcon, 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const GeographicMapEnhanced = () => {
  const [geoData, setGeoData] = useState([]);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    loadGeographicData();
  }, []);

  const loadGeographicData = () => {
    try {
      // Use comprehensive sample data
      const sampleGeoData = getChartData('geographic');
      const sampleThreats = getChartData('suspicious');
      
      // Process and enhance geographic data
      const enhancedGeoData = (sampleGeoData || []).map(region => {
        // Calculate risk level based on suspicious activity percentage
        const suspiciousPercentage = region.suspicious && region.count 
          ? (region.suspicious / region.count) * 100 
          : 0;
        
        let riskLevel = 'low';
        if (suspiciousPercentage > 30) riskLevel = 'high';
        else if (suspiciousPercentage > 15) riskLevel = 'medium';
        
        return {
          ...region,
          city: region.location || 'Unknown City',
          state: region.state || 'Unknown State',
          riskLevel: riskLevel,
          riskScore: Math.round(suspiciousPercentage * 2), // Convert to 0-100 scale
          coordinates: region.lat && region.lng ? [region.lat, region.lng] : [0, 0],
          dataVolume: Math.round((region.count || 0) * 0.5), // Estimate data volume
          lastActivity: 'Recently',
          primaryProtocol: 'HTTP'
        };
      });
      
      setGeoData(enhancedGeoData);
      setThreats(sampleThreats || []);
      setStats({
        totalRegions: enhancedGeoData.length,
        totalConnections: enhancedGeoData.reduce((sum, region) => sum + (region.count || 0), 0),
        highRiskRegions: enhancedGeoData.filter(r => r.riskLevel === 'high').length,
        mediumRiskRegions: enhancedGeoData.filter(r => r.riskLevel === 'medium').length,
        lowRiskRegions: enhancedGeoData.filter(r => r.riskLevel === 'low').length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading geographic data:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return <ShieldExclamationIcon className="w-4 h-4" />;
      case 'medium': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'low': return <ShieldCheckIcon className="w-4 h-4" />;
      default: return <MapPinIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Geographic Distribution</h3>
        <div className="flex space-x-2 text-sm">
          <span className="text-gray-500">Regions: {stats?.totalRegions || 0}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-500">Connections: {stats?.totalConnections || 0}</span>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="text-red-600 font-bold text-lg">{stats?.highRiskRegions || 0}</div>
          <div className="text-red-500 text-sm">High Risk</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="text-yellow-600 font-bold text-lg">{stats?.mediumRiskRegions || 0}</div>
          <div className="text-yellow-500 text-sm">Medium Risk</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-green-600 font-bold text-lg">{stats?.lowRiskRegions || 0}</div>
          <div className="text-green-500 text-sm">Low Risk</div>
        </div>
      </div>

      {/* Geographic List View (Simplified) */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-3">Regional Activity</h4>
        <div className="max-h-80 overflow-y-auto">
          {geoData.length > 0 ? (
            geoData.map((region, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRegion === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getRiskColor(region.riskLevel || 'low')}`}>
                      {getRiskIcon(region.riskLevel || 'low')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {region.city}, {region.state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {region.count} connections
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(region.riskLevel || 'low')}`}>
                      {(region.riskLevel || 'low').toUpperCase()}
                    </div>
                    {region.coordinates && (
                      <div className="text-xs text-gray-400 mt-1">
                        {region.coordinates[0].toFixed(2)}, {region.coordinates[1].toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRegion === index && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Traffic:</span>
                        <span className="ml-2 font-medium">{region.dataVolume || 'N/A'} MB</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Score:</span>
                        <span className="ml-2 font-medium">{region.riskScore || 'N/A'}/100</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Activity:</span>
                        <span className="ml-2 font-medium">{region.lastActivity || 'Recently'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Protocol:</span>
                        <span className="ml-2 font-medium">{region.primaryProtocol || 'Mixed'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No geographic data available</p>
              <p className="text-sm">Upload IPDR files to see regional distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Threat Summary */}
      {threats.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Threat Activity</h4>
          <div className="space-y-2">
            {threats.slice(0, 3).map((threat, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{threat.type}</div>
                  <div className="text-xs text-gray-500">{threat.location} • {threat.timestamp}</div>
                </div>
                <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  {threat.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographicMapEnhanced;
