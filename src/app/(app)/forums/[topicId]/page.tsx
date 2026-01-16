
'use client';
import { useParams, notFound, useRouter } from 'next/navigation';
import { mockData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForumTopicPage() {
  const params = useParams<{ topicId: string }>();
  const router = useRouter();
  const topic = mockData.forumTopics.find(t => t.topicId === params.topicId);

  if (!topic) {
    notFound();
  }
  
  const replies = topic.replies || [];

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forums
        </Button>
      </div>
      
      {/* Original Post */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
            <Avatar className="w-12 h-12 border">
                <AvatarImage src={topic.userPhoto} />
                <AvatarFallback>{topic.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-2xl font-headline">{topic.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                    By <Link href={`/profile/${topic.userId}`} className="font-semibold text-primary hover:underline">{topic.userName}</Link> on {format(new Date(topic.createdAt), 'PPP')}
                </p>
            </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 whitespace-pre-wrap">{topic.content}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
             <Button variant="outline">
                <ThumbsUp className="mr-2 h-4 w-4" /> Upvote
             </Button>
            <Button>
                <MessageSquare className="mr-2 h-4 w-4" /> Reply
            </Button>
        </CardFooter>
      </Card>
      
      <Separator className="my-8" />
      
      {/* Replies */}
      <h2 className="text-xl font-bold mb-4">{topic.replyCount} Replies</h2>
      <div className="space-y-6">
        {replies.map((reply, index) => (
          <Card key={reply.replyId} className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="w-10 h-10 border">
                    <AvatarImage src={reply.userPhoto} />
                    <AvatarFallback>{reply.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <Link href={`/profile/${reply.userId}`} className="font-semibold text-foreground hover:underline">{reply.userName}</Link>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}</p>
                </div>
            </CardHeader>
            <CardContent>
                <p>{reply.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Reply Form */}
      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Your Reply</CardTitle>
        </CardHeader>
        <CardContent>
            <Textarea rows={5} placeholder="Write your reply here..." />
        </CardContent>
        <CardFooter>
            <Button>Post Reply</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
