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
  symptoms: z.string().describe("A detailed description of the pet's symptoms."),
});
export type AiSymptomCheckerInput = z.infer<typeof AiSymptomCheckerInputSchema>;

const AiSymptomCheckerOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A markdown list of possible health conditions. Each item should be on a new line and start with `* `.'),
  recommendations: z
    .string()
    .describe('Actionable recommendations as a markdown list. It MUST include a disclaimer. Each item should be on a new line and start with `* `.'),
  urgencyLevel: z
    .string()
    .describe(
      'An assessment of the urgency level with an emoji (e.g., "High 🔴", "Medium 🟡", "Low 🟢").'
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
  prompt: `You are a friendly and empathetic AI-powered symptom checker for pets. Your tone should be helpful and reassuring, like a knowledgeable vet assistant.

A user has provided the following information about their pet:
- **Pet Type:** {{{petType}}}
- **Symptoms:** {{{symptoms}}}

Your task is to analyze this information and provide a structured response. Please populate the output fields as follows:

1.  **urgencyLevel**:
    *   Assess the urgency as "High", "Medium", or "Low".
    *   Append a relevant emoji: "High 🔴", "Medium 🟡", or "Low 🟢".

2.  **possibleConditions**:
    *   Provide a markdown list of 2-4 potential conditions.
    *   For each condition, write a brief, simple explanation (1-2 sentences). Use markdown for bolding.
    *   Example:
        * **Gastritis:** This is an inflammation of the stomach lining, often caused by eating something unusual.
        * **Food Allergy:** Some pets can develop allergies to ingredients in their food, leading to digestive upset.

3.  **recommendations**:
    *   Provide a clear, actionable markdown list of recommendations and next steps.
    *   Start with advice on what to do at home.
    *   Include clear guidance on when to contact a vet.
    *   **Crucially, end the recommendations with a friendly disclaimer, separated by a newline.**
    *   Example:
        * Monitor your pet closely for the next 12-24 hours for any changes in behavior.
        * Ensure they have access to plenty of fresh water to stay hydrated.
        * If symptoms like vomiting persist, or if your pet becomes very lethargic, you should contact your vet immediately.
        *
        * **Disclaimer:** Please remember, I'm an AI assistant, not a real vet! This advice is for informational purposes. It's always safest to consult with a qualified veterinarian for any health concerns. 🐾`,
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
