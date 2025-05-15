
"use client";

import type { Trip } from '@/types';
import { useForm, type SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTrips } from '@/components/providers/trip-provider';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const tripFormSchema = z.object({
  name: z.string().min(3, "Trip name must be at least 3 characters."),
  destinations: z.array(z.string().min(1, "Destination cannot be empty.")).min(1, "At least one destination is required."),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  activities: z.array(z.string().min(1, "Activity cannot be empty.")).optional(),
  imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  budget: z.string().optional(), 
  travelStyle: z.string().optional(), 
  interests: z.string().optional(), 
});

type TripFormData = z.infer<typeof tripFormSchema>;

interface TripFormProps {
  trip?: Trip; 
}

export function TripForm({ trip }: TripFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTrip, updateTrip } = useTrips();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);

  const getInitialValues = () => {
    if (trip) {
      return {
        ...trip,
        startDate: trip.startDate ? new Date(trip.startDate) : undefined,
        endDate: trip.endDate ? new Date(trip.endDate) : undefined,
        destinations: trip.destinations && trip.destinations.length > 0 ? trip.destinations : [''],
        activities: trip.activities && trip.activities.length > 0 ? trip.activities : [''],
      };
    }

    // Pre-fill from URL parameters if creating a new trip
    const suggestedName = searchParams.get('name');
    const suggestedDestination = searchParams.get('destination');
    
    return {
      name: suggestedName || '',
      destinations: suggestedDestination ? [suggestedDestination] : [''],
      activities: [''],
      notes: '',
      imageUrl: '',
      budget: '',
      travelStyle: '',
      interests: '',
    };
  };

  const { register, handleSubmit, control, formState: { errors }, watch, reset } = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: getInitialValues(),
  });
  
  // Effect to update form if query params change (e.g., user navigates again with new suggestion)
  useEffect(() => {
    if (!trip) { // Only for new trips
      const suggestedName = searchParams.get('name');
      const suggestedDestination = searchParams.get('destination');
      const currentDefaults = getInitialValues(); // to preserve other defaults
      
      const newDefaults = {
        ...currentDefaults,
        name: suggestedName || currentDefaults.name,
        destinations: suggestedDestination ? [suggestedDestination] : currentDefaults.destinations,
      };
      reset(newDefaults); // Reset form with new default values
    }
  }, [searchParams, trip, reset]);


  const { fields: destinationFields, append: appendDestination, remove: removeDestination } = useFieldArray({
    control,
    name: "destinations",
  });

  const { fields: activityFields, append: appendActivity, remove: removeActivity } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit: SubmitHandler<TripFormData> = async (data) => {
    setIsSaving(true);
    try {
      const tripDataPayload = {
        ...data,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        // Filter out empty strings from activities and destinations before saving
        activities: data.activities?.filter(act => act.trim() !== '') || [],
        destinations: data.destinations.filter(dest => dest.trim() !== ''),
      };

      if (trip) {
        updateTrip({ ...trip, ...tripDataPayload });
        toast({ title: "Trip Updated!", description: `"${data.name}" has been successfully updated.` });
        router.push(`/trips/${trip.id}`);
      } else {
        const newTrip = addTrip(tripDataPayload);
        toast({ title: "Trip Created!", description: `"${data.name}" has been successfully created.` });
        router.push(`/trips/${newTrip.id}`);
      }
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast({ title: "Error", description: "Failed to save trip. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const watchedImageUrl = watch("imageUrl");

  return (
    <Card className="shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">{trip ? 'Edit Trip' : 'Create New Trip'}</CardTitle>
          <CardDescription>{trip ? `Update the details for "${trip.name}".` : "Fill in the details to plan your next adventure."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Trip Name</Label>
            <Input id="name" {...register("name")} className="mt-1" placeholder="e.g., Summer Vacation in Italy"/>
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Destinations</Label>
            {destinationFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mt-1">
                <Input {...register(`destinations.${index}`)} placeholder={`Destination ${index + 1}`}/>
                {destinationFields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDestination(index)} aria-label="Remove destination">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
             {errors.destinations && <p className="text-sm text-destructive mt-1">{errors.destinations.message || (errors.destinations as any)?.root?.message}</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => appendDestination('')} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Destination
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? formatDate(field.value.toISOString()) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsStartDatePopoverOpen(false);
                        }} 
                        initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Popover open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? formatDate(field.value.toISOString()) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsEndDatePopoverOpen(false);
                        }} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>}
            </div>
          </div>
          
          <div>
            <Label>Activities (Optional)</Label>
            {activityFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mt-1">
                <Input {...register(`activities.${index}`)} placeholder={`Activity ${index + 1} (e.g., Museum visit, Hiking trail)`} />
                {activityFields.length > 0 && ( 
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeActivity(index)} aria-label="Remove activity">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendActivity('')} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
            </Button>
             {errors.activities && <p className="text-sm text-destructive mt-1">{errors.activities.message || (errors.activities as any)?.root?.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" {...register("notes")} className="mt-1" placeholder="Any additional details, booking references, etc."/>
            {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register("imageUrl")} className="mt-1" placeholder="https://placehold.co/600x400.png"/>
            {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            {watchedImageUrl && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img src={watchedImageUrl} alt="Trip preview" className="max-h-48 w-full object-cover" />
              </div>
            )}
             {!watchedImageUrl && (
                <div className="mt-2 rounded-md overflow-hidden bg-muted flex items-center justify-center h-48">
                    <p className="text-muted-foreground text-sm">No image URL provided. A default will be used.</p>
                </div>
            )}
          </div>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {trip ? 'Save Changes' : 'Create Trip'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
