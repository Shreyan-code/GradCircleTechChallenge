'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Phone, MapPin, Share2, PlusCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function LostPetsPage() {
  const { lostPetAlerts } = mockData;
  const { toast } = useToast();

  const handleShare = (petName: string) => {
    navigator.clipboard.writeText(`Please help find ${petName}! More info on PetConnect.`);
    toast({
      title: "Link Copied!",
      description: `A shareable link for ${petName} has been copied to your clipboard.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Lost & Found</h1>
            <p className="text-muted-foreground mt-2">Help reunite pets with their families. Report a lost or found pet.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report a Pet
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lostPetAlerts.map(alert => (
          <Card key={alert.alertId} className="flex flex-col">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                    <Image src={alert.petPhoto} alt={alert.petName} fill className="object-cover rounded-t-lg" />
                     <Badge 
                        className={cn(
                            "absolute top-3 right-3 text-white",
                            alert.status === 'active' ? "bg-destructive hover:bg-destructive/80" : "bg-green-600 hover:bg-green-700"
                        )}
                    >
                        {alert.status === 'active' ? (
                            <AlertTriangle className="h-3 w-3 mr-1.5" />
                        ): null}
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <CardTitle className="font-headline text-2xl mb-2">{alert.petName}</CardTitle>
                <CardDescription>{alert.description}</CardDescription>
                <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                            <span className="font-semibold">Last Seen:</span> {alert.lastSeenLocation.address}, {alert.lastSeenLocation.city} on {format(new Date(alert.lastSeenDate), 'PPP')}
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Phone className="w-4 h-4 mr-3 mt-0.5 text-muted-foreground" />
                         <div>
                            <span className="font-semibold">Contact:</span> {alert.ownerName} ({alert.ownerPhone})
                        </div>
                    </div>
                     {alert.reward > 0 && (
                        <div className="flex items-start">
                            <span className="text-lg mr-3 mt-0.5">💰</span>
                            <div>
                                <span className="font-semibold">Reward:</span> ₹{alert.reward.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                {alert.status === 'active' ? (
                    <Button className="w-full" onClick={() => handleShare(alert.petName)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Alert
                    </Button>
                ) : (
                    <Button disabled className="w-full">
                        Reunited!
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
