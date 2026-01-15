'use client';

import { useState, useRef, useEffect } from 'react';
import type { Pet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { aiHealthAdvisor } from '@/ai/flows/ai-health-advisor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';

interface AdvisorChatProps {
  pets: Pet[];
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export function AdvisorChat({ pets }: AdvisorChatProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(pets[0]?.petId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedPetId) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const selectedPet = pets.find(p => p.petId === selectedPetId);
      const query = `My pet is a ${selectedPet?.age.years} year old ${selectedPet?.breed}. Question: ${input}`;
      const result = await aiHealthAdvisor({ query });
      
      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: result.response };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const suggestedPrompts = [
    "What's a good diet for a puppy?",
    "How can I tell if my cat is stressed?",
    "What are common signs of arthritis in older dogs?",
  ];
  
  if (!user) return null;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <Select onValueChange={setSelectedPetId} defaultValue={selectedPetId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a pet" />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.petId} value={pet.petId}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPetId && (
            <div className="text-sm text-muted-foreground">
                Chatting about <span className="font-semibold text-foreground">{pets.find(p=>p.petId === selectedPetId)?.name}</span>
            </div>
        )}
      </div>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Start the conversation</h3>
              <p className="text-muted-foreground">Select a pet and ask a question to begin.</p>
               <div className="mt-6 flex flex-col gap-2 w-full max-w-md">
                {suggestedPrompts.map(prompt => (
                  <Button key={prompt} variant="outline" size="sm" onClick={() => setInput(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 border">
                        <div className="w-full h-full flex items-center justify-center bg-primary">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photoURL} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3">
                   <Avatar className="w-8 h-8 border">
                        <div className="w-full h-full flex items-center justify-center bg-primary">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </Avatar>
                    <div className="rounded-lg px-4 py-3 bg-secondary">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
                )}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className="p-4 border-t">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="pr-12"
            disabled={isLoading || !selectedPetId}
          />
          <Button
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !selectedPetId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
