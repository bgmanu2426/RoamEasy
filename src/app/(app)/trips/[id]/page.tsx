
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTrips } from '@/components/providers/trip-provider';
import type { Trip } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { MapPlaceholder } from '@/components/map-placeholder';
import { CalendarDays, MapPin, Edit3, ListChecks, FileText, ArrowLeft, Loader2, AlertTriangle, Wand2 } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { summarizeTripDetails } from '@/ai/flows/summarize-trip-details';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getTripById, setAiSummary, isLoading: tripsLoading } = useTrips();
  const { toast } = useToast();

  const [trip, setTrip] = useState<Trip | null | undefined>(undefined); // undefined for loading, null for not found
  const [isSummarizing, setIsSummarizing] = useState(false);

  const tripId = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (tripId && !tripsLoading) {
      const foundTrip = getTripById(tripId);
      setTrip(foundTrip);
    }
  }, [tripId, getTripById, tripsLoading]);

  const handleGenerateSummary = async () => {
    if (!trip || !trip.destinations?.length || !trip.activities?.length) {
       toast({
        title: "Cannot Generate Summary",
        description: "Please add destinations and activities to the trip first.",
        variant: "destructive"
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const summaryOutput = await summarizeTripDetails({
        destinations: trip.destinations,
        activities: trip.activities,
        notes: trip.notes || '',
      });
      if (summaryOutput.summary) {
        setAiSummary(trip.id, summaryOutput.summary);
        setTrip(prev => prev ? { ...prev, aiSummary: summaryOutput.summary } : null); // Update local state
        toast({
          title: "Summary Generated!",
          description: "AI-powered summary has been added to your trip.",
        });
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        title: "Error Generating Summary",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  if (tripsLoading || trip === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Card>
          <CardHeader><Skeleton className="h-48 w-full rounded-t-lg" /></CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24 rounded-md" /></CardFooter>
        </Card>
      </div>
    );
  }

  if (!trip) {
    return (
       <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Trip Not Found</AlertTitle>
          <AlertDescription>
            The trip you are looking for does not exist or may have been deleted.
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/dashboard">Go to Dashboard</Link></Button>
          </AlertDescription>
        </Alert>
    );
  }
  
  const primaryDestination = trip.destinations && trip.destinations.length > 0 ? trip.destinations[0] : 'N/A';

  return (
    <div className="space-y-8">
      <PageHeader title={trip.name} description={`Details for your trip to ${primaryDestination}`}>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={`/trips/${trip.id}/edit`}><Edit3 className="mr-2 h-4 w-4" /> Edit Trip</Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg overflow-hidden">
            {trip.imageUrl && (
              <CardHeader className="p-0">
                <Image
                  src={trip.imageUrl}
                  alt={`Image for ${trip.name}`}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                  data-ai-hint="travel destination"
                />
              </CardHeader>
            )}
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Destinations</h3>
                {trip.destinations && trip.destinations.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {trip.destinations.map((dest, i) => <li key={i} className="text-sm">{dest}</li>)}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">No destinations added yet.</p>}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary" /> Activities</h3>
                {trip.activities && trip.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {trip.activities.map((activity, i) => <Badge key={i} variant="secondary">{activity}</Badge>)}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No activities planned yet.</p>}
              </div>

              {trip.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Notes</h3>
                  <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{trip.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary"/> AI Trip Summary
              </CardTitle>
              <CardDescription>A concise overview of your trip, generated by AI.</CardDescription>
            </CardHeader>
            <CardContent>
              {trip.aiSummary ? (
                <p className="text-sm whitespace-pre-wrap">{trip.aiSummary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No AI summary generated yet. Click the button to create one.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateSummary} disabled={isSummarizing || !trip.destinations?.length || !trip.activities?.length} className="w-full md:w-auto">
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {trip.aiSummary ? 'Regenerate Summary' : 'Generate Summary'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <MapPlaceholder className="h-[300px]" />
          {/* Potentially other related info cards here */}
        </div>
      </div>
    </div>
  );
}
