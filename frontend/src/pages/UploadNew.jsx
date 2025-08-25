import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    // Accept CSV and Excel files commonly used for IPDR
    const allowedTypes = ['.csv', '.xls', '.xlsx', '.txt'];
    const fileExtension = selectedFile.name.toLowerCase().substr(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a valid IPDR file (.csv, .xls, .xlsx, .txt)');
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit for IPDR files
      alert('File size must be less than 100MB');
      return;
    }
    
    setFile(selectedFile);
    generatePreview(selectedFile);
  };

  const generatePreview = async (file) => {
    // Simulate reading first few lines for preview
    const mockPreview = {
      columns: ['DateTime', 'A_Party', 'B_Party', 'Duration', 'Cell_ID', 'IMEI', 'Call_Type', 'Direction'],
      sampleRows: [
        ['2025-01-15 14:30:22', '+91-9876543210', '+91-9123456789', '00:02:45', 'CELL_001', '351234567890123', 'Voice', 'Outgoing'],
        ['2025-01-15 14:31:10', '+91-9123456789', '+91-9876543210', '00:01:30', 'CELL_001', '351234567890124', 'Voice', 'Incoming'],
        ['2025-01-15 14:32:05', '+91-9876543210', '+1-555-0123', '00:05:12', 'CELL_002', '351234567890123', 'Voice', 'International'],
      ],
      totalRows: 15847,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    };
    setPreviewData(mockPreview);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        success: true,
        recordsProcessed: 15847,
        validRecords: 15823,
        invalidRecords: 24,
        newConnections: 8934,
        flaggedNumbers: 12,
        processingTime: '2.3s',
        fileId: 'IPDR_' + Date.now()
      };
      
      setUploadResult(mockResult);
      
      // Auto-redirect to analysis after successful upload
      setTimeout(() => {
        navigate('/analysis', { state: { uploadResult: mockResult } });
      }, 3000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({ success: false, error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">IPDR File Upload</h1>
        <p className="page-subtitle">
          Import Internet Protocol Detail Records for investigation and analysis
        </p>
      </div>

      {/* Upload Guidelines */}
      <div className="card-cyber p-6">
        <h3 className="text-lg font-cyber text-cyber-blue mb-4">📋 Upload Guidelines</h3>
        <div className="grid-2 gap-6">
          <div>
            <h4 className="font-medium text-cyber-text mb-2">Supported Formats</h4>
            <ul className="text-sm text-cyber-text-muted space-y-1">
              <li>• CSV files (.csv)</li>
              <li>• Excel files (.xls, .xlsx)</li>
              <li>• Text files (.txt)</li>
              <li>• Maximum size: 100MB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cyber-text mb-2">Required Columns</h4>
            <ul className="text-sm text-cyber-text-muted space-y-1">
              <li>• DateTime (timestamp)</li>
              <li>• A_Party (calling number)</li>
              <li>• B_Party (called number)</li>
              <li>• Duration (call duration)</li>
              <li>• Cell_ID (tower location)</li>
            </ul>
          </div>
        </div>
      </div>

      {!uploadResult ? (
        <>
          {/* File Upload Area */}
          <div 
            className={`card-cyber border-2 border-dashed transition-all duration-200 ${
              dragActive 
                ? 'border-cyber-blue bg-blue-900/20' 
                : file 
                  ? 'border-cyber-green bg-green-900/10' 
                  : 'border-cyber-border hover:border-cyber-blue/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="p-8 text-center">
              {!file ? (
                <>
                  <div className="text-6xl mb-4">📤</div>
                  <h3 className="text-xl font-cyber text-cyber-text mb-2">
                    Drop IPDR files here
                  </h3>
                  <p className="text-cyber-text-muted mb-4">
                    or click to browse and select files
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-cyber"
                  >
                    Select Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx,.txt"
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-cyber text-cyber-green mb-2">
                    File Selected
                  </h3>
                  <p className="text-cyber-text mb-2">{file.name}</p>
                  <p className="text-sm text-cyber-text-muted mb-4">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn-cyber"
                    >
                      {uploading ? (
                        <span className="flex items-center">
                          <div className="spinner-cyber mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        'Start Processing'
                      )}
                    </button>
                    <button
                      onClick={resetUpload}
                      className="btn-cyber-outline"
                    >
                      Reset
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Preview */}
          {previewData && (
            <div className="card-cyber p-6">
              <h3 className="text-lg font-cyber text-cyber-blue mb-4 flex items-center">
                <span className="mr-2">👁️</span>
                File Preview
              </h3>
              
              <div className="grid-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-cyber text-cyber-text">{previewData.totalRows.toLocaleString()}</p>
                  <p className="text-sm text-cyber-text-muted">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cyber text-cyber-text">{previewData.columns.length}</p>
                  <p className="text-sm text-cyber-text-muted">Columns</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cyber text-cyber-text">{previewData.fileSize}</p>
                  <p className="text-sm text-cyber-text-muted">File Size</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-cyber">
                  <thead>
                    <tr>
                      {previewData.columns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.sampleRows.map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="font-mono-cyber text-xs">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Upload Results */
        <div className="card-cyber p-6">
          {uploadResult.success ? (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-cyber text-cyber-green mb-2">
                  Upload Successful
                </h3>
                <p className="text-cyber-text-muted">
                  IPDR file has been processed and analyzed
                </p>
              </div>

              <div className="grid-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xl font-cyber text-cyber-green">{uploadResult.recordsProcessed.toLocaleString()}</p>
                  <p className="text-sm text-cyber-text-muted">Records Processed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-cyber text-cyber-blue">{uploadResult.validRecords.toLocaleString()}</p>
                  <p className="text-sm text-cyber-text-muted">Valid Records</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-cyber text-yellow-400">{uploadResult.flaggedNumbers}</p>
                  <p className="text-sm text-cyber-text-muted">Flagged Numbers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-cyber text-cyan-400">{uploadResult.newConnections.toLocaleString()}</p>
                  <p className="text-sm text-cyber-text-muted">New Connections</p>
                </div>
              </div>

              <div className="alert-success mb-6">
                <p className="font-medium">File ID: {uploadResult.fileId}</p>
                <p className="text-sm mt-1">Processing completed in {uploadResult.processingTime}</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/analysis')}
                  className="btn-cyber"
                >
                  Start Analysis
                </button>
                <button
                  onClick={() => navigate('/visualization')}
                  className="btn-cyber-outline"
                >
                  View Network Map
                </button>
                <button
                  onClick={resetUpload}
                  className="btn-cyber-outline"
                >
                  Upload Another File
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-cyber text-cyber-red mb-2">
                  Upload Failed
                </h3>
                <p className="text-cyber-text-muted">
                  {uploadResult.error || 'An error occurred during processing'}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={resetUpload}
                  className="btn-cyber"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Processing Status */}
      {uploading && (
        <div className="card-cyber p-6">
          <h3 className="text-lg font-cyber text-cyber-blue mb-4">Processing Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="status-online w-3 h-3 rounded-full"></div>
              <span className="text-cyber-text">Validating file format...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="status-online w-3 h-3 rounded-full"></div>
              <span className="text-cyber-text">Parsing IPDR records...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="status-online w-3 h-3 rounded-full"></div>
              <span className="text-cyber-text">Building connection network...</span>
            </div>
            <div className="progress-cyber">
              <div className="progress-cyber-fill animate-pulse-cyber" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
