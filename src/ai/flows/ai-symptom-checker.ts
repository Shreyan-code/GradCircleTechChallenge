// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI-powered symptom checker for pets.
 *
 * - aiSymptomChecker - A function that handles the symptom checking process.
 * - AiSymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AiSymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSymptomCheckerInputSchema = z.object({
  petType: z.string().describe('The type of pet (e.g., dog, cat).'),
  symptoms: z.string().describe('A detailed description of the pet\'s symptoms.'),
});
export type AiSymptomCheckerInput = z.infer<typeof AiSymptomCheckerInputSchema>;

const AiSymptomCheckerOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A list of possible health conditions based on the symptoms.'),
  recommendations: z
    .string()
    .describe('Recommendations for addressing the symptoms and potential conditions.'),
  urgencyLevel: z
    .string()
    .describe(
      'An assessment of the urgency level (e.g., high, medium, low) for seeking veterinary care.'
    ),
});
export type AiSymptomCheckerOutput = z.infer<typeof AiSymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AiSymptomCheckerInput): Promise<AiSymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AiSymptomCheckerInputSchema},
  output: {schema: AiSymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker for pets. Based on the provided symptoms and pet type, you will provide possible conditions, recommendations, and an urgency level for seeking veterinary care.

Pet Type: {{{petType}}}
Symptoms: {{{symptoms}}}

Respond in a structured format, providing a list of possible conditions, clear recommendations, and an assessment of the urgency level (high, medium, or low). Use a markdown list format.

**Possible Conditions:**
{{possibleConditions}}

**Recommendations:**
{{recommendations}}

**Urgency Level:**
{{urgencyLevel}}`,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AiSymptomCheckerInputSchema,
    outputSchema: AiSymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
