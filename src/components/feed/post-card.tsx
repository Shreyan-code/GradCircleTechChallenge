'use client';

import type { Post, PostComment } from '@/lib/types';
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
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>(post.comments);

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

  const handleCommentSubmit = () => {
    if (!comment.trim() || !user) return;

    const newComment: PostComment = {
      commentId: `cmt_${Date.now()}`,
      userId: user.userId,
      userName: user.displayName,
      userPhoto: user.photoURL,
      text: comment,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setComment('');
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.postId}`;
    navigator.clipboard.writeText(postUrl);
    toast({
      title: 'Link Copied!',
      description: 'A link to this post has been copied to your clipboard.',
    });
  };

  const captionLines = post.caption.split('\n');
  const isLongCaption = post.caption.length > 120 || captionLines.length > 2;
  const displayCaption =
    isLongCaption && !showFullCaption ? post.caption.substring(0, 120) + '...' : post.caption;

  return (
    <Card className="bg-card text-card-foreground md:rounded-lg overflow-hidden shadow-none md:border-b">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-left">
              <Avatar className="w-10 h-10">
                <Link href={`/profile/${post.userId}`}>
                  <AvatarImage src={post.userPhoto} alt={post.userName} />
                </Link>
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
          <Link href={`/profile/${post.userId}`}>
            <p className="font-bold text-sm hover:underline">{post.userName}</p>
          </Link>
          {post.petName && <Badge variant="secondary" className="text-xs -ml-1">{post.petName}</Badge>}
        </div>
        <div className="ml-auto">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-square" onDoubleClick={handleDoubleClick}>
        <Image src={post.image} alt={post.caption} layout="fill" objectFit="cover" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center p-4">
        <div className="flex gap-4">
          <button onClick={toggleLike}>
            <Heart
              className={cn('h-6 w-6 transition-all', isLiked ? 'text-red-500 fill-current' : 'text-foreground')}
            />
          </button>
          <button>
            <MessageCircle className="h-6 w-6 text-foreground" />
          </button>
          <button onClick={handleShare}>
            <Send className="h-6 w-6 text-foreground" />
          </button>
        </div>
        <div className="ml-auto">
          <button onClick={toggleSave}>
            <Bookmark className={cn('h-6 w-6 transition-all', isSaved ? 'text-foreground fill-current' : 'text-foreground')} />
          </button>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="px-4 pb-2">
        <p className="font-bold text-sm">{likeCount.toLocaleString()} likes</p>
        <div className="text-sm mt-1">
          <Link href={`/profile/${post.userId}`}>
            <span className="font-bold mr-2 hover:underline">{post.userName}</span>
          </Link>
          <span>
            {displayCaption}
            {isLongCaption && !showFullCaption && (
              <button onClick={() => setShowFullCaption(true)} className="text-muted-foreground ml-1">
                more
              </button>
            )}
          </span>
        </div>

        {comments.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted-foreground">View all {comments.length} comments</p>
            {comments.slice(-2).map((comment) => (
              <div key={comment.commentId} className="text-sm">
                <Link href={`/profile/${comment.userId}`}>
                  <span className="font-bold mr-2 hover:underline">{comment.userName}</span>
                </Link>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground uppercase mt-2">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Add Comment */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback>{user?.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="Add a comment..."
            className="border-0 bg-transparent h-auto p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
          />
          <Button variant="ghost" size="sm" onClick={handleCommentSubmit} disabled={!comment.trim()}>
            Post
          </Button>
        </div>
      </div>
    </Card>
  );
}

// A wrapper card component to deal with the no border on mobile but border on desktop requirement.
// The shadcn Card doesn't seem to play nice with removing border on mobile.
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn('bg-card text-card-foreground', className)}>{children}</div>;
};
