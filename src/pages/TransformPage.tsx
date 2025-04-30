import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import VideoUploader from '../components/VideoUploader';
import ParametersForm from '../components/ParametersForm';
import VideoPlayer from '../components/VideoPlayer';
import HistoryDialog from '../components/HistoryDialog';
import ProcessingIndicator from '../components/ProcessingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { useVideoContext } from '../context/VideoContext';
import { transformVideo, getTransformationStatus } from '../services/api';
import { TransformationParameters } from '../types';

const TransformPage: React.FC = () => {
  const { 
    history, 
    currentTransformation, 
    setCurrentTransformation, 
    addToHistory, 
    updateTransformation 
  } = useVideoContext();
  
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string>('');
  const [parameters, setParameters] = useState<TransformationParameters>({
    style: 'cinematic',
    intensity: 0.5,
    resolution: '720p',
    duration: 30,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const handleVideoUploaded = (url: string, fileName: string) => {
    setSourceUrl(url);
    setSourceFileName(fileName);
    setError(null);
  };
  
  const handleParametersChange = (newParameters: TransformationParameters) => {
    setParameters(newParameters);
  };
  
  const handleTransform = async () => {
    if (!sourceUrl) {
      setError('Please upload a video first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);
    
    try {
      // Create a new transformation record
      const transformationId = uuidv4();
      const timestamp = new Date().toISOString();
      
      const newTransformation = {
        id: transformationId,
        sourceVideoUrl: sourceUrl,
        sourceVideoName: sourceFileName,
        transformedVideoUrl: null,
        parameters,
        status: 'processing' as const,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      // Add to history immediately to show progress
      addToHistory(newTransformation);
      setCurrentTransformation(newTransformation);
      
      // Start progress simulation
      startProgressSimulation();
      
      // Call API to transform the video
      const response = await transformVideo(sourceUrl, sourceFileName, parameters);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to transform video');
      }
      
      // Set up polling for status updates
      pollForStatus(transformationId);
      
    } catch (err) {
      console.error('Transform error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsProcessing(false);
      
      // Update transformation status
      if (currentTransformation) {
        updateTransformation(currentTransformation.id, {
          status: 'failed',
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };
  
  const startProgressSimulation = () => {
    // Simulate progress until we get real updates
    // This is just for UI feedback since the actual processing happens asynchronously
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        // Cap at 95% until we get the actual result
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + (Math.random() * 2);
      });
    }, 1000);
    
    // Store interval ID to clear it later
    return interval;
  };
  
  const pollForStatus = async (transformationId: string) => {
    // In a real implementation, this would poll an API endpoint
    // that checks the status of the transformation job
    try {
      const response = await getTransformationStatus(transformationId);
      
      if (response.success && response.data) {
        const transformation = response.data;
        
        if (transformation.status === 'completed') {
          // Update the transformation record
          updateTransformation(transformationId, {
            transformedVideoUrl: transformation.transformedVideoUrl,
            status: 'completed',
            updatedAt: new Date().toISOString(),
          });
          
          setIsProcessing(false);
          setProcessingProgress(100);
          
          // If this is the current transformation, update it
          if (currentTransformation?.id === transformationId) {
            setCurrentTransformation(transformation);
          }
          
          return;
        } else if (transformation.status === 'failed') {
          throw new Error('Video transformation failed');
        }
      }
      
      // If still processing, poll again after a delay
      setTimeout(() => pollForStatus(transformationId), 3000);
      
    } catch (err) {
      console.error('Polling error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get transformation status');
      setIsProcessing(false);
      
      if (currentTransformation?.id === transformationId) {
        updateTransformation(transformationId, {
          status: 'failed',
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };
  
  const handleReset = () => {
    setSourceUrl(null);
    setSourceFileName('');
    setCurrentTransformation(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    setError(null);
  };
  
  const handleSelectFromHistory = (transformation: any) => {
    setCurrentTransformation(transformation);
    setSourceUrl(transformation.sourceVideoUrl);
    setSourceFileName(transformation.sourceVideoName);
    setParameters(transformation.parameters);
  };
  
  // For demo purposes, let's mock a successful transformation after a delay
  useEffect(() => {
    if (isProcessing && processingProgress >= 95) {
      // This simulates the webhook callback with the processed video
      // In a real implementation, this would happen through the webhook endpoint
      const simulateWebhookCallback = setTimeout(() => {
        if (currentTransformation) {
          const transformedUrl = 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/elephants.mp4';
          
          updateTransformation(currentTransformation.id, {
            transformedVideoUrl: transformedUrl,
            status: 'completed',
            updatedAt: new Date().toISOString(),
          });
          
          setCurrentTransformation({
            ...currentTransformation,
            transformedVideoUrl: transformedUrl,
            status: 'completed',
            updatedAt: new Date().toISOString(),
          });
          
          setIsProcessing(false);
          setProcessingProgress(100);
        }
      }, 5000);
      
      return () => clearTimeout(simulateWebhookCallback);
    }
  }, [isProcessing, processingProgress, currentTransformation, updateTransformation]);
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <header className="mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              AI Video Transformation
            </h1>
            
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <History size={16} className="mr-2" />
              History
            </button>
          </div>
          
          <p className="mt-2 text-gray-600 max-w-3xl">
            Transform your videos using the Hunyuan-Video AI model. Upload a video, customize the transformation parameters, and see the magic happen.
          </p>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto">
        {currentTransformation?.status === 'completed' && currentTransformation.transformedVideoUrl ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Transformed Video
              </h2>
              <VideoPlayer 
                videoUrl={currentTransformation.transformedVideoUrl} 
                title={`transformed-${currentTransformation.sourceVideoName}`}
              />
              
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload size={16} className="mr-2" />
                  Upload New Video
                </button>
                
                <a
                  href={currentTransformation.transformedVideoUrl}
                  download={`transformed-${currentTransformation.sourceVideoName}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download size={16} className="mr-2" />
                  Download Video
                </a>
              </div>
            </motion.div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Transformation Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Source Video
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {currentTransformation.sourceVideoName}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Style
                  </h3>
                  <p className="text-gray-900 font-medium capitalize">
                    {currentTransformation.parameters.style}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Intensity
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {currentTransformation.parameters.intensity.toFixed(1)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Resolution
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {currentTransformation.parameters.resolution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="p-10 bg-white rounded-lg shadow-sm">
            <ProcessingIndicator progress={processingProgress} />
          </div>
        ) : (
          <div className="space-y-6">
            {error && <ErrorMessage message={error} />}
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Video
              </h2>
              <VideoUploader 
                onVideoUploaded={handleVideoUploaded}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
            </div>
            
            {sourceUrl && (
              <>
                <ParametersForm 
                  onParametersChange={handleParametersChange}
                  isProcessing={isProcessing}
                />
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleTransform}
                    disabled={isUploading || isProcessing}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Transform Video
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      
      <HistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectFromHistory}
      />
    </div>
  );
};

export default TransformPage;