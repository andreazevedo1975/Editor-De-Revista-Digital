import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      <p className="text-cyan-400 text-lg">Analyzing magazine layout...</p>
      <p className="text-gray-400 text-sm">This may take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
