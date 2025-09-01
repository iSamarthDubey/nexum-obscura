import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { getChartData } from '../utils/sampleData';

const NetworkGraph = ({ data, loading, filters = {} }) => {
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [containerReady, setContainerReady] = useState(false);
  const [error, setError] = useState(null);

  // Ensure container is ready
  useEffect(() => {
    if (cyRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    // Check if container ref exists and data is available
    if (!containerReady || !cyRef.current || loading) return;
    
    console.log('🔄 NetworkGraph received data:', data);
    
    // Use sample data if no data is provided
    const displayData = data || getChartData('network');
    
    // Check if we have valid data
    if (!displayData) {
      console.log('⚠️ No data provided to NetworkGraph');
      setError('No network data available. Upload IPDR files to generate network visualization.');
      return;
    }
    
    if (!data.hasData) {
      console.log('⚠️ API returned hasData: false');
      setError('No network data available. Upload IPDR files to generate network visualization.');
      return;
    }
    
    if (!displayData.nodes || !Array.isArray(displayData.nodes)) {
      console.log('⚠️ Invalid nodes data:', displayData.nodes);
      setError('Invalid network data format. Please try uploading data again.');
      return;
    }
    
    if (!displayData.edges || !Array.isArray(displayData.edges)) {
      console.log('⚠️ Invalid edges data:', displayData.edges);
      setError('Invalid network data format. Please try uploading data again.');
      return;
    }
    
    if (displayData.nodes.length === 0) {
      console.log('⚠️ No nodes in network data');
      setError('No network connections found. Try adjusting filters or uploading more data.');
      return;
    }
    
    setError(null);
    
    try {
      // Clear any existing cytoscape instance
      if (cyRef.current._cytoscapeInstance) {
        cyRef.current._cytoscapeInstance.destroy();
        cyRef.current._cytoscapeInstance = null;
      }

      console.log(`✅ Creating network graph with ${displayData.nodes.length} nodes and ${displayData.edges.length} edges`);

      // Initialize Cytoscape
      const cy = cytoscape({
      container: cyRef.current,
      elements: [
        // Add nodes
        ...(displayData.nodes || []).map(node => ({
          data: {
            id: node.id || `node-${Math.random()}`,
            label: node.label || node.id || 'Unknown',
            avgRisk: node.avgRisk || 0,
            connectionCount: node.connectionCount || node.connections || 0,
            isInternational: node.isInternational || false,
            type: node.type || 'client',
            location: node.location || 'Unknown'
          },
          style: {
            'width': node.size || 30,
            'height': node.size || 30,
            'background-color': node.color || (
              node.type === 'threat' ? '#dc2626' :
              node.type === 'server' ? '#059669' : '#3b82f6'
            ),
            'border-width': 2,
            'border-color': (node.avgRisk || 0) > 70 ? '#dc2626' : '#6b7280',
            'label': (node.label || node.id || 'Unknown').length > 15 ? (node.label || node.id || 'Unknown').substring(0, 12) + '...' : (node.label || node.id || 'Unknown'),
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#000'
          }
        })),
        // Add edges
        ...(displayData.edges || []).map(edge => ({
          data: {
            id: `${edge.source}-${edge.target}` || `edge-${Math.random()}`,
            source: edge.source,
            target: edge.target,
            weight: edge.weight || 1,
            avgRisk: edge.avgRisk || 0,
            totalDuration: edge.totalDuration || 0,
            riskLevel: edge.riskLevel || 'low'
          },
          style: {
            'width': edge.width || 2,
            'line-color': edge.color || '#6b7280',
            'target-arrow-color': edge.color || '#6b7280',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.8
          }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'overlay-padding': '6px',
            'z-index': 10
          }
        },
        {
          selector: 'edge',
          style: {
            'overlay-padding': '3px',
            'z-index': 1
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#3b82f6'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 8000,
        nodeOverlap: 10,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      },
      wheelSensitivity: 0.2,
      maxZoom: 3,
      minZoom: 0.2
    });

    // Add event listeners
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = node.data();
      setSelectedNode({
        id: nodeData.id,
        label: nodeData.label,
        avgRisk: nodeData.avgRisk,
        connectionCount: nodeData.connectionCount,
        isInternational: nodeData.isInternational
      });
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    // Calculate network statistics
    setNetworkStats({
      totalNodes: data.nodes.length,
      totalEdges: data.edges.length,
      highRiskNodes: data.nodes.filter(n => n.avgRisk > 70).length,
      internationalNodes: data.nodes.filter(n => n.isInternational).length,
      averageConnections: data.nodes.length > 0 ? 
        (data.nodes.reduce((sum, n) => sum + n.connectionCount, 0) / data.nodes.length).toFixed(1) : 0
    });

    // Store the instance reference for cleanup
    // Store the cytoscape instance for cleanup
    if (cyRef.current) {
      cyRef.current._cytoscapeInstance = cy;
    }
    
    } catch (error) {
      console.error('❌ Error creating network graph:', error);
      setError('Failed to create network visualization. Please try again.');
    }

    return () => {
      if (cyRef.current && cyRef.current._cytoscapeInstance) {
        cyRef.current._cytoscapeInstance.destroy();
        cyRef.current._cytoscapeInstance = null;
      }
    };
  }, [data, loading, containerReady]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-400">Loading network topology...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Network Visualization Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🌐</div>
          <p className="text-gray-400">No network data available</p>
          <p className="text-sm text-gray-500 mt-1">Upload IPDR files to see communication patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gray-900 rounded-lg">
      {/* Network Graph */}
      <div ref={cyRef} className="w-full h-full rounded-lg" />
      
      {/* Network Statistics */}
      <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-3 text-white text-xs">
        <h3 className="font-medium mb-2">Network Stats</h3>
        {networkStats && (
          <div className="space-y-1">
            <div>Nodes: <span className="text-blue-400">{networkStats.totalNodes}</span></div>
            <div>Connections: <span className="text-green-400">{networkStats.totalEdges}</span></div>
            <div>High Risk: <span className="text-red-400">{networkStats.highRiskNodes}</span></div>
            <div>International: <span className="text-yellow-400">{networkStats.internationalNodes}</span></div>
            <div>Avg Connections: <span className="text-cyan-400">{networkStats.averageConnections}</span></div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 text-white text-xs">
        <h3 className="font-medium mb-2">Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>High Risk (70%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Medium Risk (40-70%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Low Risk (0-40%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-1 bg-red-500 mr-2"></div>
            <span>Strong Connection</span>
          </div>
        </div>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-4 text-white text-sm max-w-xs">
          <h3 className="font-medium text-blue-400 mb-2">Selected Node</h3>
          <div className="space-y-1">
            <div><span className="text-gray-400">Number:</span> {selectedNode.label}</div>
            <div><span className="text-gray-400">Risk Score:</span> 
              <span className={`ml-1 ${selectedNode.avgRisk > 70 ? 'text-red-400' : 
                selectedNode.avgRisk > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                {selectedNode.avgRisk?.toFixed(1)}%
              </span>
            </div>
            <div><span className="text-gray-400">Connections:</span> {selectedNode.connectionCount}</div>
            {selectedNode.isInternational && (
              <div><span className="text-yellow-400">📍 International Number</span></div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-2 text-white text-xs">
        <div className="text-gray-400">Controls:</div>
        <div>Click: Select node</div>
        <div>Scroll: Zoom</div>
        <div>Drag: Pan view</div>
      </div>
    </div>
  );
};

export default NetworkGraph;
