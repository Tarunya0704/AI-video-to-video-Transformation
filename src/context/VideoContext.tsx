import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoTransformation, TransformationParameters } from '../types';

interface VideoContextType {
  history: VideoTransformation[];
  currentTransformation: VideoTransformation | null;
  setHistory: (history: VideoTransformation[]) => void;
  setCurrentTransformation: (transformation: VideoTransformation | null) => void;
  addToHistory: (transformation: VideoTransformation) => void;
  updateTransformation: (id: string, updates: Partial<VideoTransformation>) => void;
}

const defaultParameters: TransformationParameters = {
  style: 'cinematic',
  intensity: 0.5,
  resolution: '720p',
  duration: 30,
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<VideoTransformation[]>([]);
  const [currentTransformation, setCurrentTransformation] = useState<VideoTransformation | null>(null);

  const addToHistory = (transformation: VideoTransformation) => {
    setHistory((prev) => [transformation, ...prev]);
  };

  const updateTransformation = (id: string, updates: Partial<VideoTransformation>) => {
    setHistory((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    
    if (currentTransformation?.id === id) {
      setCurrentTransformation((prev) => 
        prev ? { ...prev, ...updates } : null
      );
    }
  };

  return (
    <VideoContext.Provider 
      value={{ 
        history, 
        currentTransformation, 
        setHistory, 
        setCurrentTransformation,
        addToHistory,
        updateTransformation
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};