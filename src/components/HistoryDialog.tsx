import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Video } from 'lucide-react';
import { VideoTransformation } from '../types';

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: VideoTransformation[];
  onSelect: (transformation: VideoTransformation) => void;
}

const HistoryDialog: React.FC<HistoryDialogProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect 
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Transformation History</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-grow">
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Video size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No transformation history yet</p>
                  <p className="text-sm mt-2">
                    Your transformed videos will appear here
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {history.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className={`py-4 px-2 cursor-pointer rounded-md transition-colors ${
                        hoveredItem === item.id ? 'bg-gray-50' : ''
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => {
                        if (item.status === 'completed') {
                          onSelect(item);
                          onClose();
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden mr-4 flex-shrink-0">
                          {item.transformedVideoUrl && (
                            <video
                              src={item.transformedVideoUrl}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800 truncate">
                            {item.sourceVideoName}
                          </h3>
                          
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(item.createdAt)}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {item.parameters.duration}s
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center">
                            <span className="text-sm font-medium mr-2">Style:</span>
                            <span className="text-sm text-gray-600 capitalize">
                              {item.parameters.style}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {item.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                          {item.status === 'processing' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Processing
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                          {item.status === 'failed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Failed
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HistoryDialog;