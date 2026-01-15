'use client';

import type { Post } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, UserPlus, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showFullCaption, setShowFullCaption] = useState(false);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  const handleDoubleClick = () => {
    if (!isLiked) {
        toggleLike();
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const captionLines = post.caption.split('\n');
  const isLongCaption = post.caption.length > 120 || captionLines.length > 2;
  const displayCaption = isLongCaption && !showFullCaption
    ? post.caption.substring(0, 120) + '...'
    : post.caption;


  return (
    <Card className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-none border-0 md:border md:rounded-xl">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center text-left">
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={post.userPhoto} alt={post.userName} />
                    <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Follow</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Send DM</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-3">
          <p className="font-bold text-sm">{post.userName}</p>
          {post.petName && <Badge variant="secondary" className="text-xs -ml-1">{post.petName}</Badge>}
        </div>
        <div className="ml-auto">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-square md:aspect-auto md:min-h-[400px]" onDoubleClick={handleDoubleClick}>
        <Image src={post.image} alt={post.caption} layout="fill" objectFit="cover" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center p-4">
        <div className="flex gap-4">
          <button onClick={toggleLike}>
            <Heart className={cn("h-6 w-6 transition-all", isLiked ? 'text-red-500 fill-current' : 'text-foreground')} />
          </button>
          <MessageCircle className="h-6 w-6 text-foreground" />
          <Send className="h-6 w-6 text-foreground" />
        </div>
        <div className="ml-auto">
          <button onClick={toggleSave}>
            <Bookmark className={cn("h-6 w-6 transition-all", isSaved ? 'text-foreground fill-current' : 'text-foreground')} />
          </button>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="px-4 pb-2">
        <p className="font-bold text-sm">{likeCount.toLocaleString()} likes</p>
        <div className="text-sm mt-1">
            <span className="font-bold mr-2">{post.userName}</span>
            <span>
                {displayCaption}
                {isLongCaption && !showFullCaption && (
                    <button onClick={() => setShowFullCaption(true)} className="text-muted-foreground ml-1">more</button>
                )}
            </span>
        </div>
        
        {post.comments.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">View all {post.comments.length} comments</p>
        )}

         <p className="text-xs text-muted-foreground uppercase mt-2">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>

      </div>
      
      {/* Add Comment */}
      <div className="border-t px-4 py-2">
         <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
                <AvatarImage src={post.userPhoto} />
                <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Input type="text" placeholder="Add a comment..." className="border-0 bg-transparent h-auto p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
            <Button variant="ghost" size="sm">Post</Button>
         </div>
      </div>
    </Card>
  );
}

// A wrapper card component to deal with the no border on mobile but border on desktop requirement.
// The shadcn Card doesn't seem to play nice with removing border on mobile.
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return <div className={cn('bg-card text-card-foreground', className)}>{children}</div>;
}
