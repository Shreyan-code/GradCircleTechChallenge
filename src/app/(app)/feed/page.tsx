import { PostCard } from "@/components/feed/post-card";
import { StoriesCarousel } from "@/components/feed/stories-carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockData } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function FeedPage() {
  const { posts, stories, users } = mockData;
  const currentUser = users[0];

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl">
        <StoriesCarousel stories={stories} currentUser={currentUser} />
        <div className="mt-6 flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold">You're all caught up!</p>
        </div>
      </div>
      
       <Dialog>
        <DialogTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
                <Plus className="h-8 w-8" />
                <span className="sr-only">Create Post</span>
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea id="caption" placeholder="Write a caption..." />
            </div>
            <Button type="submit">Share</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
