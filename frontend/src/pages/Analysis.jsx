import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { searchLogs, getDashboardData, getAnomalies } from '../utils/api';
import SearchFilters from '../components/SearchFilters';
import LogTable from '../components/LogTable';
import AnomalyList from '../components/AnomalyList';
import PatternAnalysis from '../components/PatternAnalysis';

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sourceIP: '',
    destinationIP: '',
    protocol: '',
    minSuspicion: '',
    maxSuspicion: '',
    page: 1,
    limit: 100
  });
  const [anomalies, setAnomalies] = useState([]);
  const [patterns, setPatterns] = useState(null);

  useEffect(() => {
    if (activeTab === 'search') {
      handleSearch();
    } else if (activeTab === 'anomalies') {
      loadAnomalies();
    } else if (activeTab === 'patterns') {
      loadPatterns();
    }
  }, [activeTab]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const data = await searchLogs(cleanFilters);
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnomalies = async () => {
    setLoading(true);
    try {
      const data = await getAnomalies({ hours: 24 });
      setAnomalies(data.anomalies || []);
    } catch (error) {
      console.error('Failed to load anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatterns = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData({ hours: 24 });
      setPatterns(data);
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'search', name: 'Log Search', icon: MagnifyingGlassIcon },
    { id: 'anomalies', name: 'Anomaly Detection', icon: ExclamationTriangleIcon },
    { id: 'patterns', name: 'Pattern Analysis', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Security Analysis</h1>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link to="/upload" className="text-gray-500 hover:text-gray-700">Upload</Link>
              <Link to="/analysis" className="text-blue-600 hover:text-blue-800">Analysis</Link>
              <Link to="/visualization" className="text-gray-500 hover:text-gray-700">Visualization</Link>
              <Link to="/reports" className="text-gray-500 hover:text-gray-700">Reports</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h3>
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
                loading={loading}
              />
            </div>

            {/* Search Results */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Results ({logs.length} logs found)
                </h3>
              </div>
              <LogTable logs={logs} loading={loading} />
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            {/* Anomaly Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Critical</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {anomalies.filter(a => a.severity === 'CRITICAL').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">High</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {anomalies.filter(a => a.severity === 'HIGH').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Medium</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {anomalies.filter(a => a.severity === 'MEDIUM').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Last 24h</p>
                    <p className="text-2xl font-semibold text-gray-900">{anomalies.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anomaly List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Detected Anomalies</h3>
              </div>
              <AnomalyList anomalies={anomalies} loading={loading} />
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <PatternAnalysis patterns={patterns} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
