'use client';
import { PlaydateMatchmakerUI } from './playdate-matchmaker-ui';
import { mockData } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';

export default function PlaydateMatchmakerPage() {
  const { pets } = mockData;
  const { user } = useAuth();
  
  if (!user) return null; // Or a loading spinner

  const currentUserPets = pets.filter((pet) => user.petIds.includes(pet.petId));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Playdate Matchmaker</h1>
        <p className="text-muted-foreground mt-2">
          Select your pet to find the most compatible playmates near you!
        </p>
      </div>
      <PlaydateMatchmakerUI userPets={currentUserPets} allPets={mockData.pets} />
    </div>
  );
}
