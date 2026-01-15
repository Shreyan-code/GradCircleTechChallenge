'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockData as initialMockData } from "@/lib/mock-data";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { format } from 'date-fns';

export default function EventsPage() {
  const [mockData, setMockData] = useState(initialMockData);
  const { toast } = useToast();
  const currentUser = mockData.users[0];

  const handleRegister = (eventId: string) => {
    const event = mockData.events.find(e => e.eventId === eventId);
    if (!event) return;

    // Check if user is already registered
    if (event.attendees.some(a => a.userId === currentUser.userId)) {
        toast({
            title: "Already Registered!",
            description: `You are already registered for ${event.title}.`,
        });
        return;
    }

    // Add user to attendees
    const updatedEvents = mockData.events.map(e => {
      if (e.eventId === eventId) {
        return {
          ...e,
          attendees: [
            ...e.attendees,
            {
              userId: currentUser.userId,
              userName: currentUser.displayName,
              userPhoto: currentUser.photoURL,
              rsvpDate: new Date().toISOString(),
            }
          ],
          attendeeCount: e.attendeeCount + 1,
        };
      }
      return e;
    });

    setMockData(prev => ({ ...prev, events: updatedEvents }));

    toast({
      title: "Registration Successful!",
      description: `You have successfully registered for ${event.title}.`,
    });
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Events & Meetups</h1>
                <p className="text-muted-foreground mt-2">Discover local pet-friendly events and connect with the community.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockData.events.map(event => {
                const isRegistered = event.attendees.some(a => a.userId === currentUser.userId);
                return (
                    <Card key={event.eventId} className="flex flex-col">
                        <CardHeader className="p-0">
                            <div className="relative aspect-video w-full">
                                <Image src={event.bannerImage} alt={event.title} fill className="object-cover rounded-t-lg" />
                                <Badge className="absolute top-3 right-3">{event.isFree ? 'Free Event' : 'Paid Event'}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-1">
                            <p className="text-sm font-semibold text-primary mb-1">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')} &bull; {event.startTime}</p>
                            <CardTitle className="font-headline text-2xl mb-2">{event.title}</CardTitle>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location.venue}, {event.location.city}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{event.attendeeCount} going</span>
                                </div>
                            </div>
                             <p className="mt-4 text-sm">{event.description}</p>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button className="w-full" onClick={() => handleRegister(event.eventId)} disabled={isRegistered}>
                                <Ticket className="mr-2 h-4 w-4" />
                                {isRegistered ? 'Registered' : 'Register Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
