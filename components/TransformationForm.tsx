"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { VideoFile } from "@/types";
import { Loader2 } from "lucide-react";

interface TransformationFormProps {
  onSubmit: (params: any) => void;
  isProcessing: boolean;
  sourceVideo: VideoFile | null;
  onParamsChange: (params: any) => void;
}

export function TransformationForm({ 
  onSubmit, 
  isProcessing, 
  sourceVideo,
  onParamsChange
}: TransformationFormProps) {
  const [params, setParams] = useState({
    style: "cinematic",
    intensity: 70,
    enhanceQuality: true,
    stabilize: false,
    duration: 15,
  });

  const handleParamChange = (name: string, value: any) => {
    const updatedParams = { ...params, [name]: value };
    setParams(updatedParams);
    onParamsChange(updatedParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Transformation Parameters</h3>
        <p className="text-muted-foreground">
          Customize how you want your video to be transformed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              {sourceVideo && sourceVideo.url && (
                <video
                  src={sourceVideo.url}
                  className="w-full h-full object-contain"
                  controls
                />
              )}
            </div>
            <p className="text-sm text-center mt-2 text-muted-foreground">Source Video</p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="style">Transformation Style</Label>
              <Select
                value={params.style}
                onValueChange={(value) => handleParamChange("style", value)}
                disabled={isProcessing}
              >
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="3d_animation">3D Animation</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="pixel_art">Pixel Art</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="intensity">Effect Intensity</Label>
                <span className="text-sm text-muted-foreground">{params.intensity}%</span>
              </div>
              <Slider
                id="intensity"
                min={1}
                max={100}
                step={1}
                defaultValue={[params.intensity]}
                onValueChange={(value) => handleParamChange("intensity", value[0])}
                disabled={isProcessing}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Max Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={60}
                value={params.duration}
                onChange={(e) => handleParamChange("duration", parseInt(e.target.value))}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Maximum duration in seconds (longer videos may be trimmed)
              </p>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enhance-quality">Enhance Quality</Label>
              <Switch
                id="enhance-quality"
                checked={params.enhanceQuality}
                onCheckedChange={(checked) => handleParamChange("enhanceQuality", checked)}
                disabled={isProcessing}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="stabilize">Stabilize Video</Label>
              <Switch
                id="stabilize"
                checked={params.stabilize}
                onCheckedChange={(checked) => handleParamChange("stabilize", checked)}
                disabled={isProcessing}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Transform Video"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}