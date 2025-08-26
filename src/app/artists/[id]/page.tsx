"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Music2, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Share2,
  Crown,
  Verified,
  Edit,
  Award,
  BarChart3
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface ArtistProfile {
  id: string;
  name: string;
  images: Array<{ url: string; width: number; height: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
  totalDonations: number;
  totalSupporters: number;
  monthlyDonations: number;
  yearlyDonations: number;
  isVerified: boolean;
  isClaimed: boolean;
  claimedBy?: string;
  bio?: string;
  location?: string;
  followers?: number;
}

interface Donation {
  id: string;
  amount: number;
  supporterName: string;
  message?: string;
  timestamp: string;
}

export default function ArtistProfilePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const artistId = params.id as string;
  
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimReason, setClaimReason] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (artistId) {
      fetchArtistProfile();
      fetchArtistDonations();
    }
  }, [artistId]);

  const fetchArtistProfile = async () => {
    try {
      // For now, using mock data - will integrate with real API later
      const mockArtist: ArtistProfile = {
        id: artistId,
        name: "Taylor Swift",
        images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0", width: 640, height: 640 }],
        genres: ["Pop", "Country", "Folk"],
        popularity: 95,
        external_urls: { spotify: "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" },
        totalDonations: 15420,
        totalSupporters: 89,
        monthlyDonations: 45600,
        yearlyDonations: 234000,
        isVerified: false,
        isClaimed: false,
        bio: "Taylor Swift is an American singer-songwriter whose narrative songwriting has received critical praise and widespread media coverage.",
        location: "Nashville, TN",
        followers: 85000000
      };
      
      setArtist(mockArtist);
    } catch (error) {
      console.error('Error fetching artist profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistDonations = async () => {
    try {
      // Mock donations data
      const mockDonations: Donation[] = [
        { id: "1", amount: 50, supporterName: "Sarah M.", message: "Love your music! 💕", timestamp: "2024-01-15T10:30:00Z" },
        { id: "2", amount: 25, supporterName: "Mike R.", message: "Keep making amazing songs!", timestamp: "2024-01-14T15:45:00Z" },
        { id: "3", amount: 100, supporterName: "Emma L.", message: "You're my favorite artist!", timestamp: "2024-01-13T09:20:00Z" },
        { id: "4", amount: 75, supporterName: "Alex K.", message: "Thanks for the inspiration", timestamp: "2024-01-12T14:15:00Z" },
        { id: "5", amount: 30, supporterName: "David P.", message: "Amazing concert last night!", timestamp: "2024-01-11T20:30:00Z" },
      ];
      
      setDonations(mockDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleClaimProfile = async () => {
    if (!artist) return; // Early return if artist is null
    
    setIsClaiming(true);
    try {
      const response = await fetch('/api/artists/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistId: artist.id,
          artistName: artist.name,
          reason: claimReason,
          email: session?.user?.email || ""
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (artist) {
          setArtist({
            ...artist,
            isClaimed: true,
            claimedBy: session?.user?.email || "Unknown"
          });
        }
        
        setShowClaimModal(false);
        setClaimReason("");
        
        // Show detailed success message
        const successMessage = `🎉 Profile claim submitted successfully!\n\nClaim ID: ${result.claimId}\nStatus: ${result.status}\nEstimated Review Time: ${result.estimatedReviewTime}\n\nNext Steps:\n${result.nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}`;
        alert(successMessage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Claim submission failed');
      }
    } catch (error) {
      alert(`Error submitting claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDonate = () => {
    // This will open the donation modal from the main page
    // For now, redirect to home page
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Artist not found</p>
          <a href="/" className="text-green-400 hover:text-green-300">Return to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white">
                <Image
                  src={artist.images[0]?.url || "/placeholder-artist.jpg"}
                  alt={artist.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-5xl font-bold mb-2">{artist.name}</h1>
              <div className="flex items-center justify-center gap-4 text-lg">
                {artist.isVerified && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Verified className="w-5 h-5" />
                    Verified Artist
                  </div>
                )}
                {artist.isClaimed && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Crown className="w-5 h-5" />
                    Profile Claimed
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Artist Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-400">{formatCurrency(artist.totalDonations)}</p>
                <p className="text-gray-400">Total Donations</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-blue-400">{artist.totalSupporters}</p>
                <p className="text-gray-400">Supporters</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-purple-400">{artist.popularity}%</p>
                <p className="text-gray-400">Popularity</p>
              </motion.div>
            </div>

            {/* Bio & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">About {artist.name}</h3>
              <p className="text-gray-300 mb-4">{artist.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Location: {artist.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Spotify Followers: {artist.followers?.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Genres */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Recent Support</h3>
              <div className="space-y-3">
                {donations.slice(0, 5).map((donation) => (
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
            </motion.div>
          </div>

          {/* Right Column - Actions & Charts */}
          <div className="space-y-6">
            {/* Support Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-800 rounded-lg p-6 text-center"
            >
              <h3 className="text-lg font-semibold mb-4">Support {artist.name}</h3>
              <p className="text-gray-400 mb-6">
                Show your love and support for this amazing artist
              </p>
              <button
                onClick={handleDonate}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Support Artist
              </button>
            </motion.div>

            {/* Claim Profile */}
            {!artist.isClaimed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Claim This Profile
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Are you {artist.name}? Claim your profile to access analytics, respond to supporters, and manage your presence on Fairplay.
                </p>
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Claim Profile
                </button>
              </motion.div>
            )}

            {/* Monthly Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Monthly Support
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(artist.monthlyDonations)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">This Year</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(artist.yearlyDonations)}</span>
                </div>
              </div>
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Share</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Claim Profile Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Claim Profile: {artist.name}
            </h3>
            
            <p className="text-sm text-gray-400 mb-4">
              To claim this profile, please provide a reason and we'll review your request. 
              You may need to provide proof of identity.
            </p>
            
            <form onSubmit={handleClaimProfile} className="space-y-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                  Why are you claiming this profile?
                </label>
                <textarea
                  id="reason"
                  value={claimReason}
                  onChange={(e) => setClaimReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Explain why you're claiming this profile..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isClaiming}
                  className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md transition-colors disabled:opacity-50"
                >
                  {isClaiming ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
