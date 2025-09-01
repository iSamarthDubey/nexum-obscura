import React from 'react';
import { formatNumber } from '../utils/helpers';
import { getChartData } from '../utils/sampleData';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', percentage, subtext }) => {
  // Get enhanced stats for demo
  const enhancedStats = getChartData('stats');
  
  // Map titles to enhanced data
  const getEnhancedValue = () => {
    switch (title) {
      case 'Total Connections':
      case 'Total Records':
        return enhancedStats.totalConnections || value || 0;
      case 'Active Threats':
      case 'Flagged Numbers':
        return enhancedStats.activeThreats || value || 0;
      case 'Data Processed':
        return enhancedStats.dataProcessed || value || '0 GB';
      case 'System Health':
        return `${enhancedStats.systemHealth || value || 0}%`;
      case 'Alerts Today':
        return enhancedStats.alertsToday || value || 0;
      case 'Blocked Attempts':
        return enhancedStats.blockedAttempts || value || 0;
      case 'Unique IPs':
        return enhancedStats.uniqueIPs || value || 0;
      case 'Risk Score':
        return enhancedStats.averageRiskScore || value || 0;
      default:
        return value || 0;
    }
  };

  const getEnhancedPercentage = () => {
    if (percentage) return percentage;
    
    // Generate realistic percentage changes for demo
    const changes = {
      'Total Connections': 12.5,
      'Active Threats': 8.2,
      'Data Processed': 15.7,
      'System Health': -0.8,
      'Alerts Today': 24.1,
      'Blocked Attempts': 18.9,
      'Unique IPs': 6.3,
      'Risk Score': 2.4
    };
    
    return changes[title] || 5.2;
  };

  const getEnhancedSubtext = () => {
    if (subtext) return subtext;
    
    const subtexts = {
      'Total Connections': 'Last 24 hours',
      'Active Threats': 'Currently active',
      'Data Processed': 'Total volume analyzed',
      'System Health': 'Overall system status',
      'Alerts Today': 'Security alerts generated',
      'Blocked Attempts': 'Threats mitigated',
      'Unique IPs': 'Distinct IP addresses',
      'Risk Score': 'Average threat level'
    };
    
    return subtexts[title] || 'Sample data';
  };

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  const displayValue = getEnhancedValue();
  const displayPercentage = getEnhancedPercentage();
  const displaySubtext = getEnhancedSubtext();

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]} shadow-sm`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-600 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900">
                  {typeof displayValue === 'number' ? formatNumber(displayValue) : displayValue}
                </div>
                {displayPercentage && displayPercentage !== 0 && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    displayPercentage > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {displayPercentage > 0 ? '+' : ''}{displayPercentage}%
                  </div>
                )}
              </dd>
              <div className="text-sm text-gray-500 mt-1">{displaySubtext}</div>
            </dl>
          </div>
        </div>
        
        {/* Additional visual indicators for specific metrics */}
        {title === 'System Health' && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  parseInt(displayValue) >= 90 ? 'bg-green-500' :
                  parseInt(displayValue) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(parseInt(displayValue) || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {title === 'Active Threats' && displayValue > 0 && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            ⚠️ {displayValue} threats require attention
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
