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
import { z } from 'zod';

// Tip of the Day Flow
const AITipOfTheDayOutputSchema = z.object({
  tip: z.string().describe('A helpful, concise pet care tip of the day, starting with a relevant emoji.'),
});
export type AITipOfTheDayOutput = z.infer<typeof AITipOfTheDayOutputSchema>;

export async function aiTipOfTheDay(): Promise<AITipOfTheDayOutput> {
  return aiTipOfTheDayFlow();
}

const tipOfTheDayPrompt = ai.definePrompt({
  name: 'aiTipOfTheDayPrompt',
  output: { schema: AITipOfTheDayOutputSchema },
  prompt: `You are a friendly and knowledgeable veterinary assistant with an upbeat and positive tone.
Generate a single, interesting, and helpful pet care tip of the day, starting with a relevant emoji.
The tip should be applicable to general pet owners (dogs or cats). Make it concise and easy to understand.
Example: "💡 Remember to regularly check your pet's paws for any cuts or foreign objects, especially after walks!"`,
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
  tip: z.string().describe('A detailed, helpful tip about the specified topic. This MUST be formatted as a markdown bulleted list, where each point starts with `* ` and is on a new line.'),
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
    prompt: `You are an expert pet care advisor with a friendly and engaging tone. A user has requested information on the topic of "{{{topic}}}".

Your task is to provide a helpful, actionable tip and some external resources. Use markdown for formatting and include relevant emojis to make the content more engaging.

1.  **tip**: Generate a helpful tip about the specified topic. You MUST structure it as a markdown bulleted list with 2-3 points. Each point must start with a \`* \` and a relevant emoji on a new line.
    *   Example for "Training" topic:
        *   🐾 Start with short, positive training sessions, just 5-10 minutes at a time.
        *   🎉 Use high-value treats (like small pieces of chicken or cheese) to keep them motivated and excited.
        *   💡 Always end on a successful command to build your pet's confidence and make them eager for the next session.

2.  **resources**: Find 1-2 high-quality, reputable external web links (like from the ASPCA, Humane Society, AVMA, or reputable vet schools) that provide more information on this topic.

Provide the output in the specified JSON format.`,
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
