"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, Music2, Clock, Heart } from "lucide-react";
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

export default function TopArtistsPage() {
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useState<{
    weekly: Artist[];
    monthly: Artist[];
    yearly: Artist[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState<"weekly" | "monthly" | "yearly">("yearly");

  useEffect(() => {
    if (session?.accessToken) {
      fetchTopArtists();
    }
  }, [session]);

  const fetchTopArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/spotify/top-artists');
      if (response.ok) {
        const data = await response.json();
        setTopArtists(data);
      }
    } catch (error) {
      console.error('Error fetching top artists:', error);
    } finally {
      setLoading(false);
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
          <p className="text-gray-400 mb-6">Sign in to see your top artists</p>
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

  const getTimeRangeData = () => {
    if (!topArtists) return [];
    return topArtists[activeTimeRange] || [];
  };

  const getTimeRangeIcon = () => {
    switch (activeTimeRange) {
      case "weekly": return <Clock className="w-5 h-5" />;
      case "monthly": return <TrendingUp className="w-5 h-5" />;
      case "yearly": return <Heart className="w-5 h-5" />;
    }
  };

  const getTimeRangeLabel = () => {
    switch (activeTimeRange) {
      case "weekly": return "This Week";
      case "monthly": return "This Month";
      case "yearly": return "This Year";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-green-400" />
            Your Top Artists
          </h1>
          <p className="text-xl text-gray-400">
            Discover and support the artists you listen to most
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {(["weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveTimeRange(range)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTimeRange === range
                    ? "bg-green-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {range === "weekly" && "Weekly"}
                {range === "monthly" && "Monthly"}
                {range === "yearly" && "Yearly"}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mb-8">
          <button
            onClick={fetchTopArtists}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loading ? "Refreshing..." : "Refresh Artists"}
          </button>
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : topArtists ? (
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              {getTimeRangeIcon()}
              <h2 className="text-2xl font-semibold">{getTimeRangeLabel()}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getTimeRangeData().map((artist) => (
                <ArtistCard key={artist.id} artist={artist} timeRange={activeTimeRange} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No top artists found yet</p>
            <button
              onClick={fetchTopArtists}
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
