import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/mongodb";
import { callFaiApi } from "@/lib/fai-api";

// This route handles initiating video transformations
export async function POST(req: NextRequest) {
  try {
    const { videoUrl, params } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: "No video URL provided" },
        { status: 400 }
      );
    }
    
    // Validate parameters
    if (!params.style) {
      return NextResponse.json(
        { error: "Transformation style is required" },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would call the Fai API
    // For this example, we'll simulate the API call
    const transformationId = `trans_${Date.now()}`;
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/webhook`;
    
    // Simulate API call to Fai with Hunyuan-Video Model
    const faiResponse = await callFaiApi(videoUrl, params, webhookUrl);
    
    // Store transformation request in MongoDB
    const { db } = await createClient();
    const transformations = db.collection("transformations");
    
    await transformations.insertOne({
      id: transformationId,
      sourceVideoUrl: videoUrl,
      params,
      status: "processing",
      createdAt: new Date(),
    });
    
    // For demo, simulate a successful response right away
    return NextResponse.json({
      success: true,
      id: transformationId,
      status: "processing",
    });
    
  } catch (error) {
    console.error("Transformation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate transformation" },
      { status: 500 }
    );
  }
}