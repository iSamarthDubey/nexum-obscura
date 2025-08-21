import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { uploadLogFile } from '../utils/api';
import toast from 'react-hot-toast';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }
    
    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadLogFile(file);
      setUploadResult(result);
      toast.success('File uploaded and processed successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Upload Log Files</h1>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link to="/upload" className="text-blue-600 hover:text-blue-800">Upload</Link>
              <Link to="/analysis" className="text-gray-500 hover:text-gray-700">Analysis</Link>
              <Link to="/visualization" className="text-gray-500 hover:text-gray-700">Visualization</Link>
              <Link to="/reports" className="text-gray-500 hover:text-gray-700">Reports</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
          <div className="flex">
            <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your CSV file should contain the following columns:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>timestamp</strong> - Date/time of the log entry</li>
                  <li><strong>source_ip</strong> - Source IP address</li>
                  <li><strong>dest_ip</strong> - Destination IP address</li>
                  <li><strong>source_port</strong> - Source port number</li>
                  <li><strong>dest_port</strong> - Destination port number</li>
                  <li><strong>protocol</strong> - Network protocol (TCP, UDP, etc.)</li>
                  <li><strong>action</strong> - Action taken (ALLOW, DENY, BLOCK, DROP)</li>
                  <li><strong>bytes</strong> - Number of bytes transferred (optional)</li>
                  <li><strong>packets</strong> - Number of packets (optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">
                  Drop your CSV file here, or{' '}
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                </span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">CSV files up to 50MB</p>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 bg-gray-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !file || uploading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Upload and Process'
              )}
            </button>
          </div>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Upload Complete</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">Processed</p>
                <p className="text-2xl font-bold text-green-900">{uploadResult.processed?.toLocaleString()}</p>
              </div>
              
              {uploadResult.errors > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800">Errors</p>
                  <p className="text-2xl font-bold text-red-900">{uploadResult.errors?.toLocaleString()}</p>
                </div>
              )}
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">Total</p>
                <p className="text-2xl font-bold text-blue-900">{uploadResult.total?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Dashboard
              </Link>
              <Link
                to="/analysis"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Analyze Data
              </Link>
            </div>
          </div>
        )}

        {/* Sample Data */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sample CSV Format</h3>
          <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`timestamp,source_ip,dest_ip,source_port,dest_port,protocol,action,bytes,packets
2024-01-01 10:00:00,192.168.1.100,203.0.113.1,12345,80,TCP,ALLOW,1024,5
2024-01-01 10:01:00,192.168.1.101,203.0.113.2,12346,443,TCP,ALLOW,2048,10
2024-01-01 10:02:00,10.0.0.5,198.51.100.1,12347,22,TCP,DENY,0,1`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
