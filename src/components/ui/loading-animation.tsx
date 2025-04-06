
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

export function LoadingAnimation({ 
  className, 
  size = "md", 
  text, 
  fullPage = false 
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className={cn("text-primary animate-spin", sizeClasses[size], className)} />
            <div className="absolute -inset-1 rounded-full blur-sm bg-primary/20 animate-pulse" />
          </div>
          {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-2">
      <div className="relative">
        <Loader2 className={cn("text-primary animate-spin", sizeClasses[size], className)} />
        <div className="absolute -inset-1 rounded-full blur-sm bg-primary/10 animate-pulse" />
      </div>
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );
}
