"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Users, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  MessageCircle,
  Share2,
  Globe,
  Award,
  Clock,
  Star,
  Zap
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CommunityActivity {
  recentDonations: Array<{
    id: string;
    artistName: string;
    supporterName: string;
    amount: number;
    message?: string;
    timestamp: string;
    isAnonymous: boolean;
  }>;
  topSupporters: Array<{
    name: string;
    totalDonations: number;
    artistsSupported: number;
    lastActive: string;
    avatar?: string;
  }>;
  trendingArtists: Array<{
    name: string;
    totalDonations: number;
    newSupporters: number;
    growth: string;
    image: string;
  }>;
  communityStats: {
    totalDonations: number;
    totalSupporters: number;
    totalArtists: number;
    totalAmount: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [communityData, setCommunityData] = useState<CommunityActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"activity" | "supporters" | "trending">("activity");

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      // Mock community data - will integrate with real API later
      const mockData: CommunityActivity = {
        recentDonations: [
          { id: "1", artistName: "Taylor Swift", supporterName: "Sarah M.", amount: 50, message: "Love your music! 💕", timestamp: "2024-01-15T10:30:00Z", isAnonymous: false },
          { id: "2", artistName: "Drake", supporterName: "Mike R.", amount: 25, message: "Keep making amazing songs!", timestamp: "2024-01-15T09:15:00Z", isAnonymous: false },
          { id: "3", artistName: "The Weeknd", supporterName: "Emma L.", amount: 100, message: "You're my favorite artist!", timestamp: "2024-01-15T08:45:00Z", isAnonymous: false },
          { id: "4", artistName: "Post Malone", supporterName: "Anonymous", amount: 75, message: "Thanks for the inspiration", timestamp: "2024-01-15T08:20:00Z", isAnonymous: true },
          { id: "5", artistName: "Ed Sheeran", supporterName: "David P.", amount: 30, message: "Amazing concert last night!", timestamp: "2024-01-15T07:55:00Z", isAnonymous: false },
          { id: "6", artistName: "Billie Eilish", supporterName: "Alex K.", amount: 45, message: "Your lyrics speak to my soul", timestamp: "2024-01-15T07:30:00Z", isAnonymous: false },
          { id: "7", artistName: "Dua Lipa", supporterName: "Maria S.", amount: 60, message: "Future Nostalgia is perfect!", timestamp: "2024-01-15T07:15:00Z", isAnonymous: false },
          { id: "8", artistName: "Olivia Rodrigo", supporterName: "Anonymous", amount: 40, message: "Sour is everything!", timestamp: "2024-01-15T07:00:00Z", isAnonymous: true },
        ],
        topSupporters: [
          { name: "Emma L.", totalDonations: 1200, artistsSupported: 8, lastActive: "2 hours ago", avatar: "E" },
          { name: "Sarah M.", totalDonations: 850, artistsSupported: 6, lastActive: "1 hour ago", avatar: "S" },
          { name: "Alex K.", totalDonations: 650, artistsSupported: 5, lastActive: "3 hours ago", avatar: "A" },
          { name: "Mike R.", totalDonations: 450, artistsSupported: 4, lastActive: "4 hours ago", avatar: "M" },
          { name: "David P.", totalDonations: 320, artistsSupported: 3, lastActive: "5 hours ago", avatar: "D" },
        ],
        trendingArtists: [
          { name: "Taylor Swift", totalDonations: 15420, newSupporters: 23, growth: "+15%", image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0" },
          { name: "Drake", totalDonations: 12850, newSupporters: 18, growth: "+12%", image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9f" },
          { name: "The Weeknd", totalDonations: 11200, newSupporters: 21, growth: "+18%", image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c4e504b4bb" },
          { name: "Post Malone", totalDonations: 9870, newSupporters: 15, growth: "+8%", image: "https://i.scdn.co/image/ab6761610000e5eb6be070445e02f8dbf9c466a88" },
          { name: "Ed Sheeran", totalDonations: 8760, newSupporters: 12, growth: "+6%", image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f380d4fd8b7c9" },
        ],
        communityStats: {
          totalDonations: 15420,
          totalSupporters: 89,
          totalArtists: 156,
          totalAmount: 234000,
          thisWeek: 45600,
          thisMonth: 198000
        }
      };
      
      setCommunityData(mockData);
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Community data not available</p>
          <button
            onClick={fetchCommunityData}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Fairplay Community</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join thousands of music lovers supporting artists directly and fairly. 
              See the impact of your support in real-time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-green-400">{formatCurrency(communityData.communityStats.totalAmount)}</p>
            <p className="text-gray-400">Total Support</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-blue-400">{communityData.communityStats.totalSupporters.toLocaleString()}</p>
            <p className="text-gray-400">Active Supporters</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-red-400">{communityData.communityStats.totalArtists}</p>
            <p className="text-gray-400">Artists Supported</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-purple-400">{formatCurrency(communityData.communityStats.thisWeek)}</p>
            <p className="text-gray-400">This Week</p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 mb-8">
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { key: "activity", label: "Live Activity", icon: Zap },
              { key: "supporters", label: "Top Supporters", icon: Award },
              { key: "trending", label: "Trending Artists", icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === key
                    ? "bg-green-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Live Community Activity
              </h2>
              <div className="space-y-4">
                {communityData.recentDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {donation.isAnonymous ? "?" : donation.supporterName.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {donation.isAnonymous ? "Anonymous Supporter" : donation.supporterName}
                        </span>
                        <span className="text-gray-400">supported</span>
                        <span className="font-semibold text-green-400">{donation.artistName}</span>
                      </div>
                      {donation.message && (
                        <p className="text-gray-300 text-sm italic">"{donation.message}"</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400 font-semibold text-lg">{formatCurrency(donation.amount)}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(donation.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "supporters" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Top Community Supporters
              </h2>
              <div className="space-y-4">
                {communityData.topSupporters.map((supporter, index) => (
                  <motion.div
                    key={supporter.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {supporter.avatar}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{supporter.name}</h3>
                      <p className="text-gray-400">
                        Supporting {supporter.artistsSupported} artists • Last active {supporter.lastActive}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400 font-semibold text-xl">{formatCurrency(supporter.totalDonations)}</p>
                      <p className="text-gray-400 text-sm">Total Support</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "trending" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Trending Artists This Week
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityData.trendingArtists.map((artist, index) => (
                  <motion.div
                    key={artist.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{artist.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">+{artist.newSupporters} new</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="text-green-400">{artist.growth}</span> this week
                      </div>
                      <p className="text-green-400 font-semibold">{formatCurrency(artist.totalDonations)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gray-800 border-t border-gray-700 px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Be part of the revolution in music support. Every donation makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Support an Artist
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Fairplay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
