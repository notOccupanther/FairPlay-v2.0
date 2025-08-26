"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Heart,
  DollarSign,
  TrendingUp,
  Clock,
  Music2,
  Trophy
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ArtistCard from "@/components/ArtistCard";
import DebugInfo from "@/components/DebugInfo";

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; width: number; height: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

export default function Home() {
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useState<{
    weekly: Artist[];
    monthly: Artist[];
    yearly: Artist[];
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [loading, setLoading] = useState(false);

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

  const handleConnectSpotify = () => {
    // This will trigger the Spotify OAuth flow
    window.location.href = '/api/auth/signin/spotify';
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading Fairplay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 px-8 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Fairplay</h1>
              <p className="text-gray-400">Support the artists you love, fairly</p>
            </div>
            
            {!session && (
              <button
                onClick={handleConnectSpotify}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                <Music2 className="w-5 h-5" />
                Connect with Spotify
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {!session ? (
            // Welcome Screen for Non-Authenticated Users
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8">
                  <Music2 className="w-24 h-24 text-green-400 mx-auto mb-6" />
                  <h2 className="text-5xl font-bold mb-6">
                    Support Artists
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                      {" "}Fairly
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Fairplay connects you with the artists you love most on Spotify. 
                    See your listening habits and support them directly with fair compensation.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center">
                    <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Discover Your Taste</h3>
                    <p className="text-gray-400">See your top artists weekly, monthly, and yearly</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Direct Support</h3>
                    <p className="text-gray-400">100% of your donation goes to the artist</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Fair Compensation</h3>
                    <p className="text-gray-400">Support artists at rates that reflect their value</p>
                  </div>
                </div>

                <button
                  onClick={handleConnectSpotify}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Music2 className="w-6 h-6" />
                  Get Started with Spotify
                </button>
              </motion.div>
            </div>
          ) : (
            // Authenticated User Dashboard
            <div className="space-y-8">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {session.user?.name || "Music Lover"}! 🎵
                </h2>
                <p className="text-green-100">
                  Ready to support the artists who soundtrack your life?
                </p>
                <p className="text-green-200 text-sm mt-2">
                  💡 Demo Mode: Donations are simulated for testing
                </p>
                
                {/* Charts Preview */}
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Live Charts
                    </h3>
                    <a
                      href="/charts"
                      className="text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                      View All Charts →
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm">
                    See the most supported artists in real-time. No corporate influence, just pure fan support.
                  </p>
                </div>
              </motion.div>

              {/* Top Artists Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Your Top Artists</h3>
                  <button
                    onClick={fetchTopArtists}
                    disabled={loading}
                    className="text-green-400 hover:text-green-300 text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

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
                  <div className="space-y-8">
                    {/* Weekly Top Artists */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        This Week's Favorites
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topArtists.weekly.slice(0, 4).map((artist) => (
                          <ArtistCard key={artist.id} artist={artist} timeRange="weekly" />
                        ))}
                      </div>
                    </div>

                    {/* Monthly Top Artists */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        This Month's Favorites
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topArtists.monthly.slice(0, 4).map((artist) => (
                          <ArtistCard key={artist.id} artist={artist} timeRange="monthly" />
                        ))}
                      </div>
                    </div>

                    {/* Yearly Top Artists */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-green-400" />
                        This Year's Favorites
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topArtists.yearly.slice(0, 4).map((artist) => (
                          <ArtistCard key={artist.id} artist={artist} timeRange="yearly" />
                        ))}
                      </div>
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
          )}
        </main>

        {/* Player Bar (Fixed at bottom) */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
              <div>
                <p className="text-sm font-medium">No song playing</p>
                <p className="text-xs text-gray-400">Connect to Spotify to start</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={currentVolume}
                onChange={(e) => setCurrentVolume(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Info (Development Only) */}
      <DebugInfo />
    </div>
  );
}
