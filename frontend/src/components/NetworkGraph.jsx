import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const NetworkGraph = ({ data, loading, filters = {} }) => {
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [containerReady, setContainerReady] = useState(false);

  // Ensure container is ready
  useEffect(() => {
    if (cyRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    // Check if container ref exists and data is available
    if (!containerReady || !cyRef.current || !data || !data.nodes || !data.edges || loading) return;

    // Clear any existing cytoscape instance
    if (cyRef.current._cytoscapeInstance) {
      cyRef.current._cytoscapeInstance.destroy();
      cyRef.current._cytoscapeInstance = null;
    }

    // Initialize Cytoscape
    const cy = cytoscape({
      container: cyRef.current,
      elements: [
        // Add nodes
        ...data.nodes.map(node => ({
          data: {
            id: node.id,
            label: node.label,
            avgRisk: node.avgRisk,
            connectionCount: node.connectionCount,
            isInternational: node.isInternational
          },
          style: {
            'width': node.size,
            'height': node.size,
            'background-color': node.color,
            'border-width': 2,
            'border-color': node.avgRisk > 70 ? '#dc2626' : '#6b7280',
            'label': node.label.length > 15 ? node.label.substring(0, 12) + '...' : node.label,
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#000'
          }
        })),
        // Add edges
        ...data.edges.map(edge => ({
          data: {
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
            avgRisk: edge.avgRisk,
            totalDuration: edge.totalDuration,
            riskLevel: edge.riskLevel
          },
          style: {
            'width': edge.width,
            'line-color': edge.color,
            'target-arrow-color': edge.color,
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
    if (cyRef.current) {
      cyRef.current._cytoscapeInstance = cy;
    }

    return () => {
      if (cy) {
        cy.destroy();
      }
      if (cyRef.current) {
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
