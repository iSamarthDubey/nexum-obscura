// DemoDashboard.jsx
// This file was renamed from VisualizationEnhanced.jsx for clarity

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChartData } from '../utils/sampleData';
import ProtocolDistribution from '../components/ProtocolDistribution';
import GeographicMapEnhanced from '../components/GeographicMapEnhanced';
import NetworkGraph from '../components/NetworkGraph';
import ActivityChart from '../components/ActivityChart';
import AnomalyChart from '../components/AnomalyChart';
import LogTable from '../components/LogTable';
import {
  ChartBarIcon,
  GlobeAsiaAustraliaIcon,
  ShareIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DemoDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getChartData();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Protocol Distribution</h2>
          <ProtocolDistribution data={data.protocolDistribution} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Geographic Map</h2>
          <GeographicMapEnhanced data={data.geographicData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Network Graph</h2>
          <NetworkGraph data={data.networkData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Activity Chart</h2>
          <ActivityChart data={data.activityData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Anomaly Chart</h2>
          <AnomalyChart data={data.anomalyData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Log Table</h2>
          <LogTable data={data.logData} />
        </div>
      </div>
    </div>
  );
}

export default DemoDashboard;
