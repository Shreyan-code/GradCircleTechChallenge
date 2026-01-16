'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Bone, Brain, Heart, Scissors, ArrowRight, Users, Sparkles, Loader2, Link as LinkIcon } from "lucide-react";
import Link from 'next/link';
import { aiTipOfTheDay, AITipOfTheDayOutput, aiGeneratedTip, AIGeneratedTipOutput } from '@/ai/flows/ai-pet-tips';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


const careGuides = [
  {
    category: "Nutrition",
    title: "The Ultimate Guide to Pet Nutrition",
    description: "Learn what to feed your pet at every stage of their life for optimal health.",
    icon: <Bone className="w-8 h-8 text-primary" />,
    href: "https://www.aspca.org/pet-care/animal-poison-control/people-foods-avoid-feeding-your-pets"
  },
  {
    category: "Training",
    title: "Positive Reinforcement Training Techniques",
    description: "Discover effective and humane ways to train your pet using positive reinforcement.",
    icon: <Brain className="w-8 h-8 text-primary" />,
    href: "https://www.humanesociety.org/resources/positive-reinforcement-training"
  },
  {
    category: "Health & Wellness",
    title: "Recognizing Common Health Issues",
    description: "Know the signs of common health problems to keep your pet safe and healthy.",
    icon: <Heart className="w-8 h-8 text-primary" />,
    href: "https://www.avma.org/resources-tools/pet-owners/petcare/10-signs-your-pet-may-be-sick"
  },
  {
    category: "Grooming",
    title: "Grooming Basics for a Happy Pet",
    description: "From brushing to bathing, get tips on how to keep your pet looking and feeling great.",
    icon: <Scissors className="w-8 h-8 text-primary" />,
    href: "https://www.aspca.org/pet-care/general-pet-care/grooming-your-dog"
  },
  {
    category: "Behavior",
    title: "Decoding Your Pet's Behavior",
    description: "Understand what your pet is trying to tell you with their barks, meows, and body language.",
    icon: <Users className="w-8 h-8 text-primary" />,
    href: "https://www.humanesociety.org/resources/cat-body-language"
  },
  {
    category: "First-Time Owners",
    title: "New Pet Checklist for First-Time Owners",
    description: "Everything you need to know and prepare for when bringing a new pet home.",
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    href: "https://www.thesprucepets.com/new-dog-checklist-1117354"
  }
];

const tipTopics = ["Nutrition", "Training", "Grooming", "Behavior", "Health"];

export default function TipsPage() {
  const [tipOfTheDay, setTipOfTheDay] = useState<AITipOfTheDayOutput | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(true);
  
  const [generatedTip, setGeneratedTip] = useState<AIGeneratedTipOutput | null>(null);
  const [isGeneratedTipLoading, setIsGeneratedTipLoading] = useState(false);
  const [generatedTipError, setGeneratedTipError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setIsTipLoading(true);
        const result = await aiTipOfTheDay();
        setTipOfTheDay(result);
      } catch (error) {
        console.error("Failed to fetch tip of the day:", error);
        setTipOfTheDay({ tip: "Could not load tip. Please try refreshing." });
      } finally {
        setIsTipLoading(false);
      }
    };
    fetchTip();
  }, []);

  const handleGenerateTip = async (topic: string) => {
    setGeneratedTip(null);
    setGeneratedTipError(null);
    setIsGeneratedTipLoading(true);
    setSelectedTopic(topic);
    try {
      const result = await aiGeneratedTip({ topic });
      setGeneratedTip(result);
    } catch (error) {
      console.error(`Failed to generate tip for ${topic}:`, error);
      setGeneratedTipError("Sorry, we couldn't generate a tip right now. Please try another topic.");
    } finally {
      setIsGeneratedTipLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">Tips & Advice</h1>
      <p className="text-muted-foreground mt-2">Your daily dose of pet care wisdom.</p>
      
      {/* Tip of the Day */}
      <Card className="mt-8 bg-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-primary flex items-center gap-2">
              AI Tip of the Day
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isTipLoading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : (
            <p className="text-lg text-foreground">"{tipOfTheDay?.tip}"</p>
          )}
        </CardContent>
      </Card>
      
      {/* AI Generated Tips */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI-Powered Advice
        </h2>
        <p className="text-muted-foreground mt-2">Select a topic to get a custom tip from our AI.</p>
        <Card className="mt-6">
            <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                    {tipTopics.map(topic => (
                        <Button 
                            key={topic}
                            variant="outline"
                            onClick={() => handleGenerateTip(topic)}
                            disabled={isGeneratedTipLoading}
                        >
                            {isGeneratedTipLoading && selectedTopic === topic ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {topic}
                        </Button>
                    ))}
                </div>

                <div className="mt-6">
                  {isGeneratedTipLoading && (
                     <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                  )}
                  {generatedTipError && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{generatedTipError}</AlertDescription>
                     </Alert>
                  )}
                  {generatedTip && (
                    <div className="space-y-4 text-sm">
                        <p className="text-base">{generatedTip.tip}</p>
                        <div>
                            <h4 className="font-semibold mb-2">Further Reading:</h4>
                            <ul className="space-y-2">
                                {generatedTip.resources.map(resource => (
                                    <li key={resource.url}>
                                        <a 
                                            href={resource.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                           <LinkIcon className="h-4 w-4" />
                                           {resource.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                  )}
                </div>
            </CardContent>
        </Card>
      </div>


      {/* Pet Care Guides */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Pet Care Guides</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careGuides.map((guide) => (
            <Link href={guide.href} key={guide.title} className="group" target="_blank" rel="noopener noreferrer">
              <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {guide.icon}
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-primary">{guide.category}</p>
                    <CardTitle className="font-headline text-lg mt-1">{guide.title}</CardTitle>
                  </div>
                </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground">{guide.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
