import React, { useState } from 'react';
import { Sliders, Image, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransformationParameters } from '../types';

interface ParametersFormProps {
  onParametersChange: (parameters: TransformationParameters) => void;
  isProcessing: boolean;
}

const styleOptions = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'anime', label: 'Anime' },
  { id: 'cartoon', label: 'Cartoon' },
  { id: 'painting', label: 'Painting' },
  { id: 'sketch', label: 'Sketch' },
  { id: 'comic', label: 'Comic' },
];

const resolutionOptions = [
  { id: '480p', label: '480p' },
  { id: '720p', label: '720p' },
  { id: '1080p', label: '1080p' },
];

const ParametersForm: React.FC<ParametersFormProps> = ({ 
  onParametersChange,
  isProcessing
}) => {
  const [parameters, setParameters] = useState<TransformationParameters>({
    style: 'cinematic',
    intensity: 0.5,
    resolution: '720p',
    duration: 30,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    const newValue = type === 'range' ? parseFloat(value) : value;
    
    const updatedParameters = {
      ...parameters,
      [name]: newValue,
    };
    
    setParameters(updatedParameters);
    onParametersChange(updatedParameters);
  };

  const handleStyleSelect = (style: string) => {
    const updatedParameters = {
      ...parameters,
      style,
    };
    
    setParameters(updatedParameters);
    onParametersChange(updatedParameters);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Transformation Parameters
      </h2>
      
      <div className="mb-6">
        <label className="flex items-center mb-3 text-gray-700 font-medium">
          <Image size={18} className="mr-2" />
          Style
        </label>
        <div className="grid grid-cols-3 gap-3">
          {styleOptions.map((styleOption) => (
            <button
              key={styleOption.id}
              type="button"
              disabled={isProcessing}
              className={`py-2 px-4 rounded-md transition-colors ${
                parameters.style === styleOption.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
              onClick={() => handleStyleSelect(styleOption.id)}
            >
              {styleOption.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="intensity" 
          className="flex items-center mb-3 text-gray-700 font-medium"
        >
          <Sliders size={18} className="mr-2" />
          Intensity: {parameters.intensity.toFixed(1)}
        </label>
        <input
          type="range"
          id="intensity"
          name="intensity"
          min="0"
          max="1"
          step="0.1"
          value={parameters.intensity}
          onChange={handleChange}
          disabled={isProcessing}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Subtle</span>
          <span>Strong</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="flex items-center mb-3 text-gray-700 font-medium">
          <Clock size={18} className="mr-2" />
          Duration (seconds)
        </label>
        <div className="relative">
          <input
            type="number"
            id="duration"
            name="duration"
            min="5"
            max="60"
            value={parameters.duration}
            onChange={handleChange}
            disabled={isProcessing}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Maximum duration: 60 seconds
        </p>
      </div>
      
      <div className="mb-2">
        <label className="flex items-center mb-3 text-gray-700 font-medium">
          Resolution
        </label>
        <select
          id="resolution"
          name="resolution"
          value={parameters.resolution}
          onChange={handleChange}
          disabled={isProcessing}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {resolutionOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default ParametersForm;