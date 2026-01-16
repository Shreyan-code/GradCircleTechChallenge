'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Heart, MessageCircle, MapPin, Users, Calendar, Stethoscope, Search, AlertTriangle, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNotificationToast } from '@/hooks/use-notification-toast';

const features = [
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Social Feed',
    description: 'Share your pet\'s moments on our feed. Like, comment, and connect with fellow pet lovers.',
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    title: 'AI Health Tools',
    description: 'Get instant advice with our AI Symptom Checker and Health Advisor for your pet\'s well-being.',
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Lost & Found',
    description: 'Instantly alert the community with our powerful Lost & Found system to bring your pet home safely.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Community Forums',
    description: 'Join discussions on pet care, training, and more in our dedicated community forums.',
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: 'Events & Meetups',
    description: 'Discover and create local pet-friendly events to socialize with other owners and their pets.',
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: 'Direct Messaging',
    description: 'Connect one-on-one with other pet owners for playdates, advice, or just a friendly chat.',
  },
];

export default function LandingPage() {
  const { notificationToast: toast } = useNotificationToast();
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');
  const featureImage1 = PlaceHolderImages.find(p => p.id === 'landing-feature-1');
  const featureImage2 = PlaceHolderImages.find(p => p.id === 'landing-feature-2');
  const ctaImage = PlaceHolderImages.find(p => p.id === 'landing-cta');
  const lostAndFoundImage = PlaceHolderImages.find(p => p.id === 'landing-lost-found');
  
  const activeLostPetAlerts = mockData.lostPetAlerts.filter(a => a.status === 'active').slice(0, 2);

  const handleShare = (petName: string) => {
    navigator.clipboard.writeText(`Please help find ${petName}! More info on PetConnect.`);
    toast({
      title: "Link Copied!",
      description: `A shareable link for ${petName} has been copied to your clipboard.`,
    });
  };

  const handleViewAll = () => {
    toast({
      description: "Showing all lost and found alerts...",
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <PawPrint className="h-7 w-7 text-primary" />
            <span className="font-headline">PetConnect</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground font-headline tracking-tight">
                The Social Network for <span className="text-primary">Pet Owners</span> in India.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Connect, share, and build a community with fellow pet parents. Your digital town square for everything pets is here.
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Join the Community</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transform hover:scale-105 transition-transform duration-500 ease-in-out"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        {/* Lost & Found Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground font-headline">Help Bring Them Home</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                These pets are currently missing. Your vigilance can make a difference.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeLostPetAlerts.map(alert => (
                 <Card key={alert.alertId} className="flex flex-col md:flex-row items-center gap-6 p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative w-48 h-48 md:w-40 md:h-40 flex-shrink-0">
                      <Image src={alert.petPhoto} alt={alert.petName} fill className="object-cover rounded-full border-4 border-destructive" />
                    </div>
                    <div className="text-center md:text-left">
                       <Badge variant="destructive" className="mb-2">
                          <AlertTriangle className="h-3 w-3 mr-1.5" />
                          Lost {formatDistanceToNowStrict(new Date(alert.lastSeenDate))} ago
                       </Badge>
                       <h3 className="text-2xl font-bold font-headline">{alert.petName}</h3>
                       <p className="text-muted-foreground">
                         <span className="font-semibold">{alert.breed}</span> &bull; {alert.gender}
                       </p>
                       <p className="mt-2 text-sm flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" /> Last seen near {alert.lastSeenLocation.landmark}, {alert.lastSeenLocation.city}
                       </p>
                       <div className="mt-4 flex gap-2 justify-center md:justify-start">
                         <Button asChild>
                           <Link href="/lost-pets">View Details</Link>
                         </Button>
                         <Button variant="outline" onClick={() => handleShare(alert.petName)}>
                           <Share2 className="mr-2 h-4 w-4" /> Share
                         </Button>
                       </div>
                    </div>
                 </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button variant="ghost" asChild>
                    <Link href="/lost-pets" onClick={handleViewAll}>View All Lost & Found Alerts &rarr;</Link>
                </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground font-headline">A Community Tailor-Made for You</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                PetConnect offers everything you need to navigate pet ownership with confidence and joy.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Alternating Feature Blocks */}
        <section className="py-16 md:py-24">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative w-full h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-lg">
              {featureImage1 && (
                  <Image src={featureImage1.imageUrl} alt={featureImage1.description} fill style={{objectFit: 'cover'}} data-ai-hint={featureImage1.imageHint} />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-foreground font-headline">Share Unforgettable Moments</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Our feed is the perfect place to post photos of your furry, feathery, or scaly friends. Celebrate milestones, share funny moments, and get inspired by others.
              </p>
            </div>
          </div>
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16 md:mt-24">
            <div className="lg:order-2 relative w-full h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-lg">
               {featureImage2 && (
                  <Image src={featureImage2.imageUrl} alt={featureImage2.description} fill style={{objectFit: 'cover'}} data-ai-hint={featureImage2.imageHint} />
              )}
            </div>
            <div className="lg:order-1">
              <h3 className="text-3xl font-extrabold text-foreground font-headline">AI-Powered Peace of Mind</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Worried about a symptom? Our AI Health Advisor provides instant, helpful information. It's like having a vet assistant in your pocket, available 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary">
          <div className="container">
            <div className="relative my-16 md:my-24 p-8 md:p-16 rounded-2xl overflow-hidden bg-primary/90 text-primary-foreground">
               {ctaImage && (
                  <Image src={ctaImage.imageUrl} alt={ctaImage.description} fill style={{objectFit: 'cover'}} className="opacity-20" data-ai-hint={ctaImage.imageHint}/>
               )}
              <div className="relative text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline">Ready to Join the Pack?</h2>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  Become a part of India's fastest-growing pet owner community. Your new best friends (human and animal) are waiting.
                </p>
                <div className="mt-8">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Sign Up for Free</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground font-headline">PetConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PetConnect. Made with ❤️ for the love of pets.
          </p>
        </div>
      </footer>
    </div>
  );
}
