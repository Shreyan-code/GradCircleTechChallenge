'use server';

/**
 * @fileOverview An AI-powered playdate matchmaker for pets.
 *
 * - aiPlaydateMatchmaker - A function that handles the matchmaking process.
 * - AiPlaydateMatchmakerInput - The input type for the function.
 * - AiPlaydateMatchmakerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockData } from '@/lib/mock-data';

const PetSchema = z.object({
    petId: z.string(),
    name: z.string(),
    type: z.string(),
    breed: z.string(),
    age: z.object({ years: z.number(), months: z.number() }),
    gender: z.string(),
    activityLevel: z.number(),
    specialNeeds: z.string().optional(),
});

const AiPlaydateMatchmakerInputSchema = z.object({
  selectedPet: PetSchema.describe('The pet for whom we are finding a playmate.'),
  allOtherPets: z.array(PetSchema).describe('A list of potential pets for a playdate.'),
});
export type AiPlaydateMatchmakerInput = z.infer<typeof AiPlaydateMatchmakerInputSchema>;

const MatchSchema = z.object({
    petId: z.string(),
    name: z.string(),
    compatibilityScore: z.number().min(0).max(100).describe('A score from 0-100 indicating compatibility.'),
    reasoning: z.string().describe('A brief explanation for why these pets are a good match.'),
});

const AiPlaydateMatchmakerOutputSchema = z.object({
  matches: z.array(MatchSchema).describe('A list of the top 3-5 recommended playmates.'),
});
export type AiPlaydateMatchmakerOutput = z.infer<typeof AiPlaydateMatchmakerOutputSchema>;


export async function aiPlaydateMatchmaker(input: { petId: string }): Promise<AiPlaydateMatchmakerOutput> {
    const allPets = mockData.pets;
    const selectedPet = allPets.find(p => p.petId === input.petId);

    if (!selectedPet) {
        throw new Error('Selected pet not found');
    }

    const allOtherPets = allPets.filter(p => p.petId !== input.petId);

    const flowInput: AiPlaydateMatchmakerInput = {
        selectedPet: {
            petId: selectedPet.petId,
            name: selectedPet.name,
            type: selectedPet.type,
            breed: selectedPet.breed,
            age: selectedPet.age,
            gender: selectedPet.gender,
            activityLevel: selectedPet.activityLevel,
            specialNeeds: selectedPet.specialNeeds,
        },
        allOtherPets: allOtherPets.map(p => ({
            petId: p.petId,
            name: p.name,
            type: p.type,
            breed: p.breed,
            age: p.age,
            gender: p.gender,
            activityLevel: p.activityLevel,
            specialNeeds: p.specialNeeds,
        })),
    };

    return aiPlaydateMatchmakerFlow(flowInput);
}


const prompt = ai.definePrompt({
  name: 'aiPlaydateMatchmakerPrompt',
  input: {schema: AiPlaydateMatchmakerInputSchema},
  output: {schema: AiPlaydateMatchmakerOutputSchema},
  prompt: `You are an expert pet matchmaker. Your goal is to find the best playdates for a given pet from a list of other pets.

Analyze the selected pet:
- Name: {{{selectedPet.name}}}
- Type: {{{selectedPet.type}}}
- Breed: {{{selectedPet.breed}}}
- Age: {{{selectedPet.age.years}}} years, {{{selectedPet.age.months}}} months
- Gender: {{{selectedPet.gender}}}
- Activity Level: {{{selectedPet.activityLevel}}}/10
- Special Needs: {{{selectedPet.specialNeeds}}}

Now, evaluate all the other pets based on compatibility. Consider factors like:
- **Species:** Dogs with dogs, cats with cats.
- **Size & Breed:** Similar size and energy levels are generally good. Some breeds play better together.
- **Age:** Puppies/kittens have lots of energy, while senior pets might prefer calmer friends.
- **Activity Level:** A high-energy pet needs a playmate who can keep up.
- **Gender:** Sometimes opposite genders get along better, but it's not a strict rule.

Here is the list of potential playmates:
{{#each allOtherPets}}
- Pet ID: {{{petId}}}
- Name: {{{name}}}
- Type: {{{type}}}
- Breed: {{{breed}}}
- Age: {{{age.years}}} years, {{{age.months}}} months
- Gender: {{{gender}}}
- Activity Level: {{{activityLevel}}}/10
- Special Needs: {{{specialNeeds}}}
{{/each}}

Based on your analysis, provide a list of the top 3 to 5 most compatible playmates. For each match, provide a compatibility score from 0 to 100 and a brief, one-sentence reasoning for your recommendation.
`,
});

const aiPlaydateMatchmakerFlow = ai.defineFlow(
  {
    name: 'aiPlaydateMatchmakerFlow',
    inputSchema: AiPlaydateMatchmakerInputSchema,
    outputSchema: AiPlaydateMatchmakerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
