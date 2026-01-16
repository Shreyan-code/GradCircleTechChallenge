'use server';

/**
 * @fileOverview Genkit flows for generating pet care tips.
 *
 * - aiTipOfTheDay - Generates a random, helpful pet care tip.
 * - AITipOfTheDayOutput - The return type for the tip of the day.
 * - aiGeneratedTip - Generates a tip and resources based on a specific topic.
 * - AIGeneratedTipInput - Input for the generated tip.
 * - AIGeneratedTipOutput - Output for the generated tip.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Tip of the Day Flow
const AITipOfTheDayOutputSchema = z.object({
  tip: z.string().describe('A helpful, concise pet care tip of the day.'),
});
export type AITipOfTheDayOutput = z.infer<typeof AITipOfTheDayOutputSchema>;

export async function aiTipOfTheDay(): Promise<AITipOfTheDayOutput> {
  return aiTipOfTheDayFlow();
}

const tipOfTheDayPrompt = ai.definePrompt({
  name: 'aiTipOfTheDayPrompt',
  output: { schema: AITipOfTheDayOutputSchema },
  prompt: `You are a friendly and knowledgeable veterinary assistant. Generate a single, interesting, and helpful pet care tip of the day. The tip should be applicable to general pet owners (dogs or cats). Make it concise and easy to understand.`,
});

const aiTipOfTheDayFlow = ai.defineFlow(
  {
    name: 'aiTipOfTheDayFlow',
    outputSchema: AITipOfTheDayOutputSchema,
  },
  async () => {
    const { output } = await tipOfTheDayPrompt({});
    return output!;
  }
);


// Generated Tip by Topic Flow
const AIGeneratedTipInputSchema = z.object({
  topic: z.string().describe('The topic for the pet care tip (e.g., Nutrition, Training, Grooming).'),
});
export type AIGeneratedTipInput = z.infer<typeof AIGeneratedTipInputSchema>;

const ResourceSchema = z.object({
    title: z.string().describe('The title of the external resource.'),
    url: z.string().url().describe('The full URL of the external resource.'),
});

const AIGeneratedTipOutputSchema = z.object({
  tip: z.string().describe('A detailed, helpful tip about the specified topic.'),
  resources: z.array(ResourceSchema).describe('A list of 1-2 relevant, high-quality external web links for further reading.'),
});
export type AIGeneratedTipOutput = z.infer<typeof AIGeneratedTipOutputSchema>;

export async function aiGeneratedTip(input: AIGeneratedTipInput): Promise<AIGeneratedTipOutput> {
    return aiGeneratedTipFlow(input);
}

const generatedTipPrompt = ai.definePrompt({
    name: 'aiGeneratedTipPrompt',
    input: { schema: AIGeneratedTipInputSchema },
    output: { schema: AIGeneratedTipOutputSchema },
    prompt: `You are an expert pet care advisor. A user has requested information on the topic of "{{{topic}}}".

    1.  Generate a helpful, actionable tip or piece of advice related to this topic. The tip should be about 2-3 sentences long.
    2.  Find 1 or 2 high-quality, reputable external web links (like from the ASPCA, Humane Society, AVMA, or reputable vet schools) that provide more information on this topic.
    
    Provide the output in the specified format.`,
});

const aiGeneratedTipFlow = ai.defineFlow(
    {
        name: 'aiGeneratedTipFlow',
        inputSchema: AIGeneratedTipInputSchema,
        outputSchema: AIGeneratedTipOutputSchema,
    },
    async (input) => {
        const { output } = await generatedTipPrompt(input);
        return output!;
    }
);
