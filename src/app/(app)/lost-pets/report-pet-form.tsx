'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Pet, LostPetAlert } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const schema = z.object({
  petId: z.string({ required_error: 'Please select a pet.' }),
  lastSeenLocation: z.object({
    address: z.string().min(5, "Please provide an address."),
    city: z.string().min(2, "Please provide a city."),
    landmark: z.string().optional(),
  }),
  lastSeenDate: z.date({ required_error: "Please select a date."}),
  description: z.string().min(10, 'Please provide a brief description.'),
  reward: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;
type SaveData = Omit<LostPetAlert, 'alertId' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'status'>;

interface ReportPetFormProps {
  userPets: Pet[];
  onSave: (data: SaveData) => void;
}

export function ReportPetForm({ userPets, onSave }: ReportPetFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastSeenDate: new Date(),
      lastSeenLocation: { city: "Bangalore", address: ""},
      reward: 0,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const selectedPet = userPets.find(p => p.petId === data.petId);
    if (!selectedPet) return;

    const saveData: SaveData = {
        petId: selectedPet.petId,
        petName: selectedPet.name,
        petType: selectedPet.type,
        breed: selectedPet.breed,
        age: selectedPet.age,
        gender: selectedPet.gender,
        color: selectedPet.color,
        petPhoto: selectedPet.photo,
        distinctiveMarks: "N/A", // This could be another field
        lastSeenLocation: data.lastSeenLocation,
        lastSeenDate: data.lastSeenDate.toISOString(),
        lastSeenTime: new Date().toTimeString().slice(0, 5), // Mock time
        description: data.description,
        reward: data.reward || 0,
    }
    onSave(saveData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Which pet is missing?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {userPets.map((pet) => (
                    <FormItem key={pet.petId}>
                      <FormControl>
                        <RadioGroupItem value={pet.petId} className="sr-only" />
                      </FormControl>
                      <FormLabel className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Avatar className="w-16 h-16 mb-2">
                          <AvatarImage src={pet.photo} />
                          <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm">{pet.name}</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="lastSeenDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Last Seen Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
          control={form.control}
          name="lastSeenLocation.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Seen Address / Area</FormLabel>
              <FormControl><Input placeholder="e.g., Near Cubbon Park" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Any extra details? What was your pet wearing?" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward (Optional)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Post Alert</Button>
      </form>
    </Form>
  );
}
