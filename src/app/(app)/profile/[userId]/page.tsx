import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage({ params }: { params: { userId: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the profile page for user: {params.userId}. Coming soon!</p>
      </CardContent>
    </Card>
  );
}
