"use client";

import { useState, useCallback, useEffect } from "react";
import { FileVideoIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoFile } from "@/types";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  onUpload: (file: VideoFile) => void;
  currentFile: VideoFile | null;
}

export function VideoUploader({ onUpload, currentFile }: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Setup Uploadcare when component mounts
  useEffect(() => {
    // Simulate Uploadcare initialization
    // In a real app, you would initialize the Uploadcare widget here
    
    // If there's a current file, set a preview URL
    if (currentFile && currentFile.url) {
      setPreviewUrl(currentFile.url);
    }
  }, [currentFile]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  }, []);

  // Validate and process the file
  const handleFileUpload = (file: File) => {
    // Validate file type (only videos)
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, MOV, AVI).');
      return;
    }
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      alert('File size exceeds 100MB limit.');
      return;
    }
    
    // Start upload simulation
    setIsUploading(true);
    setLocalFile(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create a VideoFile object and pass to parent
        const videoFile: VideoFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: objectUrl, // In real app, this would be the Cloudinary URL
          uploadId: Date.now().toString(), // Simulate an upload ID
        };
        
        onUpload(videoFile);
      }
    }, 100);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setLocalFile(null);
    setPreviewUrl(null);
    onUpload({
      name: "",
      size: 0,
      type: "",
      url: "",
      uploadId: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Upload Video</h3>
        <p className="text-muted-foreground">
          Upload the video you want to transform. Supported formats: MP4, WebM, MOV, AVI (max 100MB).
        </p>
      </div>
      
      {!currentFile || !previewUrl ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-background p-4 rounded-full">
              <UploadCloudIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Drag & drop your video here</h4>
              <p className="text-sm text-muted-foreground">
                Or click to browse from your computer
              </p>
            </div>
            <Button size="sm" asChild>
              <label>
                Browse
                <input
                  type="file"
                  className="sr-only"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary rounded-md p-2">
                        <FileVideoIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{localFile?.name || currentFile?.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {localFile?.size 
                            ? `${(localFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : currentFile?.size 
                              ? `${(currentFile.size / (1024 * 1024)).toFixed(2)} MB`
                              : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="rounded-md overflow-hidden bg-black aspect-video">
                    <video
                      src={previewUrl || undefined}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}