'use server';

/**
 * @fileOverview Summarizes trip details for easy sharing.
 *
 * - summarizeTripDetails - A function that summarizes trip details.
 * - SummarizeTripDetailsInput - The input type for the summarizeTripDetails function.
 * - SummarizeTripDetailsOutput - The return type for the summarizeTripDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTripDetailsInputSchema = z.object({
  destinations: z
    .array(z.string())
    .describe('List of destinations in the trip.'),
  activities: z
    .array(z.string())
    .describe('List of activities planned for the trip.'),
  notes: z.string().describe('User notes about the trip.'),
});
export type SummarizeTripDetailsInput = z.infer<
  typeof SummarizeTripDetailsInputSchema
>;

const SummarizeTripDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the trip details.'),
});
export type SummarizeTripDetailsOutput = z.infer<
  typeof SummarizeTripDetailsOutputSchema
>;

export async function summarizeTripDetails(
  input: SummarizeTripDetailsInput
): Promise<SummarizeTripDetailsOutput> {
  return summarizeTripDetailsFlow(input);
}

const summarizeTripDetailsPrompt = ai.definePrompt({
  name: 'summarizeTripDetailsPrompt',
  input: {schema: SummarizeTripDetailsInputSchema},
  output: {schema: SummarizeTripDetailsOutputSchema},
  prompt: `You are a helpful travel assistant. Please summarize the following trip details in a concise and easy-to-share format:

Destinations: {{#each destinations}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Activities: {{#each activities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Notes: {{{notes}}}

Summary:`,
});

const summarizeTripDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeTripDetailsFlow',
    inputSchema: SummarizeTripDetailsInputSchema,
    outputSchema: SummarizeTripDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeTripDetailsPrompt(input);
    return output!;
  }
);
