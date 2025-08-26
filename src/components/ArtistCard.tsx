"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Play, DollarSign, TrendingUp, ExternalLink } from "lucide-react";
import { cn, formatCurrency, truncateText } from "@/lib/utils";

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; width: number; height: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

interface ArtistCardProps {
  artist: Artist;
  timeRange?: "weekly" | "monthly" | "yearly";
  className?: string;
}

export default function ArtistCard({ artist, timeRange, className }: ArtistCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount) return;

    try {
      const response = await fetch('/api/donate-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          artistName: artist.name, 
          amount: parseInt(donationAmount) 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`🎉 ${result.message}\n\nThis is a mock donation for testing. In production, this would process a real payment through Stripe.`);
        setShowDonationModal(false);
        setDonationAmount("");
      } else {
        throw new Error('Donation failed');
      }
    } catch (error) {
      alert('Error processing donation. Please try again.');
    }
  };

  const getTimeRangeColor = () => {
    switch (timeRange) {
      case "weekly": return "bg-blue-500";
      case "monthly": return "bg-purple-500";
      case "yearly": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "weekly": return "This Week";
      case "monthly": return "This Month";
      case "yearly": return "This Year";
      default: return "";
    }
  };

  return (
    <>
      <div className={cn(
        "bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group cursor-pointer",
        className
      )}>
        {/* Artist Image and Popularity */}
        <div className="relative mb-4">
          <div className="relative w-full aspect-square rounded-md overflow-hidden">
            <Image
              src={artist.images[0]?.url || "/placeholder-artist.jpg"}
              alt={artist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-200" />
          </div>
          
          {/* Time Range Badge */}
          {timeRange && (
            <div className={cn(
              "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white",
              getTimeRangeColor()
            )}>
              {getTimeRangeLabel()}
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg">
              <Play className="w-6 h-6 ml-1" />
            </button>
          </div>
        </div>

        {/* Artist Info */}
        <div className="space-y-2">
          <Link href={`/artists/${artist.id}`} className="block group">
            <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
              {truncateText(artist.name, 20)}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Popularity: {artist.popularity}%</span>
          </div>

          {/* Genres */}
          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artist.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isLiked 
                  ? "text-red-500 hover:text-red-400" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </button>

            <div className="flex gap-2">
              <Link
                href={`/artists/${artist.id}`}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="View Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => setShowDonationModal(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Support {artist.name}
            </h3>
            
            <p className="text-sm text-gray-400 mb-4">
              💡 This is a demo - donations are simulated for testing purposes
            </p>
            
            <form onSubmit={handleDonation} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  Donate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
