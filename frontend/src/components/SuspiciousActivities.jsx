import React, { useEffect, useState } from 'react';
import { getSuspiciousActivities } from '../utils/api';
import { formatRelativeTime, getSuspicionColor } from '../utils/helpers';

const SuspiciousActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await getSuspiciousActivities({ hours: 24 });
      setActivities(data.data?.slice(0, 10) || []);
    } catch (error) {
      console.error('Failed to load suspicious activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No suspicious activities in the last 24 hours</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="border-l-4 border-red-400 pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {activity.aParty} → {activity.bParty}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSuspicionColor(activity.suspicionScore)}`}>
                {activity.suspicionScore}/100
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(activity.lastContact)}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {activity.frequency} calls • Avg {activity.averageDuration}s • {activity.riskLevel} Risk
            {activity.patterns && activity.patterns.length > 0 && (
              <span className="ml-2 text-red-600">
                [{activity.patterns.join(', ')}]
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuspiciousActivities;
