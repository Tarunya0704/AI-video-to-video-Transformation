import { Suspense } from "react";
import VideoTransformation from "@/components/VideoTransformation";
import PageHeader from "@/components/PageHeader";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <PageHeader />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <VideoTransformation />
          </Suspense>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}