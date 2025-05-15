
"use client";

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { TripCard } from '@/components/trip-card';
import { MapPlaceholder } from '@/components/map-placeholder';
import { useTrips } from '@/components/providers/trip-provider';
import Link from 'next/link';
import { PlusCircle, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { trips, isLoading } = useTrips();

  return (
    <div className="space-y-8">
      <PageHeader title="My Trips Dashboard" description="Oversee your adventures and plan new ones.">
        <Button asChild>
          <Link href="/trips/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Trip
          </Link>
        </Button>
      </PageHeader>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Upcoming & Recent Trips</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Trips Yet!</AlertTitle>
            <AlertDescription>
              Start planning your next adventure by creating a new trip or getting some smart suggestions.
            </AlertDescription>
          </Alert>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">World Map Overview</h2>
        <MapPlaceholder className="h-[400px] md:h-[500px]" />
      </section>
    </div>
  );
}
