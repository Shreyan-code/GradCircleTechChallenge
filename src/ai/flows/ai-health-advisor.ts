'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI health advisor that allows users to ask questions
 * about their pet's health and receive personalized advice.
 *
 * - aiHealthAdvisor - An async function that takes user input and returns the AI's response.
 * - AIHealthAdvisorInput - The input type for the aiHealthAdvisor function, including the query.
 * - AIHealthAdvisorOutput - The return type for the aiHealthAdvisor function, including the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIHealthAdvisorInputSchema = z.object({
  query: z.string().describe('The user\u2019s question about their pet\u2019s health.'),
});
export type AIHealthAdvisorInput = z.infer<typeof AIHealthAdvisorInputSchema>;

const AIHealthAdvisorOutputSchema = z.object({
  response: z.string().describe('The AI\u2019s response to the user\u2019s query.'),
});
export type AIHealthAdvisorOutput = z.infer<typeof AIHealthAdvisorOutputSchema>;

export async function aiHealthAdvisor(input: AIHealthAdvisorInput): Promise<AIHealthAdvisorOutput> {
  return aiHealthAdvisorFlow(input);
}

const aiHealthAdvisorPrompt = ai.definePrompt({
  name: 'aiHealthAdvisorPrompt',
  input: {schema: AIHealthAdvisorInputSchema},
  output: {schema: AIHealthAdvisorOutputSchema},
  prompt: `You are an AI health advisor for pets. A user will ask a question about their pet's health.

  Answer the question to the best of your ability.

  Question: {{{query}}} `,
});

const aiHealthAdvisorFlow = ai.defineFlow(
  {
    name: 'aiHealthAdvisorFlow',
    inputSchema: AIHealthAdvisorInputSchema,
    outputSchema: AIHealthAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiHealthAdvisorPrompt(input);
    return output!;
  }
);
