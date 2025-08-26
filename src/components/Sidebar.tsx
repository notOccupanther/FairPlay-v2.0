"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  LogOut, 
  Music2, 
  TrendingUp,
  Users,
  Settings,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("home");

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "charts", label: "Charts", icon: Trophy, href: "/charts" },
    { id: "community", label: "Community", icon: Users, href: "/community" },
    { id: "search", label: "Search Artists", icon: Search, href: "/search" },
    { id: "top-artists", label: "Your Top Artists", icon: TrendingUp, href: "/charts" },
    { id: "favorites", label: "Favorites", icon: Heart, href: "/favorites" },
    { id: "artists", label: "Artists", icon: Users, href: "/artists" },
  ];

  // Add artist dashboard if user is logged in
  if (session?.user) {
    navigationItems.push(
      { id: "dashboard", label: "Artist Dashboard", icon: TrendingUp, href: "/artists/dashboard" }
    );
  }

  const bottomItems = [
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  if (status === "loading") {
    return (
      <div className={cn("w-64 bg-gray-900 text-white p-6", className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-64 bg-gray-900 text-white p-6 flex flex-col", className)}>
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music2 className="text-green-400" />
          Fairplay
        </h1>
        <p className="text-gray-400 text-sm">Support Artists Fairly</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 pt-6">
        {session ? (
          <>
            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {session.user?.name?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Bottom Navigation */}
            <ul className="space-y-2">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Sign Out */}
            <button
              onClick={() => signOut()}
              className="w-full mt-4 flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("spotify")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Music2 className="w-5 h-5" />
            Connect with Spotify
          </button>
        )}
      </div>
    </div>
  );
}
