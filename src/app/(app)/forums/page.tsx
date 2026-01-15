'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData as initialMockData } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Eye, Pin, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NewDiscussionForm } from './new-discussion-form';
import type { ForumTopic } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

const cityChapters = [
  { name: "Bangalore", comingSoon: true },
  { name: "Mumbai", comingSoon: true },
  { name: "Delhi", comingSoon: true },
  { name: "Hyderabad", comingSoon: true },
  { name: "Pune", comingSoon: true },
];

export default function ForumsPage() {
  const [mockData, setMockData] = useState(initialMockData);
  const [isNewDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const handleStartDiscussion = (data: { title: string; content: string }) => {
    const newTopic: ForumTopic = {
      topicId: `topic_${String(mockData.forumTopics.length + 1).padStart(3, '0')}`,
      categoryId: "all-pets", // Default category
      userId: user.userId,
      userName: user.displayName,
      userPhoto: user.photoURL,
      title: data.title,
      content: data.content,
      views: 0,
      replyCount: 0,
      lastReplyAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      replies: []
    };

    setMockData(prev => ({
      ...prev,
      forumTopics: [newTopic, ...prev.forumTopics]
    }));
    
    toast({
        title: "Discussion Started!",
        description: "Your new topic has been posted."
    });

    setNewDiscussionOpen(false);
  };
  
  const { forumTopics } = mockData;

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Community Forums</h1>
                <p className="text-muted-foreground mt-2">Ask questions, share advice, and connect with other pet owners.</p>
            </div>
            <Dialog open={isNewDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
              <DialogTrigger asChild>
                <Button>
                    Start a New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <NewDiscussionForm onSave={handleStartDiscussion} />
              </DialogContent>
            </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                    <CardTitle>Recent Discussions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {forumTopics.map((topic) => (
                            <div key={topic.topicId} className="p-4 hover:bg-secondary/50 transition-colors flex items-start gap-4">
                                <Avatar className="w-10 h-10 border mt-1">
                                    <AvatarImage src={topic.userPhoto} alt={topic.userName} />
                                    <AvatarFallback>{topic.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Link href={`/forums/${topic.topicId}`} className="font-semibold text-lg hover:text-primary transition-colors">{topic.title}</Link>
                                    <div className="text-sm text-muted-foreground mt-1 flex items-center flex-wrap gap-x-4 gap-y-1">
                                        <span>Started by <Link href={`/profile/${topic.userId}`} className="font-medium text-foreground hover:underline">{topic.userName}</Link></span>
                                        <span>{formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground text-right">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{topic.replyCount}</span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{topic.views}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> City Chapters</CardTitle>
                    <CardDescription>Local communities are coming soon!</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                      {cityChapters.map(chapter => (
                        <li key={chapter.name} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{chapter.name}</span>
                           {chapter.comingSoon ? (
                                <span className="text-xs text-muted-foreground">Coming Soon</span>
                            ) : (
                                <span className="text-xs font-bold text-primary">Active</span>
                            )}
                        </li>
                      ))}
                    </ul>
                </CardContent>
              </Card>
          </div>
        </div>
    </div>
  );
}
