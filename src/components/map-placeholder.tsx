
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon } from "lucide-react";

export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="h-full flex flex-col items-center justify-center p-6 aspect-video md:aspect-auto">
        <MapIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
        <p className="mt-4 text-sm md:text-base text-muted-foreground text-center">
          Interactive Map Area
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80 text-center">
          Location selection and route visualization will be available here.
        </p>
      </CardContent>
    </Card>
  );
}
