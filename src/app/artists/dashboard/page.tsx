"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Music2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Heart,
  MessageCircle,
  Settings,
  Download,
  Share2,
  Crown,
  Award,
  Activity
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ArtistDashboard {
  id: string;
  name: string;
  images: Array<{ url: string; width: number; height: number }>;
  totalDonations: number;
  totalSupporters: number;
  monthlyDonations: number;
  yearlyDonations: number;
  recentDonations: Array<{
    id: string;
    amount: number;
    supporterName: string;
    message?: string;
    timestamp: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    donations: number;
    supporters: number;
  }>;
  topSupporters: Array<{
    name: string;
    totalAmount: number;
    lastDonation: string;
  }>;
}

export default function ArtistDashboardPage() {
  const { data: session, status } = useSession();
  const [dashboard, setDashboard] = useState<ArtistDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "supporters" | "settings">("overview");

  useEffect(() => {
    if (session?.user) {
      fetchDashboard();
    }
  }, [session]);

  const fetchDashboard = async () => {
    try {
      // Mock dashboard data - will integrate with real API later
      const mockDashboard: ArtistDashboard = {
        id: "1",
        name: "Taylor Swift",
        images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0", width: 640, height: 640 }],
        totalDonations: 15420,
        totalSupporters: 89,
        monthlyDonations: 45600,
        yearlyDonations: 234000,
        recentDonations: [
          { id: "1", amount: 50, supporterName: "Sarah M.", message: "Love your music! 💕", timestamp: "2024-01-15T10:30:00Z" },
          { id: "2", amount: 25, supporterName: "Mike R.", message: "Keep making amazing songs!", timestamp: "2024-01-14T15:45:00Z" },
          { id: "3", amount: 100, supporterName: "Emma L.", message: "You're my favorite artist!", timestamp: "2024-01-13T09:20:00Z" },
          { id: "4", amount: 75, supporterName: "Alex K.", message: "Thanks for the inspiration", timestamp: "2024-01-12T14:15:00Z" },
          { id: "5", amount: 30, supporterName: "David P.", message: "Amazing concert last night!", timestamp: "2024-01-11T20:30:00Z" },
        ],
        monthlyTrend: [
          { month: "Jan", donations: 45600, supporters: 234 },
          { month: "Feb", donations: 38900, supporters: 189 },
          { month: "Mar", donations: 32400, supporters: 156 },
          { month: "Apr", donations: 28700, supporters: 134 },
          { month: "May", donations: 25600, supporters: 112 },
          { month: "Jun", donations: 19800, supporters: 89 },
        ],
        topSupporters: [
          { name: "Emma L.", totalAmount: 1200, lastDonation: "2024-01-13" },
          { name: "Sarah M.", totalAmount: 850, lastDonation: "2024-01-15" },
          { name: "Alex K.", totalAmount: 650, lastDonation: "2024-01-12" },
          { name: "Mike R.", totalAmount: 450, lastDonation: "2024-01-14" },
          { name: "David P.", totalAmount: 320, lastDonation: "2024-01-11" },
        ]
      };
      
      setDashboard(mockDashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Access Denied</p>
          <p className="text-gray-400 mb-6">You need to be logged in to access the artist dashboard.</p>
          <a href="/" className="text-green-400 hover:text-green-300">Return to home</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Dashboard not found</p>
          <p className="text-gray-400 mb-6">It looks like you haven't claimed an artist profile yet.</p>
          <a href="/" className="text-green-400 hover:text-green-300">Return to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={dashboard.images[0]?.url || "/placeholder-artist.jpg"}
                  alt={dashboard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{dashboard.name}</h1>
                <p className="text-gray-400">Artist Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
              <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "analytics", label: "Analytics", icon: TrendingUp },
              { key: "supporters", label: "Supporters", icon: Users },
              { key: "settings", label: "Settings", icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === key
                    ? "border-green-500 text-green-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-400">{formatCurrency(dashboard.totalDonations)}</p>
                <p className="text-gray-400">Total Donations</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-blue-400">{dashboard.totalSupporters}</p>
                <p className="text-gray-400">Total Supporters</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-purple-400">{formatCurrency(dashboard.monthlyDonations)}</p>
                <p className="text-gray-400">This Month</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-yellow-400">{formatCurrency(dashboard.yearlyDonations)}</p>
                <p className="text-gray-400">This Year</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Donations */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Recent Donations
                </h3>
                <div className="space-y-3">
                  {dashboard.recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{donation.supporterName}</p>
                        {donation.message && (
                          <p className="text-sm text-gray-400">{donation.message}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{formatCurrency(donation.amount)}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(donation.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Supporters */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Top Supporters
                </h3>
                <div className="space-y-3">
                  {dashboard.topSupporters.map((supporter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{supporter.name}</p>
                          <p className="text-xs text-gray-400">Last: {supporter.lastDonation}</p>
                        </div>
                      </div>
                      <p className="text-green-400 font-semibold">{formatCurrency(supporter.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Monthly Trend Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Monthly Donation Trends</h3>
              <div className="grid grid-cols-6 gap-4">
                {dashboard.monthlyTrend.map((month, index) => (
                  <div key={month.month} className="text-center">
                    <div className="bg-gray-700 rounded-lg p-4 mb-2">
                      <div 
                        className="bg-green-500 rounded-t-sm mx-auto"
                        style={{ 
                          height: `${(month.donations / Math.max(...dashboard.monthlyTrend.map(m => m.donations))) * 100}px`,
                          maxHeight: '120px'
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium">{month.month}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(month.donations)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Growth Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Monthly Growth</span>
                    <span className="text-green-400 font-semibold">+15.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">New Supporters</span>
                    <span className="text-blue-400 font-semibold">+23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Donation</span>
                    <span className="text-purple-400 font-semibold">$45.20</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Engagement</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Profile Views</span>
                    <span className="text-green-400 font-semibold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shares</span>
                    <span className="text-blue-400 font-semibold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Messages</span>
                    <span className="text-purple-400 font-semibold">12</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "supporters" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Supporters List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">All Supporters</h3>
              <div className="space-y-3">
                {dashboard.topSupporters.map((supporter, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {supporter.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{supporter.name}</p>
                        <p className="text-sm text-gray-400">Last donation: {supporter.lastDonation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{formatCurrency(supporter.totalAmount)}</p>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={dashboard.name}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell your story..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-green-500 focus:ring-green-500" defaultChecked />
                  <span>New donations</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-green-500 focus:ring-green-500" defaultChecked />
                  <span>New supporters</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-green-500 focus:ring-green-500" />
                  <span>Weekly reports</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-green-500 focus:ring-green-500" />
                  <span>Marketing updates</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
