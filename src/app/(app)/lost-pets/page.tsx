'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockData as initialMockData } from "@/lib/mock-data";
import type { LostPetAlert } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Phone, MapPin, Share2, PlusCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { ReportPetForm } from "./report-pet-form";

export default function LostPetsPage() {
  const [mockData, setMockData] = useState(initialMockData);
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = (petName: string) => {
    navigator.clipboard.writeText(`Please help find ${petName}! More info on PetConnect.`);
    toast({
      title: "Link Copied!",
      description: `A shareable link for ${petName} has been copied to your clipboard.`,
    });
  };

  const handleReportPet = (newAlert: Omit<LostPetAlert, 'alertId' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone'>) => {
    const currentUser = mockData.users[0];
    const alertId = `lpa_${String(mockData.lostPetAlerts.length + 1).padStart(3, '0')}`;

    const fullAlert: LostPetAlert = {
      ...newAlert,
      alertId,
      ownerId: currentUser.userId,
      ownerName: currentUser.displayName,
      ownerPhone: "+91-9999988888", // Mock phone
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setMockData(prev => ({
      ...prev,
      lostPetAlerts: [fullAlert, ...prev.lostPetAlerts]
    }));

    setReportDialogOpen(false);
    toast({
      title: "Report Submitted",
      description: "Your lost pet report is under review and will be posted shortly.",
    });
  };

  const currentUserPets = mockData.pets.filter(p => p.ownerId === mockData.users[0].userId);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Lost & Found</h1>
            <p className="text-muted-foreground mt-2">Help reunite pets with their families. Report a lost or found pet.</p>
        </div>
        <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Report a Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report a Lost Pet</DialogTitle>
              <DialogDescription>
                Fill out the form below. Your report will be reviewed before being posted.
              </DialogDescription>
            </DialogHeader>
            <ReportPetForm userPets={currentUserPets} onSave={handleReportPet} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockData.lostPetAlerts.map(alert => (
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
