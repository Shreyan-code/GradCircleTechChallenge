import { mockData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PawPrint, MapPin, Phone } from 'lucide-react';

export default function AdoptionPage() {
  const { adoptionPets } = mockData;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline">Find Your New Best Friend</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          These wonderful pets are looking for a forever home. Open your heart and home to a friend for life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adoptionPets.map(pet => (
          <Card key={pet.adoptionId} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative aspect-video w-full">
                <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-2xl">{pet.name}</CardTitle>
                  <Badge variant="secondary">{pet.gender}</Badge>
              </div>
              <CardDescription className="font-semibold text-primary">{pet.breed}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">{pet.age.years} years, {pet.age.months} months old</p>

              <div className="mt-4 space-y-4">
                  <div>
                      <h4 className="font-semibold text-sm mb-1">Their Story</h4>
                      <p className="text-sm text-muted-foreground">{pet.story}</p>
                  </div>
                   <div>
                      <h4 className="font-semibold text-sm mb-1">Why They Need a Home</h4>
                      <p className="text-sm text-muted-foreground italic">"{pet.reasonForAdoption}"</p>
                  </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 bg-secondary/30 flex-col items-start gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{pet.location}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{pet.contact.name} - {pet.contact.phone}</span>
                </div>
                <Button className="w-full mt-2">
                    <PawPrint className="mr-2 h-4 w-4" />
                    I am interested
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
