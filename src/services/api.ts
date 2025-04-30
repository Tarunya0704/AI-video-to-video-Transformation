import axios from 'axios';
import { VideoTransformation, TransformationParameters, ApiResponse, UploadResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const FAI_API_URL = import.meta.env.VITE_FAI_API_URL;
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadToCloudinary = async (videoFile: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('upload_preset', 'video_transformations');

  const response = await axios.post(CLOUDINARY_URL, formData);
  
  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
    format: response.data.format,
  };
};

export const transformVideo = async (
  sourceUrl: string,
  sourceVideoName: string,
  parameters: TransformationParameters
): Promise<ApiResponse<VideoTransformation>> => {
  try {
    const response = await api.post<ApiResponse<VideoTransformation>>('/transform', {
      sourceUrl,
      sourceVideoName,
      parameters,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to transform video',
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred',
    };
  }
};

export const getVideoHistory = async (): Promise<ApiResponse<VideoTransformation[]>> => {
  try {
    const response = await api.get<ApiResponse<VideoTransformation[]>>('/history');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch video history',
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred',
    };
  }
};

export const getTransformationStatus = async (id: string): Promise<ApiResponse<VideoTransformation>> => {
  try {
    const response = await api.get<ApiResponse<VideoTransformation>>(`/transform/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get transformation status',
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred',
    };
  }
};