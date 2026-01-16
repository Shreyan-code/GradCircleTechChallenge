'use client';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { mockData } from '@/lib/mock-data';
import {
  Bell,
  Calendar,
  Heart,
  Home,
  MessageSquare,
  Settings,
  AlertTriangle,
  Sparkles,
  Users,
  Lightbulb,
  PawPrint,
  Store,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PawPrintIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/search-bar';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  isAI?: boolean;
  comingSoon?: boolean;
  isAlert?: boolean;
};

const navItems: NavItem[] = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/forums', icon: MessageSquare, label: 'Forums' },
  { href: '/events', icon: Calendar, label: 'Events & Meetups' },
  { href: '/connect', icon: Users, label: 'Connect', isAI: true },
  { href: '/health', icon: Heart, label: 'Health Tools', isAI: true },
  { href: '/tips', icon: Lightbulb, label: 'Tips & Advice', isAI: true },
  { href: '/lost-pets', icon: AlertTriangle, label: 'Lost & Found', isAlert: true },
  { href: '/adopt', icon: PawPrint, label: 'Adopt a Pet' },
  { href: '/store', icon: Store, label: 'Pet Store', comingSoon: true },
  { href: '/messages', icon: Bell, label: 'Messages' },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();


  if (!user) {
    // Or a loading spinner
    return null;
  }
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  const conversations = mockData.conversations.filter(c => c.participants.includes(user.userId));
  const totalUnread = conversations.reduce((acc, convo) => acc + (convo.unreadCount[user.userId] || 0), 0);

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/feed" className="flex items-center gap-2.5" onClick={handleLinkClick}>
            <PawPrintIcon className="size-7 shrink-0 text-primary" />
            <span className="font-bold text-lg text-foreground font-headline">PetConnect</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full" onClick={handleLinkClick}>
                  <SidebarMenuButton tooltip={item.label} size="lg">
                    <Icon className={cn(item.isAlert && "text-destructive")} />
                    <span className={cn("flex items-center gap-2", item.isAlert && "text-destructive")}>{item.label}</span>
                    {item.isAI && <Sparkles className="w-4 h-4 text-primary" />}
                    {item.comingSoon && <Badge variant="outline" className="text-xs ml-auto">Coming Soon</Badge>}
                    {item.href === '/messages' && totalUnread > 0 && (
                       <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {totalUnread}
                      </span>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full h-14 p-2 text-left">
                <Avatar className='size-9'>
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='ml-2 text-sm overflow-hidden'>
                    <p className='font-semibold truncate'>{user.displayName}</p>
                    <p className='text-muted-foreground truncate'>{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href={`/profile/${user.userId}`}>Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <SearchBar />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
