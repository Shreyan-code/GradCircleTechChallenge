export type User = {
  userId: string;
  email: string;
  password?: string;
  displayName: string;
  photoURL: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  bio: string;
  joinedAt: string;
  postCount: number;
  petCount: number;
  followers: number;
  following: number;
  petIds: string[];
};

export type Pet = {
  petId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Rabbit';
  breed: string;
  gender: 'Male' | 'Female';
  age: {
    years: number;
    months: number;
  };
  birthDate: string;
  color: string;
  weight: number;
  photo: string;
  specialNeeds: string;
  activityLevel: number;
  microchipId: string;
  createdAt: string;
};

export type PostComment = {
  commentId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  timestamp: string;
};

export type Post = {
  postId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  petId?: string;
  petName?: string;
  image: string;
  caption: string;
  likes: number;
  likedBy: string[];
  comments: PostComment[];
  saved: boolean;
  createdAt: string;
};

export type Story = {
  storyId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  storyImage: string;
  timestamp: string;
  expiresAt: string;
};

export type EventAttendee = {
  userId: string;
  userName: string;
  userPhoto: string;
  rsvpDate: string;
};

export type Event = {
  eventId: string;
  organizerId: string;
  organizerName: string;
  organizerPhoto: string;
  title: string;
  description: string;
  bannerImage: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    venue: string;
    city: string;
    address: string;
    landmark: string;
  };
  petTypes: ('Dogs' | 'Cats' | 'All Pets')[];
  maxAttendees: number | null;
  isFree: boolean;
  attendeeCount: number;
  attendees: EventAttendee[];
  status: 'upcoming' | 'past' | 'cancelled';
  createdAt: string;
};

export type ForumReply = {
  replyId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  timestamp: string;
};

export type ForumTopic = {
  topicId: string;
  categoryId: 'dog-talk' | 'cat-corner' | 'all-pets';
  userId: string;
  userName: string;
  userPhoto: string;
  title: string;
  content: string;
  views: number;
  replyCount: number;
  lastReplyAt: string;
  createdAt: string;
  replies: ForumReply[];
};

export type LostPetTip = {
  tipId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  sightingLocation: string;
  sightingDate: string;
  sightingTime: string;
  description: string;
  verified: boolean;
  createdAt: string;
};

export type LostPetAlert = {
  alertId: string;
  status: 'active' | 'found';
  ownerId: string;
  ownerName: string;
  ownerPhoto: string;
  ownerPhone: string;
  petId: string;
  petName: string;
  petType: 'Dog' | 'Cat' | 'Rabbit';
  breed: string;
  age: {
    years: number;
    months: number;
  };
  gender: 'Male' | 'Female';
  color: string;
  petPhoto: string;
  distinctiveMarks: string;
  lastSeenLocation: {
    address: string;
    city: string;
    landmark: string;
  };
  lastSeenDate: string;
  lastSeenTime: string;
  description: string;
  reward: number;
  microchipId: string;
  views: number;
  shares: number;
  tips: LostPetTip[];
  createdAt: string;
};

export type TipArticle = {
  articleId: string;
  category: 'dog-care' | 'cat-care' | 'training' | 'nutrition' | 'health' | 'grooming' | 'behavior';
  title: string;
  summary: string;
  featuredImage: string;
  author: string;
  publishedDate: string;
  readTime: string;
  content: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedArticles: string[];
};

export type Message = {
  messageId: string;
  senderId: string;
  text: string;
  readBy: string[];
  createdAt: string;
};

export type Conversation = {
  conversationId: string;
  participants: string[];
  lastMessage: string;
  lastMessageBy: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
  messages: Message[];
  createdAt: string;
};

export type MockData = {
  users: User[];
  pets: Pet[];
  posts: Post[];
  stories: Story[];
  events: Event[];
  forumTopics: ForumTopic[];
  lostPetAlerts: LostPetAlert[];
  tipArticles: TipArticle[];
  conversations: Conversation[];
};
