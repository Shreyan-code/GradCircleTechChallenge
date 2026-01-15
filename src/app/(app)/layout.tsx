import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { mockData } from '@/lib/mock-data';
import {
  Bell,
  Calendar,
  Heart,
  Home,
  MessageSquare,
  Search,
  Settings,
  ShieldQuestion,
  Sparkles,
  Users,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { PawPrintIcon } from '@/components/icons';

const navItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/connect', icon: Users, label: 'Connect', isAI: true },
  { href: '/health', icon: Sparkles, label: 'Health Tools', isAI: true },
  { href: '/lost-pets', icon: ShieldQuestion, label: 'Lost & Found' },
  { href: '/forums', icon: MessageSquare, label: 'Forums' },
  { href: '/events', icon: Calendar, label: 'Events & Meetups' },
  { href: '/tips', icon: Lightbulb, label: 'Tips & Advice' },
  { href: '/messages', icon: Bell, label: 'Messages' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // For demo purposes, we'll use the first mock user as the logged-in user.
  const currentUser = mockData.users[0];
  const conversations = mockData.conversations.filter(c => c.participants.includes(currentUser.userId));
  const totalUnread = conversations.reduce((acc, convo) => acc + (convo.unreadCount[currentUser.userId] || 0), 0);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/feed" className="flex items-center gap-2.5">
            <PawPrintIcon className="size-7 shrink-0 text-primary" />
            <span className="font-bold text-lg text-foreground font-headline">PetConnect</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton tooltip={item.label} size="lg">
                    <item.icon />
                    <span className="flex items-center gap-2">{item.label}</span>
                    {item.isAI && <Sparkles className="w-4 h-4 text-primary" />}
                    {item.href === '/messages' && totalUnread > 0 && (
                       <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {totalUnread}
                      </span>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full h-14 p-2 text-left">
                <Avatar className='size-9'>
                  <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName} />
                  <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='ml-2 text-sm overflow-hidden'>
                    <p className='font-semibold truncate'>{currentUser.displayName}</p>
                    <p className='text-muted-foreground truncate'>{currentUser.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href={`/profile/${currentUser.userId}`}>Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts, pets, or people..."
              className="w-full rounded-lg bg-secondary pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
