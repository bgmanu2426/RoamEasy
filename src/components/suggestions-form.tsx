
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2, AlertTriangle, Sparkles, Info, ThumbsUp } from 'lucide-react';
import { generateTripSuggestions } from '@/ai/flows/generate-trip-suggestions';
import type { SuggestionFilters } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const suggestionSchema = z.object({
  interests: z.string().min(3, "Please describe your interests."),
  budget: z.string().min(1, "Please select a budget."),
  travelStyle: z.string().min(1, "Please select a travel style."),
  location: z.string().optional(),
});

const budgetOptions = ["economy", "moderate", "luxury", "flexible"];
const travelStyleOptions = ["adventure", "relaxation", "cultural", "family-friendly", "solo", "romantic"];

export function SuggestionsForm() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors } } = useForm<SuggestionFilters>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      interests: '',
      budget: '',
      travelStyle: '',
      location: '',
    }
  });

  const onSubmit: SubmitHandler<SuggestionFilters> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await generateTripSuggestions(data);
      setSuggestions(result.suggestions);
      if (result.suggestions.length === 0) {
        toast({
            title: "No specific suggestions found",
            description: "Try broadening your criteria or trying different keywords.",
            variant: "default",
        });
      } else {
        toast({
            title: "Suggestions Generated!",
            description: "Here are some ideas for your next trip.",
            variant: "default",
        });
      }
    } catch (e) {
      console.error("Failed to generate suggestions:", e);
      setError("Sorry, we couldn't generate suggestions at this time. Please try again later.");
      toast({
        title: "Error Generating Suggestions",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            Smart Trip Suggester
          </CardTitle>
          <CardDescription>
            Tell us your preferences, and our AI will craft personalized travel ideas for you!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="interests">Your Interests</Label>
              <Textarea
                id="interests"
                placeholder="e.g., hiking, historical sites, beaches, cuisine"
                {...register("interests")}
                className="mt-1"
              />
              {errors.interests && <p className="text-sm text-destructive mt-1">{errors.interests.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="budget" className="mt-1">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>}
              </div>

              <div>
                <Label htmlFor="travelStyle">Travel Style</Label>
                 <Controller
                  name="travelStyle"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="travelStyle" className="mt-1">
                        <SelectValue placeholder="Select your travel style" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelStyleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.travelStyle && <p className="text-sm text-destructive mt-1">{errors.travelStyle.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Preferred Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., Southeast Asia, Italy, National Parks"
                {...register("location")}
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Here are your personalized suggestions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="relative p-0">
                    <Image
                        src={`https://placehold.co/600x400.png?text=${encodeURIComponent(suggestion.substring(0,20))}`}
                        alt={`Suggestion ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-40 object-cover rounded-t-lg"
                        data-ai-hint="travel discovery"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <p className="text-sm">{suggestion}</p>
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Great Choice!", description: "You can now create a new trip based on this idea."})}>
                        <ThumbsUp className="mr-2 h-4 w-4"/> I like this!
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      { !isLoading && !error && suggestions.length === 0 && (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Ready for adventure?</AlertTitle>
            <AlertDescription>
            Fill out the form above and let our AI inspire your next journey!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
