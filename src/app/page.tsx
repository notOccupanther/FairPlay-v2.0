"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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
  Trophy,
  Users
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
  const { data: session, status, update } = useSession();
  const [topArtists, setTopArtists] = useState<{
    weekly: Artist[];
    monthly: Artist[];
    yearly: Artist[];
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [loading, setLoading] = useState(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [sessionCheckCount, setSessionCheckCount] = useState(0);
  const [lastSessionCheck, setLastSessionCheck] = useState(0);

  // Prevent excessive session checks
  useEffect(() => {
    const now = Date.now();
    if (now - lastSessionCheck < 5000) { // Only check every 5 seconds
      return;
    }
    
    if (session?.accessToken && sessionCheckCount < 3) { // Limit to 3 checks
      setLastSessionCheck(now);
      setSessionCheckCount(prev => prev + 1);
      
      const checkSession = async () => {
        try {
          await update();
        } catch (error) {
          console.error('Session refresh failed:', error);
        }
      };
      
      checkSession();
    }
  }, [session?.accessToken, update, lastSessionCheck, sessionCheckCount]);

  // Clean up #_=_ redirect issue that causes loops
  useEffect(() => {
    if (window.location.hash === '#_=_') {
      // Remove the problematic hash
      window.location.hash = '';
      // Clean up the URL without causing a page reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Debounced session check to prevent loops
  useEffect(() => {
    if (session?.accessToken && !topArtists) {
      // Only fetch artists once when session is established and we don't have them
      const timeoutId = setTimeout(() => {
        fetchTopArtists();
      }, 2000); // Wait 2 seconds to avoid rapid calls

      return () => clearTimeout(timeoutId);
    }
  }, [session?.accessToken, topArtists]); // Only depend on accessToken and topArtists

  const fetchTopArtists = async () => {
    setLoading(true);
    setSpotifyError(null);
    
    try {
      const response = await fetch('/api/spotify/top-artists');
      if (response.ok) {
        const data = await response.json();
        setTopArtists(data);
      } else {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (errorData.code === "TOKEN_EXPIRED") {
          // Token expired, user needs to re-authenticate
          console.log("Spotify token expired, redirecting to re-authenticate");
          setSpotifyError("Your Spotify session has expired. Please sign in again.");
          // Force a new authentication flow
          setTimeout(() => {
            window.location.href = '/api/auth/signin/spotify';
          }, 2000);
          return;
        }
        
        if (errorData.code === "INSUFFICIENT_PERMISSIONS") {
          setSpotifyError("Spotify requires additional permissions. Please sign in again.");
          setTimeout(() => {
            window.location.href = '/api/auth/signin/spotify';
          }, 2000);
          return;
        }
        
        // For other errors, show the message
        console.error('Spotify API error:', errorData);
        setSpotifyError(errorData.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error fetching top artists:', error);
      setSpotifyError('Network error while loading artists. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSpotify = () => {
    // Use NextAuth's signIn method instead of manual redirect
    signIn("spotify");
  };

  // Show loading state only when status is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading Fairplay...</p>
          <p className="text-gray-400 text-sm mt-2">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Session status:', status);
  console.log('Session data:', session);

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

                {/* Community Preview */}
                <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Community Activity
                    </h3>
                    <a
                      href="/community"
                      className="text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                      Join Community →
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm">
                    See real-time donations and connect with other music supporters. Build the future of fair music together.
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

                {/* Spotify Error Display */}
                {spotifyError && (
                  <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <div>
                        <p className="text-red-200 font-medium">Spotify Connection Issue</p>
                        <p className="text-red-300 text-sm">{spotifyError}</p>
                        <button
                          onClick={() => window.location.href = '/api/auth/signin/spotify'}
                          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                        >
                          Reconnect with Spotify
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
