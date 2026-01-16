'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockData } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aiSymptomChecker, type AiSymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';

const schema = z.object({
  petId: z.string({ required_error: 'Please select a pet.' }),
  symptoms: z.string().min(10, 'Please describe the symptoms in at least 10 characters.'),
});

type FormValues = z.infer<typeof schema>;

const suggestedSymptoms = [
  'Vomiting after eating',
  'Lethargic and not playful',
  'Excessive scratching and licking',
  'Diarrhea or loose stools',
  'Loss of appetite',
  'Coughing or sneezing',
];

export function SymptomCheckerForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiSymptomCheckerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  
  if (!user) return null;

  const { pets } = mockData;
  const currentUserPets = pets.filter((pet) => user.petIds.includes(pet.petId));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const selectedPet = currentUserPets.find((p) => p.petId === data.petId);
    if (!selectedPet) {
      setError('Could not find selected pet.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await aiSymptomChecker({
        petType: `${selectedPet.breed} (${selectedPet.type})`,
        symptoms: data.symptoms,
      });
      setResult(response);
      setStep(3);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderUrgencyBadge = (urgency: string) => {
    const urgencyLevel = (urgency.split(' ')[0] || '').toLowerCase();
    switch (urgencyLevel) {
      case 'high':
        return <Badge variant="destructive" className="capitalize">{urgency}</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 capitalize">{urgency}</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{urgency}</Badge>;
    }
  };

  const renderMarkdownList = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('* ')) {
          return `<li>${line.replace('* ', '').trim()}</li>`;
        }
        if (line.trim() === '') {
          return '<br />';
        }
        return line;
      })
      .join('');
  };
  
  const handleSymptomSuggestionClick = (symptom: string) => {
    const currentSymptoms = form.getValues('symptoms');
    const newSymptoms = currentSymptoms ? `${currentSymptoms}, ${symptom}` : symptom;
    form.setValue('symptoms', newSymptoms);
  };

  return (
    <Card className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Step 1: Select Your Pet 🐾</CardTitle>
                <CardDescription>Choose which pet is experiencing symptoms.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="petId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 md:grid-cols-3 gap-4"
                        >
                          {currentUserPets.map((pet) => (
                            <FormItem key={pet.petId}>
                              <FormControl>
                                <RadioGroupItem value={pet.petId} className="sr-only" />
                              </FormControl>
                              <FormLabel className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <Avatar className="w-16 h-16 mb-2">
                                  <AvatarImage src={pet.photo} />
                                  <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold">{pet.name}</span>
                                <span className="text-xs text-muted-foreground">{pet.breed}</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => form.getValues('petId') && setStep(2)}>Next</Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Step 2: Describe the Symptoms 📝</CardTitle>
                <CardDescription>
                  Be as detailed as possible. You can also select from the common symptoms below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="e.g., My dog has been lethargic, not eating, and has been coughing for two days..." rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Common symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedSymptoms.map((symptom) => (
                            <Button 
                                key={symptom} 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSymptomSuggestionClick(symptom)}
                            >
                                {symptom}
                            </Button>
                        ))}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Analyze Symptoms
                </Button>
              </CardFooter>
            </>
          )}
        </form>

        {step === 3 && result && (
          <>
            <CardHeader>
              <CardTitle>🤖 AI Analysis Results</CardTitle>
              <CardDescription>
                Here are the potential insights based on the symptoms provided.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <Alert variant={result.urgencyLevel.toLowerCase().startsWith('high') ? 'destructive' : 'default'}>
                 <AlertTriangle className="h-4 w-4" />
                 <AlertTitle className="flex items-center gap-2">Urgency Level: {renderUrgencyBadge(result.urgencyLevel)}</AlertTitle>
                 <AlertDescription>
                   Based on the symptoms, the urgency to consult a vet is considered <strong>{(result.urgencyLevel.split(' ')[0] || 'low').toLowerCase()}</strong>.
                 </AlertDescription>
               </Alert>
              
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">🩺 Possible Conditions</h3>
                <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: `<ul>${renderMarkdownList(result.possibleConditions)}</ul>` }} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">💡 Recommendations</h3>
                <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: `<ul>${renderMarkdownList(result.recommendations)}</ul>` }} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => { setStep(1); form.reset(); setResult(null); }}>Start Over</Button>
            </CardFooter>
          </>
        )}
        
        {step === 3 && error && (
          <CardContent>
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
                 <Button onClick={() => setStep(2)}>Try Again</Button>
            </div>
          </CardContent>
        )}
      </Form>
    </Card>
  );
}
