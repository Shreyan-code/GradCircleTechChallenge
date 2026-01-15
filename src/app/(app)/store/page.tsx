import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function StorePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold tracking-tight font-headline">Pet Store Coming Soon!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
            We're busy fetching the best products for your furry friends. Get ready for a curated selection of toys, treats, food, and accessories.
        </p>
    </div>
  );
}
