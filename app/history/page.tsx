"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ThemeProvider from "@/components/ThemeProvider";
import { TransformationHistory } from "@/types";
import { fetchHistory } from "@/lib/api";

export default function HistoryPage() {
  const [history, setHistory] = useState<TransformationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Transformation History</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Transformation History</h2>
              <p className="text-muted-foreground">
                View all your previous video transformations.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No transformation history yet.</p>
                  <Button onClick={() => router.push("/")}>Create Your First Transformation</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

function HistoryItem({ item }: { item: TransformationHistory }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {item.sourceVideoName || "Untitled Transformation"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {format(new Date(item.createdAt), "PPP p")}
        </p>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
          <video 
            src={item.resultUrl} 
            className="w-full h-full object-contain"
            controls
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Style:</span>
            <span className="font-medium capitalize">{item.params.style}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Intensity:</span>
            <span className="font-medium">{item.params.intensity}%</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-xs">{item.id.substring(0, 8)}...</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open(item.resultUrl, "_blank")}
        >
          View Full Video
        </Button>
      </CardFooter>
    </Card>
  );
}