import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const LogsTable = ({ logEntries = [], totalEntries = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [filters, setFilters] = useState({
    riskLevel: '',
    dateFrom: '',
    dateTo: '',
    minDuration: '',
    maxDuration: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Use passed props if available, otherwise load from API
  useEffect(() => {
    if (logEntries && logEntries.length > 0) {
      setLogs(logEntries);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalEntries: totalEntries,
        entriesPerPage: logEntries.length,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } else {
      loadLogs();
      loadUploadedFiles();
    }
  }, [logEntries, totalEntries]);

  // Load uploaded files for filtering
  const loadUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/files`);
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading uploaded files:', error);
    }
  };

  // Load logs with file filtering
  const loadLogs = async (page = 1, search = '', sourceFile = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: search,
        ...(sourceFile && { sourceFile })
      });
      
      const response = await fetch(`${API_URL}/logs?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete uploaded file
  const deleteFile = async (filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This will remove all associated log entries.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Successfully deleted ${filename}. Removed ${result.removedEntries} log entries.`);
        
        // Reload files and logs
        await loadUploadedFiles();
        if (selectedFile === filename) {
          setSelectedFile('');
        }
        loadLogs(1, searchTerm, selectedFile === filename ? '' : selectedFile);
      } else {
        const error = await response.json();
        alert(`Failed to delete file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    loadLogs(1, value, selectedFile);
  };

  const handleFileFilter = (e) => {
    const file = e.target.value;
    setSelectedFile(file);
    setCurrentPage(1);
    loadLogs(1, searchTerm, file);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs(1, searchTerm, selectedFile);
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
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              value={selectedFile}
              onChange={handleFileFilter}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Files</option>
              {uploadedFiles.map((file, index) => (
                <option key={index} value={file.filename}>
                  {file.filename} ({file.recordCount} records)
                </option>
              ))}
            </select>
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
          
          {/* File Management Section */}
          {uploadedFiles.length > 0 && (
            <div className="mt-2 p-3 bg-gray-800 rounded border border-gray-600">
              <h4 className="text-sm font-medium text-white mb-2">Uploaded Files ({uploadedFiles.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded text-xs">
                    <div>
                      <div className="text-white font-medium">{file.filename}</div>
                      <div className="text-gray-400">{file.recordCount} records • {file.size}</div>
                      <div className="text-gray-500">{new Date(file.uploadedAt).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => deleteFile(file.filename)}
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="Delete file and all associated logs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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

      {loading && (
        <div className="text-center py-8">
          <div className="text-blue-400">Loading logs...</div>
        </div>
      )}
      
      {!loading && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-white font-medium">Source IP</th>
                  <th className="text-left p-3 text-white font-medium">Dest IP</th>
                  <th className="text-left p-3 text-white font-medium">Timestamp</th>
                  <th className="text-left p-3 text-white font-medium">Protocol</th>
                  <th className="text-left p-3 text-white font-medium">Action</th>
                  <th className="text-left p-3 text-white font-medium">Bytes</th>
                  <th className="text-left p-3 text-white font-medium">Risk</th>
                  <th className="text-left p-3 text-white font-medium">Source File</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                    <td className="p-3 text-gray-300 font-mono text-sm">{log.source_ip}</td>
                    <td className="p-3 text-gray-300 font-mono text-sm">{log.dest_ip}</td>
                    <td className="p-3 text-gray-400 text-xs">
                      {log.timestamp}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.protocol === 'TCP' ? 'bg-blue-900 text-blue-200' :
                        log.protocol === 'UDP' ? 'bg-green-900 text-green-200' :
                        log.protocol === 'ICMP' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-gray-900 text-gray-200'
                      }`}>
                        {log.protocol}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.action === 'ALLOW' ? 'bg-green-900 text-green-200' :
                        log.action === 'BLOCK' || log.action === 'DROP' || log.action === 'DENY' ? 'bg-red-900 text-red-200' :
                        'bg-gray-900 text-gray-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-sm">
                      {log.bytes ? (parseInt(log.bytes) / 1024).toFixed(1) + 'KB' : '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.riskLevel === 'High' ? 'bg-red-900 text-red-200' :
                          log.riskLevel === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-green-900 text-green-200'
                        }`}>
                          {log.riskLevel}
                        </span>
                        <span className={`text-xs mt-1 ${getSuspicionColor(log.suspicionScore || 0)}`}>
                          {log.suspicionScore ? `${log.suspicionScore}%` : '-'}
                        </span>
                        {log.anomaly_type && log.anomaly_type !== 'None' && (
                          <span className="text-xs text-orange-400 mt-1">
                            {log.anomaly_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-500 text-xs">{log.sourceFile || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.entriesPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.entriesPerPage, pagination.totalEntries)} of{' '}
                {pagination.totalEntries} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(pagination.currentPage - 1);
                    loadLogs(pagination.currentPage - 1, searchTerm, selectedFile);
                  }}
                  disabled={!pagination.hasPreviousPage}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-gray-800 text-white rounded">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(pagination.currentPage + 1);
                    loadLogs(pagination.currentPage + 1, searchTerm, selectedFile);
                  }}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition-colors"
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
