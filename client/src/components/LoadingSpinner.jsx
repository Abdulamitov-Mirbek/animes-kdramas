import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;