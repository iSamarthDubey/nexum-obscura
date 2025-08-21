import React from 'react';
import { getRiskLevelColor } from '../utils/helpers';

const TopSourceIPs = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((ip, index) => (
        <div key={ip._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-sm font-mono text-gray-900">{ip._id}</div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(ip.riskLevel || 'LOW')}`}>
              {ip.riskLevel || 'LOW'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {ip.count?.toLocaleString()} events
            </div>
            <div className="text-xs text-gray-500">
              Avg suspicion: {ip.avgSuspicion?.toFixed(1) || 0}/100
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSourceIPs;
