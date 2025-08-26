"use client";

import { useSession } from "next-auth/react";
import { Heart, Music2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoritesPage() {
  const { data: session, status } = useSession();

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
          <p className="text-gray-400 mb-6">Sign in to see your favorite artists</p>
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
            <Heart className="w-10 h-10 text-red-400" />
            Your Favorites
          </h1>
          <p className="text-xl text-gray-400">
            Artists you've marked as favorites and want to support
          </p>
        </motion.div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for now - will be populated with real favorites */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 text-sm">
              Like artists from your top artists to see them here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
