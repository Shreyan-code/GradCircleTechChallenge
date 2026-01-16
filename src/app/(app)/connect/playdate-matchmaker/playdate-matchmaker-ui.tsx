'use client';

import { useState } from 'react';
import type { Pet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aiPlaydateMatchmaker, type AiPlaydateMatchmakerOutput } from '@/ai/flows/ai-playdate-matchmaker';
import { Loader2, Sparkles, AlertTriangle, Users, ArrowRight, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useNotificationToast } from "@/hooks/use-notification-toast";

interface PlaydateMatchmakerUIProps {
  userPets: Pet[];
  allPets: Pet[];
}

export function PlaydateMatchmakerUI({ userPets, allPets }: PlaydateMatchmakerUIProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiPlaydateMatchmakerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { notificationToast: toast } = useNotificationToast();

  const handleFindMatches = async () => {
    if (!selectedPetId) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiPlaydateMatchmaker({ petId: selectedPetId });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while finding matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrangePlaydate = (petName: string) => {
    toast({
      title: "Playdate request sent!",
      description: `A message has been sent to ${petName}'s owner.`,
    });
  }

  const getPetById = (petId: string) => allPets.find(p => p.petId === petId);

  const reset = () => {
    setSelectedPetId(null);
    setResult(null);
    setError(null);
  };

  if (!result && !isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Step 1: Select Your Pet</CardTitle>
          <CardDescription>Choose which pet needs a playdate.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPetId || ''}
            onValueChange={setSelectedPetId}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {userPets.map((pet) => (
              <Label
                key={pet.petId}
                htmlFor={pet.petId}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <RadioGroupItem value={pet.petId} id={pet.petId} className="sr-only" />
                <Avatar className="w-20 h-20 mb-2">
                  <AvatarImage src={pet.photo} />
                  <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-bold">{pet.name}</span>
                <span className="text-xs text-muted-foreground">{pet.breed}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFindMatches} disabled={!selectedPetId || isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Find Matches
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-16">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Finding perfect playmates...</h3>
            <p className="text-muted-foreground">Our AI is analyzing personalities and play styles.</p>
        </div>
      )
  }

  return (
    <div className="mt-8">
      {error && (
        <Card>
            <CardContent className="pt-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Matchmaking Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button variant="outline" onClick={reset}>Try Again</Button>
                </div>
            </CardContent>
        </Card>
      )}

      {result && (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Top Matches for {getPetById(selectedPetId!)?.name}</h2>
                <p className="text-muted-foreground">Here are the best potential playmates we found.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore).map((match) => {
                    const pet = getPetById(match.petId);
                    if (!pet) return null;
                    return (
                        <Card key={match.petId} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={pet.photo} />
                                    <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle>{pet.name}</CardTitle>
                                    <CardDescription>{pet.breed}</CardDescription>
                                    <p className="text-xs text-muted-foreground mt-1">{pet.age.years} years old &bull; {pet.gender}</p>
                                </div>
                                <Button size="icon" variant="outline">
                                    <Users className="h-4 w-4"/>
                                    <span className="sr-only">Connect</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <Label htmlFor={`score-${match.petId}`} className="text-sm font-medium flex items-center">
                                            <Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                                            Compatibility
                                        </Label>
                                        <span className="text-sm font-bold">{match.compatibilityScore}%</span>
                                    </div>
                                    <Progress id={`score-${match.petId}`} value={match.compatibilityScore} className="h-2" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground italic">
                                      "{match.reasoning}"
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleArrangePlaydate(pet.name)}>
                                    Arrange a Playdate <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            <div className="text-center mt-8">
                <Button variant="outline" onClick={reset}>Start Over</Button>
            </div>
        </div>
      )}
    </div>
  );
}
