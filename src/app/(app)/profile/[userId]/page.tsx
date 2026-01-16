'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationToast } from "@/hooks/use-notification-toast";
import { Mail, MapPin, PlusCircle, Settings, UserPlus, Send, MessageSquare } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { EditProfileForm } from './edit-profile-form';
import { AddPetForm } from './add-pet-form';
import type { Pet, User } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/hooks/use-user-profile';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const params = useParams<{ userId: string }>();
  const { notificationToast: toast } = useNotificationToast();
  const { user: currentUser } = useAuth();
  const { user, pets, posts, loading, error, updateUserProfile } = useUserProfile(params.userId);

  const [isFollowing, setIsFollowing] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openAddPet, setOpenAddPet] = useState(false);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error || !user) {
    return notFound();
  }

  const isCurrentUser = currentUser?.userId === params.userId;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? `Unfollowed ${user.displayName}` : `You are now following ${user.displayName}!`,
    });
  };

  const handleUpdateProfile = () => {
    toast({ title: "Profile updated successfully!"});
    setOpenEditProfile(false);
  };

  const handleAddPet = async (newPet: Omit<Pet, 'petId' | 'ownerId' | 'ownerName' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      const petCollectionRef = collection(db, `users/${currentUser.userId}/pets`);
      await addDoc(petCollectionRef, {
        ...newPet,
        ownerId: currentUser.userId,
        ownerName: currentUser.displayName,
        createdAt: serverTimestamp(),
      });

      const userDocRef = doc(db, 'users', currentUser.userId);
      await updateDoc(userDocRef, {
        petCount: increment(1),
      });

      toast({ title: `${newPet.name} has been added to your family!` });
      setOpenAddPet(false);
    } catch (e) {
      console.error("Error adding pet: ", e);
      toast({ title: "Error", description: "Could not add pet. Please try again." });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row items-center gap-8 p-4">
        <Avatar className="w-24 h-24 md:w-36 md:h-36 border-4 border-primary">
          <AvatarImage src={user.photoURL} alt={user.displayName} />
          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">{user.displayName}</h1>
            {isCurrentUser ? (
              <Dialog open={openEditProfile} onOpenChange={setOpenEditProfile}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <EditProfileForm user={user} onSave={handleUpdateProfile} />
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleFollow}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] flex flex-col h-[600px]">
                        <DialogHeader>
                            <DialogTitle>Chat with {user.displayName}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-4 bg-secondary/50 rounded-lg">
                            {/* Chat messages will be loaded from a real-time database */}
                        </ScrollArea>
                        <div className="mt-auto flex gap-2 pt-4">
                            <Input placeholder="Type a message..." />
                            <Button size="icon"><Send className="h-4 w-4" /></Button>
                        </div>
                    </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center md:justify-start gap-8 text-sm">
            <div><span className="font-bold">{posts.length}</span> Posts</div>
            <div><span className="font-bold">{user.followers + (isFollowing && !isCurrentUser ? 1: 0) }</span> Followers</div>
            <div><span className="font-bold">{user.following}</span> Following</div>
          </div>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto md:mx-0">{user.bio}</p>
          <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {user.location.city}, {user.location.country}
          </div>
        </div>
      </header>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-4 px-4">
            <h2 className="text-xl font-bold font-headline">Pets</h2>
            {isCurrentUser && (
                <Dialog open={openAddPet} onOpenChange={setOpenAddPet}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Pet
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Pet</DialogTitle>
                        </DialogHeader>
                        <AddPetForm onSave={handleAddPet} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
        
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {pets.map(pet => (
              <Card key={pet.petId} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-square w-full">
                    <Image src={pet.photo} alt={pet.name} fill className="rounded-t-lg object-cover" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-headline">{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pet.breed}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground px-4">
            <p>{user.displayName} hasn't added any pets yet.</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold font-headline mb-4 px-4">Posts</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {posts.map(post => (
              <div key={post.postId} className="relative aspect-square group">
                <Image src={post.image} alt={post.caption} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span>{post.likes} ❤️</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground px-4">
            <p>No posts to show yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}
