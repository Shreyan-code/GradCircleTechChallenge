'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI search suggester that provides
 * relevant link recommendations based on the user's query and site content.
 *
 * - aiSearchSuggester - An async function that takes user input and returns suggestions.
 * - AiSearchSuggesterInput - The input type for the function.
 * - AiSearchSuggesterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSearchSuggesterInputSchema = z.object({
  query: z.string().describe('The user’s search query.'),
});
export type AiSearchSuggesterInput = z.infer<typeof AiSearchSuggesterInputSchema>;

const SuggestionSchema = z.object({
    title: z.string().describe('The title of the suggested page.'),
    url: z.string().describe('The relative URL of the suggested page (e.g., /health/advisor).'),
    reason: z.string().describe('A very brief explanation of why this page is relevant.'),
});

const AiSearchSuggesterOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of 3-5 relevant page suggestions.'),
});
export type AiSearchSuggesterOutput = z.infer<typeof AiSearchSuggesterOutputSchema>;

export async function aiSearchSuggester(input: AiSearchSuggesterInput): Promise<AiSearchSuggesterOutput> {
  return aiSearchSuggesterFlow(input);
}

const siteMap = `
- /feed: Main social feed with posts from other users.
- /connect: Hub for connecting with other pet owners.
- /connect/playdate-matchmaker: AI tool to find playmates for pets.
- /health: Hub for AI-powered pet health tools.
- /health/symptom-checker: AI tool to check pet symptoms.
- /health/advisor: AI chat for pet health advice.
- /adopt: Page to view pets available for adoption.
- /lost-pets: Lost and found pet reports.
- /forums: Community discussion forums.
- /events: Local pet-friendly events and meetups.
- /tips: Articles and guides for pet care.
- /messages: Direct messaging with other users.
- /profile/{userId}: User profile pages.
`;

const aiSearchSuggesterPrompt = ai.definePrompt({
  name: 'aiSearchSuggesterPrompt',
  input: { schema: AiSearchSuggesterInputSchema },
  output: { schema: AiSearchSuggesterOutputSchema },
  prompt: `You are an AI search assistant for a social network for pet owners called PetConnect.
Your goal is to suggest relevant pages within the app based on the user's search query.

Here is the sitemap of the application:
${siteMap}

User's search query: "{{{query}}}"

Based on the query, provide 3-5 relevant suggestions from the sitemap.
For each suggestion, provide a clear title, the exact URL, and a very short, compelling reason why the user might want to visit that page.
Prioritize the most relevant pages. For example, if the user types "lost dog", the "/lost-pets" page is the top priority. If they type "sick cat", suggest "/health/symptom-checker" and "/health/advisor". If they type "find friends", suggest "/connect/playdate-matchmaker".
`,
});

const aiSearchSuggesterFlow = ai.defineFlow(
  {
    name: 'aiSearchSuggesterFlow',
    inputSchema: AiSearchSuggesterInputSchema,
    outputSchema: AiSearchSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await aiSearchSuggesterPrompt(input);
    return output!;
  }
);
