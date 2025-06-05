import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GreenProgressProps {
  value: number;
  className?: string;
}

export default function GreenProgress({ value, className }: GreenProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <Progress 
        value={value} 
        className="h-2 bg-gray-100" 
        style={{ 
          "--progress-foreground": "#16a34a" // green-600 color
        } as React.CSSProperties} 
      />
    </div>
  );
}