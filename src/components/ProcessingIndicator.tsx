import React from 'react';
import { motion } from 'framer-motion';

interface ProcessingIndicatorProps {
  progress: number;
  showProgress?: boolean;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ 
  progress,
  showProgress = true
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-center">
      <div className="relative flex flex-col items-center space-y-4">
        <div className="w-20 h-20 relative">
          <svg
            className="w-20 h-20"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                transformOrigin: "center",
                transform: "rotate(-90deg)",
                strokeDasharray: "283",
                strokeDashoffset: "0",
              }}
            />
          </svg>
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Transforming Your Video
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we apply the selected style to your video. This process may take a few minutes depending on the length and complexity.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;