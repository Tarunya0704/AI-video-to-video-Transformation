"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoUploader } from "@/components/VideoUploader";
import { TransformationForm } from "@/components/TransformationForm";
import { TransformationResult } from "@/components/TransformationResult";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { transformVideo } from "@/lib/api";
import { TransformationStatus, VideoFile } from "@/types";

export default function VideoTransformation() {
  const [sourceVideo, setSourceVideo] = useState<VideoFile | null>(null);
  const [transformationParams, setTransformationParams] = useState({});
  const [transformationStatus, setTransformationStatus] = useState<TransformationStatus>({
    status: "idle",
    message: "",
    resultUrl: "",
    id: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleVideoUpload = (file: VideoFile) => {
    setSourceVideo(file);
    setTransformationStatus({
      status: "idle",
      message: "",
      resultUrl: "",
      id: "",
    });
  };

  const handleTransformSubmit = async (params: any) => {
    if (!sourceVideo) {
      toast({
        title: "Error",
        description: "Please upload a video first",
        variant: "destructive",
      });
      return;
    }

    try {
      setTransformationStatus({
        status: "processing",
        message: "Uploading video...",
        resultUrl: "",
        id: "",
      });

      const result = await transformVideo(sourceVideo, params);
      
      setTransformationStatus({
        status: "success",
        message: "Transformation complete!",
        resultUrl: result.resultUrl,
        id: result.id,
      });

      toast({
        title: "Success",
        description: "Video has been successfully transformed!",
      });
    } catch (error) {
      console.error("Transformation error:", error);
      setTransformationStatus({
        status: "error",
        message: "Failed to transform video. Please try again.",
        resultUrl: "",
        id: "",
      });

      toast({
        title: "Error",
        description: "Failed to transform video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const activeTab = sourceVideo ? (transformationStatus.status === "success" ? "result" : "transform") : "upload";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">AI Video Transformation</h2>
        <p className="text-muted-foreground">
          Transform your videos using advanced AI technology. Upload a video, customize the transformation parameters, and get a stylized result.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="transform" disabled={!sourceVideo}>Transform</TabsTrigger>
              <TabsTrigger value="result" disabled={transformationStatus.status !== "success"}>Result</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="py-4">
              <VideoUploader onUpload={handleVideoUpload} currentFile={sourceVideo} />
            </TabsContent>
            
            <TabsContent value="transform" className="py-4">
              <TransformationForm 
                onSubmit={handleTransformSubmit} 
                isProcessing={transformationStatus.status === "processing"}
                sourceVideo={sourceVideo}
                onParamsChange={setTransformationParams}
              />
            </TabsContent>
            
            <TabsContent value="result" className="py-4">
              <TransformationResult 
                transformationStatus={transformationStatus}
                sourceVideo={sourceVideo}
                transformationParams={transformationParams}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}