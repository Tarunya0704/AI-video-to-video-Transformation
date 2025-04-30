import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/mongodb";

// This route fetches transformation history
export async function GET(req: NextRequest) {
  try {
    const { db } = await createClient();
    const transformations = db.collection("transformations");
    
    // In a real app, you would filter by user ID
    // For this example, we'll return all transformations
    const history = await transformations
      .find({ status: "completed" })
      .sort({ completedAt: -1 })
      .limit(10)
      .toArray();
    
    // Map the results to match the expected format
    const formattedHistory = history.map(item => ({
      id: item.id,
      sourceVideoUrl: item.sourceVideoUrl,
      sourceVideoName: item.sourceVideoName || "Unknown",
      resultUrl: item.resultUrl,
      params: item.params,
      createdAt: item.createdAt,
      completedAt: item.completedAt,
    }));
    
    return NextResponse.json(formattedHistory);
    
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transformation history" },
      { status: 500 }
    );
  }
}