"use client";

import { VideoFile, TransformationHistory } from "@/types";

// Simulated API functions for frontend use

export async function uploadVideo(file: File): Promise<VideoFile> {
  // In a real app, this would upload the file using Uploadcare,
  // then call our API to store in Cloudinary
  
  // For demo purposes, we'll simulate the upload
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    // In a real app, you'd make this API call
    // const response = await fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // });
    // const data = await response.json();
    
    // For demo, create a simulated response
    const simulatedResponse = {
      success: true,
      url: URL.createObjectURL(file),
      uploadId: `upload_${Date.now()}`,
    };
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: simulatedResponse.url,
      uploadId: simulatedResponse.uploadId,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload video");
  }
}

export async function transformVideo(video: VideoFile, params: any): Promise<any> {
  // In a real app, this would call our API to initiate the transformation
  
  try {
    // In a real app, you'd make this API call
    // const response = await fetch("/api/transform", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     videoUrl: video.url,
    //     params,
    //   }),
    // });
    // const data = await response.json();
    
    // For demo, simulate processing delay and success
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate a successful transformation response
    const simulatedResponse = {
      success: true,
      id: `trans_${Date.now()}`,
      resultUrl: video.url, // In a real app, this would be a different URL
    };
    
    return {
      status: "success",
      id: simulatedResponse.id,
      resultUrl: simulatedResponse.resultUrl,
    };
  } catch (error) {
    console.error("Transformation error:", error);
    throw new Error("Failed to transform video");
  }
}

export async function fetchHistory(): Promise<TransformationHistory[]> {
  // In a real app, this would fetch from our API
  
  try {
    // In a real app, you'd make this API call
    // const response = await fetch("/api/history");
    // const data = await response.json();
    
    // For demo, create simulated history data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const styles = ["cinematic", "anime", "3d_animation", "watercolor", "pixel_art"];
    
    // Generate 5 sample history items
    const simulatedHistory = Array.from({ length: 5 }, (_, i) => ({
      id: `trans_${Date.now() - i * 100000}`,
      sourceVideoUrl: `https://res.cloudinary.com/demo/video/upload/v1/sample_video_${i + 1}.mp4`,
      sourceVideoName: `sample_video_${i + 1}.mp4`,
      resultUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      params: {
        style: styles[i % styles.length],
        intensity: 70 + (i * 5) % 30,
        enhanceQuality: i % 2 === 0,
        stabilize: i % 3 === 0,
        duration: 15,
      },
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      completedAt: new Date(Date.now() - i * 3600000 + 300000).toISOString(),
    }));
    
    return simulatedHistory;
  } catch (error) {
    console.error("History fetch error:", error);
    throw new Error("Failed to fetch transformation history");
  }
}