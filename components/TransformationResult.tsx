"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransformationStatus, VideoFile } from "@/types";
import { 
  ArrowDownIcon, 
  CheckCircleIcon, 
  ClipboardCopyIcon, 
  RefreshCwIcon, 
  ShareIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransformationResultProps {
  transformationStatus: TransformationStatus;
  sourceVideo: VideoFile | null;
  transformationParams: any;
}

export function TransformationResult({
  transformationStatus,
  sourceVideo,
  transformationParams,
}: TransformationResultProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (transformationStatus.resultUrl) {
      navigator.clipboard.writeText(transformationStatus.resultUrl);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Video link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (transformationStatus.resultUrl) {
      const a = document.createElement("a");
      a.href = transformationStatus.resultUrl;
      a.download = `transformed-video-${transformationStatus.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    if (transformationStatus.resultUrl && navigator.share) {
      try {
        await navigator.share({
          title: "AI Transformed Video",
          text: "Check out my AI transformed video!",
          url: transformationStatus.resultUrl,
        });
        toast({
          title: "Shared",
          description: "Video shared successfully",
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback if Web Share API is not available
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold">Transformation Result</h3>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Your video has been successfully transformed. You can preview, download, or share it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="rounded-md overflow-hidden bg-black aspect-video">
              {transformationStatus.resultUrl && (
                <video
                  src={transformationStatus.resultUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <ClipboardCopyIcon className="h-4 w-4 mr-1" />
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <ShareIcon className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Transformation Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Source Video:</dt>
                  <dd className="text-sm font-medium">{sourceVideo?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Style:</dt>
                  <dd className="text-sm font-medium capitalize">{transformationParams.style}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Intensity:</dt>
                  <dd className="text-sm font-medium">{transformationParams.intensity}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Max Duration:</dt>
                  <dd className="text-sm font-medium">{transformationParams.duration} seconds</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Quality Enhanced:</dt>
                  <dd className="text-sm font-medium">{transformationParams.enhanceQuality ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Stabilized:</dt>
                  <dd className="text-sm font-medium">{transformationParams.stabilize ? "Yes" : "No"}</dd>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Transformation ID:</dt>
                  <dd className="text-sm font-mono">{transformationStatus.id}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Create New Transformation
          </Button>
        </div>
      </div>
    </div>
  );
}