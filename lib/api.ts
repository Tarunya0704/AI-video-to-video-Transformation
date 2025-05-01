"use client";

import { VideoFile, TransformationHistory } from "@/types";

export async function uploadVideo(file: File): Promise<VideoFile> {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    
    const data = await response.json();
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: data.url,
      uploadId: data.uploadId,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload video");
  }
}

export async function transformVideo(video: VideoFile, params: any): Promise<any> {
  try {
    const response = await fetch("/api/transform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl: video.url,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error("Transformation failed");
    }

    const data = await response.json();
    
    return {
      status: "success",
      id: data.id,
      resultUrl: data.resultUrl || video.url,
    };
  } catch (error) {
    console.error("Transformation error:", error);
    throw new Error("Failed to transform video");
  }
}

export async function fetchHistory(): Promise<TransformationHistory[]> {
  try {
    const response = await fetch("/api/history");
    
    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("History fetch error:", error);
    throw new Error("Failed to fetch transformation history");
  }
}