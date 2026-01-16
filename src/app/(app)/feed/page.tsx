'use client';
import { PostCard } from "@/components/feed/post-card";
import { StoriesCarousel } from "@/components/feed/stories-carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { mockData as initialMockData } from "@/lib/mock-data";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Post } from '@/lib/types';

export default function FeedPage() {
  const [posts, setPosts] = useState(initialMockData.posts);
  const { stories } = initialMockData;
  const { user } = useAuth();
  const { toast } = useToast();

  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null; // Or a loading spinner

  // Show all posts, newest first
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) {
      toast({
        variant: "destructive",
        title: "Incomplete Post",
        description: "Please select an image to post.",
      });
      return;
    }

    setIsSubmitting(true);

    const imageObjectURL = URL.createObjectURL(imageFile);

    const newPost: Post = {
      postId: `post_${Date.now()}`,
      userId: user.userId,
      userName: user.displayName,
      userPhoto: user.photoURL,
      image: imageObjectURL,
      caption: caption,
      likes: 0,
      likedBy: [],
      comments: [],
      saved: false,
      createdAt: new Date().toISOString(),
    };
    
    setTimeout(() => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setIsSubmitting(false);
        setCreatePostOpen(false);
        setCaption('');
        setImageFile(null);
        toast({
          title: "Post created!",
          description: "Your new post is live on the feed.",
        });
    }, 1000);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full md:max-w-2xl">
        <div className="px-4 md:px-0">
          <StoriesCarousel stories={stories} currentUser={user} />
        </div>
        <div className="mt-6 flex flex-col md:gap-8">
          {sortedPosts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold">You're all caught up!</p>
        </div>
      </div>
      
       <Dialog open={isCreatePostOpen} onOpenChange={setCreatePostOpen}>
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
          <form onSubmit={handleCreatePost}>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input id="picture" type="file" accept="image/*" required onChange={handleFileChange} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea id="caption" placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>
              <Button type="submit" disabled={isSubmitting || !imageFile}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Share
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
