"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Music2, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // TODO: Implement Spotify artist search API
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([]);
    }, 1000);
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
          <p className="text-gray-400 mb-6">Sign in to search for artists</p>
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
            <Search className="w-10 h-10 text-green-400" />
            Search Artists
          </h1>
          <p className="text-xl text-gray-400">
            Discover new artists and support them directly
          </p>
        </motion.div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for artists, bands, or musicians..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Searching for artists...</p>
          </div>
        )}

        {searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Start Searching</h3>
            <p className="text-gray-400">
              Enter an artist name above to discover and support them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
