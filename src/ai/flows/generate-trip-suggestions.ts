// src/ai/flows/generate-trip-suggestions.ts
'use server';

/**
 * @fileOverview An AI agent that provides personalized trip suggestions based on user preferences.
 *
 * - generateTripSuggestions - A function that generates trip suggestions.
 * - GenerateTripSuggestionsInput - The input type for the generateTripSuggestions function.
 * - GenerateTripSuggestionsOutput - The return type for the generateTripSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTripSuggestionsInputSchema = z.object({
  interests: z
    .string()
    .describe('The user interests, can be a comma separated list.'),
  budget: z.string().describe('The user budget.'),
  travelStyle: z.string().describe('The user travel style.'),
  location: z.string().optional().describe('The location to generate trip suggestions for. If not specified, the suggestions can be anywhere in the world.'),
});
export type GenerateTripSuggestionsInput = z.infer<
  typeof GenerateTripSuggestionsInputSchema
>;

const GenerateTripSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of personalized trip suggestions.'),
});
export type GenerateTripSuggestionsOutput = z.infer<
  typeof GenerateTripSuggestionsOutputSchema
>;

export async function generateTripSuggestions(
  input: GenerateTripSuggestionsInput
): Promise<GenerateTripSuggestionsOutput> {
  return generateTripSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTripSuggestionsPrompt',
  input: {schema: GenerateTripSuggestionsInputSchema},
  output: {schema: GenerateTripSuggestionsOutputSchema},
  prompt: `You are a trip planning expert. You are excellent at providing travel suggestions based on user preferences such as interests, budget, and travel style.

  Interests: {{{interests}}}
  Budget: {{{budget}}}
  Travel Style: {{{travelStyle}}}
  Location: {{{location}}}

  Based on the information above, provide a list of personalized trip suggestions that are tailored to the user's preferences. Return the result as a list of strings.
  `,
});

const generateTripSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateTripSuggestionsFlow',
    inputSchema: GenerateTripSuggestionsInputSchema,
    outputSchema: GenerateTripSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
