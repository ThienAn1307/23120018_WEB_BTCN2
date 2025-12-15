import React from 'react';
import { useLoading } from '../context/LoadingContext';

export const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
        {/* Spinner Animation */}
        <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-white font-semibold">Đang tải...</p>
      </div>
    </div>
  );
};
