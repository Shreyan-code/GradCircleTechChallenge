'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Pet } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(1, "Pet's name is required."),
  type: z.enum(['Dog', 'Cat', 'Rabbit']),
  breed: z.string().min(1, 'Breed is required.'),
  gender: z.enum(['Male', 'Female']),
  age: z.object({
    years: z.coerce.number().min(0).max(30),
    months: z.coerce.number().min(0).max(11),
  }),
  photo: z.string().url("Please enter a valid image URL."),
  specialNeeds: z.string().optional(),
  activityLevel: z.coerce.number().min(1).max(10),
  birthDate: z.string(),
  color: z.string(),
  weight: z.coerce.number(),
  microchipId: z.string(),
});

type FormValues = Omit<Pet, 'petId' | 'ownerId' | 'ownerName' | 'createdAt'>;

interface AddPetFormProps {
  onSave: (data: FormValues) => void;
}

export function AddPetForm({ onSave }: AddPetFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'Dog',
      breed: '',
      gender: 'Male',
      age: { years: 0, months: 1 },
      photo: 'https://picsum.photos/seed/newpet/400/400',
      specialNeeds: 'None',
      activityLevel: 5,
      birthDate: new Date().toISOString(),
      color: "Brown",
      weight: 10,
      microchipId: "N/A"
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet's Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Dog">Dog</SelectItem>
                        <SelectItem value="Cat">Cat</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center space-x-4"
                >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Male" /></FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Female" /></FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="age.years"
                render={({ field }) => (
                    <FormItem><FormLabel>Years</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="age.months"
                render={({ field }) => (
                    <FormItem><FormLabel>Months</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}
            />
        </div>
         <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Add Pet</Button>
      </form>
    </Form>
  );
}
