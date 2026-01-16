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
  response: z.string().describe('The AI\u2019s response to the user\u2019s query, formatted in markdown with bullet points and emojis.'),
});
export type AIHealthAdvisorOutput = z.infer<typeof AIHealthAdvisorOutputSchema>;

export async function aiHealthAdvisor(input: AIHealthAdvisorInput): Promise<AIHealthAdvisorOutput> {
  return aiHealthAdvisorFlow(input);
}

const aiHealthAdvisorPrompt = ai.definePrompt({
  name: 'aiHealthAdvisorPrompt',
  input: {schema: AIHealthAdvisorInputSchema},
  output: {schema: AIHealthAdvisorOutputSchema},
  prompt: `You are a friendly and knowledgeable AI pet health advisor. Your name is "PetConnect AI". Your tone should be helpful, empathetic, and reassuring, like a friendly vet assistant.

A user is asking a question about their pet. Your task is to provide a clear, structured, and helpful response.

Here is the user's question:
"{{{query}}}"

Please structure your response as follows:
1.  **Start with a friendly greeting.**
2.  **Answer the user's question directly.** Break down your answer into easy-to-read bullet points or numbered lists using markdown. Use emojis to make the points more engaging.
3.  **Provide actionable tips or next steps.**
4.  **ALWAYS end with a friendly disclaimer.** Remind the user that you are an AI assistant and that they should consult a qualified veterinarian for any serious health concerns.

Example Response Structure:
"Hello there! I can certainly help you with that. Here are a few points about [Topic]:

*   💡 **Point 1:** Explanation...
*   🐾 **Point 2:** Explanation...

Here are a few things you can do:
1.  **Actionable Tip 1:** ...
2.  **Actionable Tip 2:** ...

Please remember, I'm an AI assistant and not a substitute for a real veterinarian. For any serious health issues, it's always best to consult with a professional. 🩺"`,
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
