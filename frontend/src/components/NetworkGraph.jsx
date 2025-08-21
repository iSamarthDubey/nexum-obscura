import React from 'react';

const NetworkGraph = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading network topology...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-gray-500">Network visualization will be implemented here</p>
        <p className="text-sm text-gray-400 mt-1">Using D3.js or similar library</p>
        {data && (
          <div className="mt-4 text-sm text-gray-600">
            <p>{data.nodes?.length || 0} nodes</p>
            <p>{data.links?.length || 0} connections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkGraph;
