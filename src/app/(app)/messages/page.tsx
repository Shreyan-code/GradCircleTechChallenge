
'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockData } from "@/lib/mock-data";
import { Send, Search, Users, ChevronLeft, MoreVertical } from "lucide-react";
import { format, formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message, User } from '@/lib/types';
import { useAuth } from '@/context/auth-context';

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  const conversations = mockData.conversations.filter(c => c.participants.includes(currentUser?.userId || ''));
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

  const otherParticipantId = selectedConversation?.participants.find(p => p !== currentUser.userId);
  const otherParticipant = mockData.users.find(u => u.userId === otherParticipantId);
  const petInvolved = otherParticipant ? mockData.pets.find(p => otherParticipant.petIds.includes(p.petId)) : null;

  return (
    <div className="h-[calc(100vh-10rem)] border bg-card text-card-foreground rounded-lg flex">
      <div className={cn("w-full md:w-1/3 border-r flex flex-col", selectedConversation && "hidden md:flex")}>
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold tracking-tight font-headline">Messages</h1>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map(convo => {
            const otherUser = mockData.users.find(u => u.userId === convo.participants.find(id => id !== currentUser.userId));
            if (!otherUser) return null;

            const isUnread = (convo.unreadCount[currentUser.userId] || 0) > 0;

            return (
              <button 
                key={convo.conversationId} 
                onClick={() => setSelectedConversation(convo)}
                className={cn(
                  "w-full text-left p-4 flex items-center gap-4 hover:bg-accent",
                  selectedConversation?.conversationId === convo.conversationId && "bg-accent"
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName} />
                  <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{otherUser.displayName}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNowStrict(new Date(convo.lastMessageAt))} ago
                    </p>
                  </div>
                  <div className="flex justify-between items-start">
                    <p className={cn("text-sm text-muted-foreground truncate", isUnread && "font-bold text-foreground")}>
                      {convo.lastMessage}
                    </p>
                    {isUnread && (
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </ScrollArea>
      </div>

      <div className={cn("w-full md:w-2/3 flex-col", selectedConversation ? "flex" : "hidden md:flex")}>
        {selectedConversation && otherParticipant ? (
          <>
            <div className="p-4 border-b flex items-center gap-4">
               <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src={otherParticipant.photoURL} alt={otherParticipant.displayName} />
                <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{otherParticipant.displayName}</p>
                {petInvolved && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Playdate for {petInvolved.name}
                  </p>
                )}
              </div>
               <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6 bg-secondary/30">
              <div className="space-y-6">
                {selectedConversation.messages.map(msg => (
                  <div key={msg.messageId} className={cn("flex items-end gap-3", msg.senderId === currentUser.userId ? "justify-end" : "justify-start")}>
                    {msg.senderId !== currentUser.userId && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={otherParticipant.photoURL} />
                        <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "rounded-lg px-4 py-2 max-w-[70%]",
                      msg.senderId === currentUser.userId ? "bg-primary text-primary-foreground" : "bg-background border"
                    )}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-12" />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
            <div>
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-lg font-semibold">Select a conversation</h2>
              <p>Choose from your existing conversations to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

