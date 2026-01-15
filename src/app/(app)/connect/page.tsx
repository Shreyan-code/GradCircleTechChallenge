import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

const connectFeatures = [
  {
    href: '#',
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Playdate Matchmaker',
    description: 'Find compatible playmates for your pet based on breed, size, and temperament.',
  },
];

export default function ConnectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">Connect</h1>
      <p className="text-muted-foreground mt-2">Connect with other pet owners.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectFeatures.map((tool) => (
          <Link href={tool.href} key={tool.title} className="group">
            <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {tool.icon}
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-4">
                  <CardTitle className="font-headline">{tool.title}</CardTitle>
                  <CardDescription className="mt-2">{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>More coming soon!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We're working on more ways for you to connect with the community.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
