'use client';

import type { Story, User } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface StoriesCarouselProps {
  stories: Story[];
  currentUser: User;
}

export function StoriesCarousel({ stories, currentUser }: StoriesCarouselProps) {
  return (
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
          <div key={story.storyId} className="flex-shrink-0 flex flex-col items-center gap-2 w-[88px]">
            <button className="w-[88px] h-[88px] rounded-full flex items-center justify-center story-gradient-ring p-1">
              <div className="w-full h-full bg-background rounded-full p-0.5">
                <Avatar className="w-full h-full">
                  <AvatarImage src={story.userPhoto} alt={story.userName} />
                  <AvatarFallback>{story.userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </button>
            <p className="text-xs text-foreground font-medium truncate">{story.userName}</p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
