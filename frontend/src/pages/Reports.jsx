import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { getReports, generateReport, deleteReport } from '../utils/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    page: 1,
    limit: 20
  });
  const [generating, setGenerating] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Export functions
  const handleExport = async (type, format = 'csv') => {
    setExportLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/export/${type}?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `nexum-export-${type}-${Date.now()}.${format}`;
      
      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`✅ ${type} data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Failed to export ${type} data`);
    } finally {
      setExportLoading(false);
    }
  };

  const generateQuickReport = async (reportType) => {
    setGenerating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports?type=${reportType}&format=json`);
      
      if (!response.ok) {
        throw new Error('Report generation failed');
      }
      
      const reportData = await response.json();
      
      // Create and download the report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexum-report-${reportType}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`✅ ${reportType} report generated`);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert(`Failed to generate ${reportType} report`);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports(filters);
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportData) => {
    setGenerating(true);
    try {
      await generateReport(reportData);
      alert('Report generated successfully!');
      setShowModal(false);
      loadReports();
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await deleteReport(reportId);
      alert('Report deleted successfully');
      loadReports();
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    }
  };

  const getReportTypeColor = (type) => {
    const colors = {
      DAILY: 'bg-blue-100 text-blue-800',
      WEEKLY: 'bg-green-100 text-green-800',
      MONTHLY: 'bg-purple-100 text-purple-800',
      INCIDENT: 'bg-red-100 text-red-800',
      CUSTOM: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.CUSTOM;
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: 'bg-green-100 text-green-800',
      DRAFT: 'bg-yellow-100 text-yellow-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.DRAFT;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Security Reports</h1>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link to="/upload" className="text-gray-500 hover:text-gray-700">Upload</Link>
              <Link to="/analysis" className="text-gray-500 hover:text-gray-700">Analysis</Link>
              <Link to="/visualization" className="text-gray-500 hover:text-gray-700">Visualization</Link>
              <Link to="/reports" className="text-blue-600 hover:text-blue-800">Reports</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Export & Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Export */}
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Quick Export
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExport('logs', 'csv')}
                disabled={exportLoading}
                className="w-full btn-cyber-secondary flex items-center justify-center space-x-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Export All Logs (CSV)</span>
              </button>
              <button
                onClick={() => handleExport('suspicious', 'csv')}
                disabled={exportLoading}
                className="w-full btn-cyber-secondary flex items-center justify-center space-x-2"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Export Suspicious Records (CSV)</span>
              </button>
              <button
                onClick={() => handleExport('summary', 'json')}
                disabled={exportLoading}
                className="w-full btn-cyber-secondary flex items-center justify-center space-x-2"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Export Summary (JSON)</span>
              </button>
            </div>
          </div>

          {/* Quick Reports */}
          <div className="card-cyber p-6">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Generate Reports
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => generateQuickReport('summary')}
                disabled={generating}
                className="w-full btn-cyber-primary flex items-center justify-center space-x-2"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Summary Report</span>
              </button>
              <button
                onClick={() => generateQuickReport('detailed')}
                disabled={generating}
                className="w-full btn-cyber-primary flex items-center justify-center space-x-2"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Detailed Forensic Report</span>
              </button>
              {(generating || exportLoading) && (
                <div className="text-center">
                  <div className="inline-flex items-center text-cyber-blue">
                    <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">All Types</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="INCIDENT">Incident</option>
                <option value="CUSTOM">Custom</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Generate Report Button */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Daily Report</h3>
                <p className="text-sm text-gray-500">Generate today's security summary</p>
              </div>
            </div>
            <button
              onClick={() => handleGenerateReport({
                title: `Daily Security Report - ${new Date().toDateString()}`,
                reportType: 'DAILY',
                startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
                endDate: new Date().toISOString()
              })}
              disabled={generating}
              className="mt-4 w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Now'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Weekly Report</h3>
                <p className="text-sm text-gray-500">Generate this week's analysis</p>
              </div>
            </div>
            <button
              onClick={() => handleGenerateReport({
                title: `Weekly Security Report - Week of ${new Date().toDateString()}`,
                reportType: 'WEEKLY',
                startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
                endDate: new Date().toISOString()
              })}
              disabled={generating}
              className="mt-4 w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Now'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Incident Report</h3>
                <p className="text-sm text-gray-500">Generate incident analysis</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Configure & Generate
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Generated Reports</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by generating your first report.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                          {report.reportType}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-6">
                        <span>
                          Generated: {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Period: {new Date(report.dateRange.startDate).toLocaleDateString()} - {new Date(report.dateRange.endDate).toLocaleDateString()}
                        </span>
                        {report.summary && (
                          <span>
                            {report.summary.totalLogs?.toLocaleString()} logs analyzed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* View report logic */}}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Report Summary */}
                  {report.summary && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Logs</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {report.summary.totalLogs?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-600">Suspicious</p>
                        <p className="text-lg font-semibold text-yellow-900">
                          {report.summary.suspiciousActivities?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-600">Critical</p>
                        <p className="text-lg font-semibold text-red-900">
                          {report.summary.criticalThreats?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-600">Recommendations</p>
                        <p className="text-lg font-semibold text-blue-900">
                          {report.recommendations?.length || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Generation Modal - Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card-cyber p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-cyber text-cyber-blue mb-4">Generate Report</h3>
            <p className="text-cyber-text mb-4">Report generation feature will be implemented.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-cyber-border rounded hover:bg-gray-800 text-cyber-text"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Report generation feature coming soon!');
                  setShowModal(false);
                }}
                className="btn-cyber"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
