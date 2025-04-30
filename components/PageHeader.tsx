import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

export default function PageHeader() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">AI Video Transformation</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/history">View History</a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}