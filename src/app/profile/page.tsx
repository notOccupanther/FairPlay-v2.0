"use client";

import { useSession } from "next-auth/react";
import { User, Music2, Heart, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
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
          <p className="text-gray-400 mb-6">Sign in to view your profile</p>
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <User className="w-10 h-10 text-green-400" />
            Your Profile
          </h1>
          <p className="text-xl text-gray-400">
            Manage your account and view your activity
          </p>
        </motion.div>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {session.user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{session.user?.name || "User"}</h2>
              <p className="text-gray-400">{session.user?.email}</p>
              <p className="text-green-400 text-sm">Connected to Spotify</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">0</h3>
            <p className="text-gray-400">Favorite Artists</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">$0</h3>
            <p className="text-gray-400">Total Donated</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">0</h3>
            <p className="text-gray-400">Donations Made</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No recent activity yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start supporting artists to see your activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
