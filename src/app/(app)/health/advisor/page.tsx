import { AdvisorChat } from './advisor-chat';
import { mockData } from '@/lib/mock-data';

export default function AdvisorPage() {
  const { pets, users } = mockData;
  const currentUserPets = pets.filter((pet) => users[0].petIds.includes(pet.petId));

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Health Advisor</h1>
        <p className="text-muted-foreground mt-2">
          Ask our AI anything about your pet's health, nutrition, or behavior.
        </p>
      </div>
      <AdvisorChat pets={currentUserPets} />
    </div>
  );
}
