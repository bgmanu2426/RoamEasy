
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="h-full flex flex-col items-center justify-center p-0 aspect-video md:aspect-auto overflow-hidden">
        <Image
          src="https://placehold.co/1200x600.png?text=World+Map+Overview"
          alt="World Map Overview"
          width={1200}
          height={600}
          className="w-full h-full object-cover"
          data-ai-hint="world map"
          priority={false} // Optional: set to true if this is LCP on a specific page
        />
        {/* 
          Removed the text overlay as the image now serves as the placeholder.
          If specific text is still needed, it can be re-added here or within the Card.
        */}
      </CardContent>
    </Card>
  );
}
