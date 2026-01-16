'use client';

import type { Story, User } from '@/lib/types';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '../ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNotificationToast } from '@/hooks/use-notification-toast';

interface StoriesCarouselProps {
  stories: Story[];
  currentUser: User;
}

export function StoriesCarousel({ stories, currentUser }: StoriesCarouselProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isAddStoryOpen, setAddStoryOpen] = useState(false);
  const { notificationToast: toast } = useNotificationToast();

  const storyIndex = useMemo(() => {
    if (!selectedStory) return -1;
    return stories.findIndex(s => s.storyId === selectedStory.storyId);
  }, [selectedStory, stories]);

  const goToNextStory = () => {
    if (storyIndex < stories.length - 1) {
      setSelectedStory(stories[storyIndex + 1]);
    }
  };

  const goToPreviousStory = () => {
    if (storyIndex > 0) {
      setSelectedStory(stories[storyIndex - 1]);
    }
  };

  const handleAddStory = () => {
    toast({
        title: "Story posted!",
        description: "Your new story is now visible to your friends."
    });
    setAddStoryOpen(false);
  }

  return (
    <>
      <Dialog open={isAddStoryOpen} onOpenChange={setAddStoryOpen}>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 pb-4">
            {/* Your Story */}
            <DialogTrigger asChild>
                <div className="flex-shrink-0 flex flex-col items-center gap-2 w-[88px] cursor-pointer">
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
            </DialogTrigger>
            
            {/* Other stories */}
            {stories.map((story) => (
              <button key={story.storyId} onClick={() => setSelectedStory(story)}>
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
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a new story</DialogTitle>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="caption">Caption (optional)</Label>
                    <Input id="caption" placeholder="Add a caption..." />
                </div>
                <Button type="submit" onClick={handleAddStory}>Post Story</Button>
            </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        {selectedStory && (
          <DialogContent className="p-0 max-w-md w-full bg-black border-0 rounded-lg overflow-hidden flex items-center justify-center">
            <DialogHeader>
              <DialogTitle className="sr-only">Story from {selectedStory.userName}</DialogTitle>
              <DialogDescription className="sr-only">
                {selectedStory.caption || `A story posted by ${selectedStory.userName}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-[9/16] w-full">
              <Image src={selectedStory.storyImage} alt={`Story from ${selectedStory.userName}`} layout="fill" objectFit="cover" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-0 left-0 p-4 w-full flex items-center justify-between z-10">
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
              {selectedStory.caption && (
                <div className="absolute bottom-4 left-4 right-4 text-center z-10">
                    <p className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block">{selectedStory.caption}</p>
                </div>
              )}
            </div>
            
            {storyIndex > 0 && (
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-black/20 hover:bg-black/50 text-white z-20" onClick={goToPreviousStory}>
                    <ChevronLeft className="w-6 h-6" />
                </Button>
            )}
            {storyIndex < stories.length - 1 && (
                 <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-black/20 hover:bg-black/50 text-white z-20" onClick={goToNextStory}>
                    <ChevronRight className="w-6 h-6" />
                </Button>
            )}

          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
