import React, { useState, useEffect } from 'react';

const LogsTable = ({ logEntries = [], totalEntries = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    riskLevel: '',
    dateFrom: '',
    dateTo: '',
    minDuration: '',
    maxDuration: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const loadLogs = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/logs?page=${page}&limit=20&search=${encodeURIComponent(search)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading logs:', error);
      // Fallback to provided logEntries
      setLogs(logEntries.slice(0, 20));
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = (logs) => {
    let filteredLogs = logs;

    // Apply search term
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log =>
        Object.values(log).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply risk level filter
    if (filters.riskLevel) {
      filteredLogs = filteredLogs.filter(log => log.riskLevel === filters.riskLevel);
    }

    // Apply duration filters
    if (filters.minDuration) {
      filteredLogs = filteredLogs.filter(log => {
        const duration = parseInt(log.Duration || log.duration || 0);
        return duration >= parseInt(filters.minDuration);
      });
    }

    if (filters.maxDuration) {
      filteredLogs = filteredLogs.filter(log => {
        const duration = parseInt(log.Duration || log.duration || 0);
        return duration <= parseInt(filters.maxDuration);
      });
    }

    // Apply date filters (basic implementation)
    if (filters.dateFrom || filters.dateTo) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log['Call-Date'] || log.timestamp || log.processedAt);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
        
        if (fromDate && logDate < fromDate) return false;
        if (toDate && logDate > toDate) return false;
        return true;
      });
    }

    return filteredLogs;
  };

  useEffect(() => {
    if (totalEntries > 0) {
      loadLogs(currentPage, searchTerm);
    } else {
      const filtered = applyLocalFilters(logEntries);
      setLogs(filtered.slice(0, 20));
    }
  }, [currentPage, totalEntries, logEntries, searchTerm, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (totalEntries > 0) {
      loadLogs(1, searchTerm);
    } else {
      const filtered = applyLocalFilters(logEntries);
      setLogs(filtered.slice(0, 20));
    }
  };

  const getRiskBadge = (riskLevel) => {
    const badges = {
      High: 'bg-red-900 text-red-200 border-red-700',
      Medium: 'bg-yellow-900 text-yellow-200 border-yellow-700',
      Low: 'bg-green-900 text-green-200 border-green-700'
    };
    return badges[riskLevel] || badges.Low;
  };

  const formatDuration = (duration) => {
    if (!duration || duration === '0' || duration === 0) return '0s';
    
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return duration; // Return as-is if not a number
    
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      let result = `${hours}h`;
      if (remainingMinutes > 0) result += ` ${remainingMinutes}m`;
      if (remainingSeconds > 0) result += ` ${remainingSeconds}s`;
      return result;
    }
  };

  const getSuspicionColor = (score) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (totalEntries === 0 && logEntries.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">IPDR Log Entries</h3>
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📄</div>
          <p className="text-gray-400">No IPDR logs uploaded yet</p>
          <p className="text-gray-500 text-sm mt-1">Upload CSV files to view log entries here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-medium text-white mb-4 sm:mb-0">
          IPDR Log Entries
          {pagination.totalEntries && (
            <span className="text-sm text-gray-400 ml-2">
              ({pagination.totalEntries.toLocaleString()} total)
            </span>
          )}
        </h3>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              {showAdvancedFilters ? 'Hide' : 'Filters'}
            </button>
          </div>
          
          {showAdvancedFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 p-3 bg-gray-800 rounded">
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                <option value="">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
              
              <input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
              
              <input
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
              
              <input
                type="number"
                placeholder="Min Duration (s)"
                value={filters.minDuration}
                onChange={(e) => setFilters({...filters, minDuration: e.target.value})}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
              
              <input
                type="number"
                placeholder="Max Duration (s)"
                value={filters.maxDuration}
                onChange={(e) => setFilters({...filters, maxDuration: e.target.value})}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
            </div>
          )}
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-blue-400">Loading logs...</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-300">ID</th>
                  <th className="text-left py-3 px-2 text-gray-300">A-Party</th>
                  <th className="text-left py-3 px-2 text-gray-300">B-Party</th>
                  <th className="text-left py-3 px-2 text-gray-300">Date/Time</th>
                  <th className="text-left py-3 px-2 text-gray-300">Duration</th>
                  <th className="text-left py-3 px-2 text-gray-300">Risk</th>
                  <th className="text-left py-3 px-2 text-gray-300">Suspicion</th>
                  <th className="text-left py-3 px-2 text-gray-300">Source</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id || index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-2 text-gray-300 font-mono">
                      #{log.id || index + 1}
                    </td>
                    <td className="py-3 px-2 text-white font-mono">
                      {log['A-Party'] || log.a_party || log.caller || log.source || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-white font-mono">
                      {log['B-Party'] || log.b_party || log.called || log.destination || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-gray-300">
                      <div>
                        {log['Call-Date'] || log.date || (log.timestamp ? new Date(log.timestamp).toLocaleDateString() : new Date(log.processedAt).toLocaleDateString())}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log['Call-Time'] || log.time || (log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : new Date(log.processedAt).toLocaleTimeString())}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-300">
                      {formatDuration(log.Duration || log.duration)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getRiskBadge(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${getSuspicionColor(log.suspicionScore)}`}>
                        {log.suspicionScore}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-xs">
                      {log.sourceFile?.substring(0, 20) || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.entriesPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.entriesPerPage, pagination.totalEntries)} of{' '}
                {pagination.totalEntries} entries
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 text-gray-300 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LogsTable;
