import React, { useEffect, useRef, useState } from 'react';
import { getChartData } from '../utils/sampleData';

const NetworkGraph = ({ data, loading, filters = {} }) => {
  const [networkData, setNetworkData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (data && data.nodes && data.nodes.length > 0) {
      setNetworkData(data);
      setError(null);
    } else {
      setNetworkData(null);
      setError(null);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️ Network Topology</div>
          <p className="text-gray-600">Demo network visualization would appear here</p>
          <p className="text-sm text-gray-500 mt-2">Advanced network graph with cytoscape.js</p>
        </div>
      </div>
    );
  }

  if (!networkData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <div className="text-4xl mb-2">🕸️</div>
        <div className="text-lg font-medium text-gray-700">Network Topology View</div>
        <div className="text-sm text-gray-500 mt-2">No network data available. Upload logs to view network topology.</div>
      </div>
    );
  }

  // ...existing code for rendering networkData...
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Network Topology</h3>
        <div className="text-sm text-gray-500">
          {networkData?.nodes?.length || 0} nodes, {networkData?.edges?.length || 0} connections
        </div>
      </div>

      {/* Simplified Network Visualization */}
      <div className="relative h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🕸️</div>
          <div className="text-lg font-medium text-gray-700">Network Topology View</div>
          <div className="text-sm text-gray-500 mt-2">
            Interactive network graph showing {networkData?.nodes?.length || 0} nodes
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Advanced visualization with cytoscape.js
          </div>
        </div>
      </div>

      {/* Network Stats */}
      {networkData && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-bold text-lg">{networkData.nodes?.length || 0}</div>
            <div className="text-blue-500 text-sm">Nodes</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-green-600 font-bold text-lg">{networkData.edges?.length || 0}</div>
            <div className="text-green-500 text-sm">Connections</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-yellow-600 font-bold text-lg">
              {networkData.nodes?.filter(n => n.type === 'threat')?.length || 0}
            </div>
            <div className="text-yellow-500 text-sm">Threats</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-red-600 font-bold text-lg">
              {networkData.nodes?.filter(n => n.riskScore > 70)?.length || 0}
            </div>
            <div className="text-red-500 text-sm">High Risk</div>
          </div>
        </div>
      )}

      {/* Node List */}
      {networkData?.nodes && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Network Nodes</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {networkData.nodes.slice(0, 5).map((node, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    node.type === 'threat' ? 'bg-red-500' : 
                    node.type === 'server' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-medium">{node.label || node.id}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {node.connections || 0} connections
                </div>
              </div>
            ))}
            {networkData.nodes.length > 5 && (
              <div className="text-center text-xs text-gray-500 py-2">
                ...and {networkData.nodes.length - 5} more nodes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
