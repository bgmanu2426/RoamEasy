
"use client";

import { useParams, useRouter } from 'next/navigation';
import { TripForm } from '@/components/trip-form';
import { PageHeader } from '@/components/page-header';
import { useTrips } from '@/components/providers/trip-provider';
import type { Trip } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditTripPage() {
  const params = useParams();
  const { getTripById, isLoading: tripsLoading } = useTrips();
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  const tripId = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (tripId && !tripsLoading) {
      const foundTrip = getTripById(tripId);
      setTrip(foundTrip);
    }
  }, [tripId, getTripById, tripsLoading]);

  if (tripsLoading || trip === undefined) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <div className="space-y-4 p-6 border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-10 w-1/3 rounded-md mt-6" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto">
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Trip Not Found</AlertTitle>
          <AlertDescription>
            The trip you are trying to edit does not exist.
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild className="mt-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={`Edit: ${trip.name}`}
        description="Update the details of your trip."
      />
      <TripForm trip={trip} />
    </div>
  );
}
