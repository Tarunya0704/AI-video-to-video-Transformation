import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/mongodb";
import { callFaiApi } from "@/lib/fai-api";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, params } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: "No video URL provided" },
        { status: 400 }
      );
    }
    
    if (!params.style) {
      return NextResponse.json(
        { error: "Transformation style is required" },
        { status: 400 }
      );
    }
    
    const transformationId = `trans_${Date.now()}`;
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/webhook`;
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
      resource_type: "video",
      public_id: transformationId,
    });

    // Store transformation request in MongoDB
    const { db } = await createClient();
    const transformations = db.collection("transformations");
    
    await transformations.insertOne({
      id: transformationId,
      sourceVideoUrl: videoUrl,
      sourceVideoName: params.sourceVideoName || "Untitled",
      params,
      status: "processing",
      createdAt: new Date(),
      cloudinaryUrl: uploadResponse.secure_url,
    });
    
    // For demo, simulate a successful response
    // In production, this would be handled by the webhook
    await transformations.updateOne(
      { id: transformationId },
      {
        $set: {
          status: "completed",
          resultUrl: uploadResponse.secure_url,
          completedAt: new Date(),
        }
      }
    );
    
    return NextResponse.json({
      success: true,
      id: transformationId,
      status: "processing",
      resultUrl: uploadResponse.secure_url,
    });
    
  } catch (error) {
    console.error("Transformation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate transformation" },
      { status: 500 }
    );
  }
}