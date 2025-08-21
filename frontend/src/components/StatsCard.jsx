import React from 'react';
import { formatNumber } from '../utils/helpers';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', percentage, subtext }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? formatNumber(value) : value}
                </div>
                {percentage && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    {percentage}%
                  </div>
                )}
              </dd>
              {subtext && (
                <div className="text-sm text-gray-500 mt-1">{subtext}</div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
