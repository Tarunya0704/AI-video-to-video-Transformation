import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// This route handles webhooks from the Fai API
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate webhook data
    if (!data.transformationId || !data.resultUrl) {
      return NextResponse.json(
        { error: "Invalid webhook data" },
        { status: 400 }
      );
    }
    
    // Update transformation status in MongoDB
    const { db } = await createClient();
    const transformations = db.collection("transformations");
    
    await transformations.updateOne(
      { id: data.transformationId },
      { 
        $set: {
          status: "completed",
          resultUrl: data.resultUrl,
          completedAt: new Date(),
        }
      }
    );
    
    // For a real implementation, you might want to:
    // 1. Upload the result video to Cloudinary
    // 2. Store the Cloudinary URL
    // 3. Notify the user (via WebSockets, etc.)
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}