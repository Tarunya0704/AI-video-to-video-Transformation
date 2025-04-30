export interface VideoTransformation {
  id: string;
  sourceVideoUrl: string;
  sourceVideoName: string;
  transformedVideoUrl: string | null;
  parameters: TransformationParameters;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface TransformationParameters {
  style: string;
  intensity: number;
  resolution: string;
  duration: number;
  // Add other parameters as needed according to the Fai API
}

export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}