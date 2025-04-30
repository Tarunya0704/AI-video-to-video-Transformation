import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/mongodb";

// This route handles uploading videos to Cloudinary
export async function POST(req: NextRequest) {
  try {
    // In a real implementation, this would upload to Cloudinary
    // For this example, we'll simulate the upload process
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a video file." },
        { status: 400 }
      );
    }
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 400 }
      );
    }
    
    // Simulate Cloudinary upload
    // In a real app, you would upload to Cloudinary using their API
    const cloudinaryUrl = `https://res.cloudinary.com/demo/video/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Store upload information in MongoDB
    const { db } = await createClient();
    const uploads = db.collection("uploads");
    
    const uploadResult = await uploads.insertOne({
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      cloudinaryUrl,
      uploadedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      url: cloudinaryUrl,
      uploadId: uploadResult.insertedId.toString(),
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}