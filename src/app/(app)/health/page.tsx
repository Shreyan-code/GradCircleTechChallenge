import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const healthTools = [
  {
    href: '/health/symptom-checker',
    icon: <Stethoscope className="w-8 h-8 text-primary" />,
    title: 'AI Symptom Checker',
    description: 'Analyze your pet\'s symptoms and get potential insights and recommendations.',
  },
  {
    href: '/health/advisor',
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'AI Health Advisor',
    description: 'Chat with our AI for personalized health and wellness advice for your pet.',
  },
];

export default function HealthPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">Health Tools</h1>
      <p className="text-muted-foreground mt-2">AI-powered tools to help you care for your pet.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthTools.map((tool) => (
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
      </div>
    </div>
  );
}
