"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Music2, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ArtistCard from "@/components/ArtistCard";

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; width: number; height: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

export default function ArtistsPage() {
  const { data: session, status } = useSession();
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorites" | "top">("all");

  useEffect(() => {
    if (session?.accessToken) {
      fetchAllArtists();
    }
  }, [session]);

  const fetchAllArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/spotify/top-artists');
      if (response.ok) {
        const data = await response.json();
        // Combine all time ranges and remove duplicates
        const combined = [...data.yearly, ...data.monthly, ...data.weekly];
        const unique = combined.filter((artist, index, self) => 
          index === self.findIndex(a => a.id === artist.id)
        );
        setAllArtists(unique);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredArtists = () => {
    switch (filter) {
      case "favorites":
        return allArtists.filter(artist => 
          // TODO: Implement favorites filtering
          false
        );
      case "top":
        return allArtists.slice(0, 20); // Top 20 by popularity
      default:
        return allArtists;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect to Spotify</h2>
          <p className="text-gray-400 mb-6">Sign in to see all artists</p>
          <a
            href="/api/auth/signin/spotify"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Connect with Spotify
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Users className="w-10 h-10 text-green-400" />
            All Artists
          </h1>
          <p className="text-xl text-gray-400">
            Discover and support all the artists in your music library
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { key: "all", label: "All Artists", icon: Users },
              { key: "favorites", label: "Favorites", icon: Heart },
              { key: "top", label: "Top Artists", icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  filter === key
                    ? "bg-green-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mb-8">
          <button
            onClick={fetchAllArtists}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loading ? "Refreshing..." : "Refresh Artists"}
          </button>
        </div>

        {/* Artists Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            {loading ? "Loading..." : `${getFilteredArtists().length} artists found`}
          </p>
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : allArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getFilteredArtists().map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No artists found yet</p>
            <button
              onClick={fetchAllArtists}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Load Your Artists
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
