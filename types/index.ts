// Video file type
export interface VideoFile {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadId: string;
}

// Transformation status type
export interface TransformationStatus {
  status: "idle" | "processing" | "success" | "error";
  message: string;
  resultUrl: string;
  id: string;
}

// Transformation history item type
export interface TransformationHistory {
  id: string;
  sourceVideoUrl: string;
  sourceVideoName: string;
  resultUrl: string;
  params: {
    style: string;
    intensity: number;
    enhanceQuality: boolean;
    stabilize: boolean;
    duration: number;
    [key: string]: any;
  };
  createdAt: string;
  completedAt: string;
}