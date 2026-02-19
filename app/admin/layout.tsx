"use client";

import type React from "react";

import { useState, useEffect, useMemo, memo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  WalletCards,
  Compass,
  MapPin,
  Plane,
  ShoppingCart,
  Users,
  Settings,
  TramFront,
  LogOut,
  Search,
  LayoutPanelTop,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Loading fallback for sidebar menu
const SidebarMenuSkeleton = () => {
  return (
    <div className="space-y-2 p-2">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
    </div>
  );
};

// Memoize the sidebar menu to prevent unnecessary re-renders
const SidebarMenuContent = memo(() => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="#">
            <Rss className="h-4 w-4 mr-2" />
            <span>Partner API</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/external/cities">Cities List</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/external/tags">Tags List</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/external/categories">Categories List</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="#">
            <LayoutPanelTop className="h-4 w-4 mr-2" />
            <span>Banner & Promotion</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/banner/list">Banner List</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin/tours">
            <Compass className="h-4 w-4 mr-2" />
            <span>Tours</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/tours/list">All Tours</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/tours/add">Add Tour</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>


      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="#">
            <Plane className="h-4 w-4 mr-2" />
            <span>Tickets</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/tickets/flights">Flight Bookings</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/tickets/ferry">Ferry Bookings</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin/transfer">
            <TramFront className="h-4 w-4 mr-2" />
            <span>Transfer</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/transfer/list">Transfer List</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link href="/admin/transfer/add">Add Transfer</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin/service-bookings">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Services Orders List</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin/hotels-bookings">
            <WalletCards className="h-4 w-4 mr-2" />
            <span>Hotel Orders List</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/admin/settings">
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
SidebarMenuContent.displayName = "SidebarMenuContent";

// Loading fallback for user profile
const UserProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
};

// Memoize the user profile component
const UserProfile = memo(
  ({
    user,
    onLogout,
  }: {
    user: { username: string; email: string } | null;
    onLogout: () => void;
  }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Admin"
            />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
UserProfile.displayName = "UserProfile";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );

  useEffect(() => {
    // Only fetch user data once on component mount
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") ||
        '{"username": "Guest", "email": "guest@example.com"}'
      );
      setUser(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser({ username: "Guest", email: "guest@example.com" });
    }
  }, []);

  // Memoize the logout handler to prevent recreation on each render
  const handleLogout = useMemo(
    () => async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Logout failed");
        localStorage.clear();
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    []
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-4 py-4">
            <div className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg font-semibold">LTA Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Suspense fallback={<SidebarMenuSkeleton />}>
              <SidebarMenuContent />
            </Suspense>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserProfile user={user} onLogout={handleLogout} />
            </Suspense>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col w-full">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-8 bg-background"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 w-full h-full">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg">Loading...</p>
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
