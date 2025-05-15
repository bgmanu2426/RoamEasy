
"use client";

import type { Trip } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Edit3, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTrips } from '@/components/providers/trip-provider';
import { useToast } from '@/hooks/use-toast';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const { deleteTrip } = useTrips();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteTrip(trip.id);
    toast({
      title: "Trip Deleted",
      description: `"${trip.name}" has been successfully deleted.`,
    });
  };
  
  const primaryDestination = trip.destinations && trip.destinations.length > 0 ? trip.destinations[0] : 'Multiple locations';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={trip.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(trip.name)}`}
          alt={`Image for ${trip.name}`}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint="travel landscape"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <CardTitle className="text-xl font-semibold text-white">{trip.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{primaryDestination}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
        {trip.aiSummary && (
           <CardDescription className="mt-3 text-xs line-clamp-2">{trip.aiSummary}</CardDescription>
        )}
      </CardContent>
      <CardFooter className="p-4 flex flex-wrap gap-2 justify-end border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/trips/${trip.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/trips/${trip.id}/edit`}>
            <Edit3 className="mr-1 h-4 w-4" /> Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the trip
                "{trip.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
