'use client';

import type { Story, User } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus, X } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../ui/dialog';
import { formatDistanceToNow } from 'date-fns';

interface StoriesCarouselProps {
  stories: Story[];
  currentUser: User;
}

export function StoriesCarousel({ stories, currentUser }: StoriesCarouselProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <Dialog>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 pb-4">
          {/* Your Story */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 w-[88px]">
            <button className="relative w-[80px] h-[80px]">
              <Avatar className="w-full h-full border-2 border-dashed border-muted-foreground">
                <AvatarImage src={currentUser.photoURL} alt="Your Story" />
                <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 border-2 border-background">
                <Plus className="w-4 h-4" />
              </div>
            </button>
            <p className="text-xs text-muted-foreground font-medium truncate">Your Story</p>
          </div>
          
          {/* Other stories */}
          {stories.map((story) => (
            <DialogTrigger asChild key={story.storyId} onClick={() => setSelectedStory(story)}>
              <div className="flex-shrink-0 flex flex-col items-center gap-2 w-[88px] cursor-pointer">
                <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center story-gradient-ring p-1">
                  <div className="w-full h-full bg-background rounded-full p-0.5">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={story.userPhoto} alt={story.userName} />
                      <AvatarFallback>{story.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <p className="text-xs text-foreground font-medium truncate">{story.userName}</p>
              </div>
            </DialogTrigger>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {selectedStory && (
        <DialogContent className="p-0 max-w-md w-full bg-black border-0 rounded-lg overflow-hidden">
          <div className="relative aspect-[9/16] w-full">
            <Image src={selectedStory.storyImage} alt={`Story from ${selectedStory.userName}`} layout="fill" objectFit="cover" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-0 left-0 p-4 w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedStory.userPhoto} />
                  <AvatarFallback>{selectedStory.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-white text-sm font-bold">{selectedStory.userName}</p>
                <p className="text-neutral-300 text-xs">{formatDistanceToNow(new Date(selectedStory.timestamp), { addSuffix: true })}</p>
              </div>
              <DialogClose asChild>
                <button className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
