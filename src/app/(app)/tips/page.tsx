import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Bone, Brain, Heart, Scissors, ArrowRight, Users } from "lucide-react";
import Link from 'next/link';

const tipOfTheDay = {
  tip: "A tired dog is a happy dog. Ensure your furry friend gets enough physical exercise and mental stimulation every day to prevent boredom and destructive behaviors."
};

const careGuides = [
  {
    category: "Nutrition",
    title: "The Ultimate Guide to Pet Nutrition",
    description: "Learn what to feed your pet at every stage of their life for optimal health.",
    icon: <Bone className="w-8 h-8 text-primary" />,
    href: "#"
  },
  {
    category: "Training",
    title: "Positive Reinforcement Training Techniques",
    description: "Discover effective and humane ways to train your pet using positive reinforcement.",
    icon: <Brain className="w-8 h-8 text-primary" />,
    href: "#"
  },
  {
    category: "Health & Wellness",
    title: "Recognizing Common Health Issues",
    description: "Know the signs of common health problems to keep your pet safe and healthy.",
    icon: <Heart className="w-8 h-8 text-primary" />,
    href: "#"
  },
  {
    category: "Grooming",
    title: "Grooming Basics for a Happy Pet",
    description: "From brushing to bathing, get tips on how to keep your pet looking and feeling great.",
    icon: <Scissors className="w-8 h-8 text-primary" />,
    href: "#"
  },
    {
    category: "Behavior",
    title: "Decoding Your Pet's Behavior",
    description: "Understand what your pet is trying to tell you with their barks, meows, and body language.",
    icon: <Users className="w-8 h-8 text-primary" />,
    href: "#"
  },
  {
    category: "First-Time Owners",
    title: "New Pet Checklist for First-Time Owners",
    description: "Everything you need to know and prepare for when bringing a new pet home.",
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    href: "#"
  }
];


export default function TipsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">Tips & Advice</h1>
      <p className="text-muted-foreground mt-2">Your daily dose of pet care wisdom.</p>
      
      {/* Tip of the Day */}
      <Card className="mt-8 bg-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center gap-4">
          <Lightbulb className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-primary">Tip of the Day</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">"{tipOfTheDay.tip}"</p>
        </CardContent>
      </Card>

      {/* Pet Care Guides */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Pet Care Guides</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careGuides.map((guide) => (
            <Link href={guide.href} key={guide.title} className="group">
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
