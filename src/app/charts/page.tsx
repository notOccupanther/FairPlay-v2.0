"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  TrendingUp, 
  Music2, 
  Trophy, 
  Users, 
  Heart, 
  Zap,
  Calendar,
  BarChart3,
  Share2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChartArtist {
  id: string;
  name: string;
  totalDonations: number;
  donations: number;
  image: string;
  velocity?: number;
  change?: string;
}

interface ChartGenre {
  name: string;
  totalDonations: number;
  artists: number;
  change: string;
}

export default function ChartsPage() {
  const { data: session, status } = useSession();
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [activeChart, setActiveChart] = useState<"topDonated" | "trending" | "genres" | "independent">("topDonated");

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/charts');
      if (response.ok) {
        const data = await response.json();
        setCharts(data);
      }
    } catch (error) {
      console.error('Error fetching charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case 'topDonated': return <Trophy className="w-6 h-6" />;
      case 'trending': return <Zap className="w-6 h-6" />;
      case 'genres': return <BarChart3 className="w-6 h-6" />;
      case 'independent': return <Heart className="w-6 h-6" />;
      default: return <Music2 className="w-6 h-6" />;
    }
  };

  const getChartTitle = (chartType: string) => {
    switch (chartType) {
      case 'topDonated': return 'Top Donated Artists';
      case 'trending': return 'Trending Artists';
      case 'genres': return 'Most Supported Genres';
      case 'independent': return 'Independent Artists';
      default: return 'Charts';
    }
  };

  const getChartDescription = (chartType: string) => {
    switch (chartType) {
      case 'topDonated': return 'Artists with the highest total donations';
      case 'trending': return 'Artists gaining momentum in donations';
      case 'genres': return 'Most financially supported music genres';
      case 'independent': return 'Independent artists building sustainable careers';
      default: return 'Music charts by the people, for the people';
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading Charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Music Charts
          </h1>
          <p className="text-xl text-gray-400">
            Music charts by the people, for the people. No corporate influence, just pure fan support.
          </p>
        </motion.div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: "topDonated", label: "Top Donated", icon: Trophy },
            { key: "trending", label: "Trending", icon: Zap },
            { key: "genres", label: "Genres", icon: BarChart3 },
            { key: "independent", label: "Independent", icon: Heart },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeChart === key
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Time Range Selector (for Top Donated) */}
        {activeChart === "topDonated" && (
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
                  {range === "weekly" && "This Week"}
                  {range === "monthly" && "This Month"}
                  {range === "yearly" && "This Year"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading charts...</p>
          </div>
        ) : charts ? (
          <div className="space-y-8">
            {/* Chart Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                {getChartIcon(activeChart)}
                <h2 className="text-3xl font-bold">{getChartTitle(activeChart)}</h2>
              </div>
              <p className="text-gray-400 text-lg">{getChartDescription(activeChart)}</p>
              
              {/* Chart Actions */}
              <div className="flex justify-center gap-4 mt-6">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Chart
                </button>
                <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>

            {/* Chart Data */}
            <div className="bg-gray-800 rounded-lg p-6">
              {activeChart === "topDonated" && charts.charts?.topDonated && (
                <div className="space-y-4">
                  {charts.charts.topDonated[activeTimeRange]?.map((artist: ChartArtist, index: number) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                        {index + 1}
                      </div>
                      
                      {/* Artist Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Artist Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{artist.name}</h3>
                        <p className="text-gray-400">
                          {artist.donations} donations • {formatCurrency(artist.totalDonations)}
                        </p>
                      </div>
                      
                      {/* Support Button */}
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Support
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeChart === "trending" && charts.charts?.trending && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.charts.trending.map((artist: ChartArtist, index: number) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{artist.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-green-400 font-medium">{artist.velocity}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="text-green-400">{artist.change}</span> this week
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeChart === "genres" && charts.charts?.genres && (
                <div className="space-y-4">
                  {charts.charts.genres.map((genre: ChartGenre, index: number) => (
                    <motion.div
                      key={genre.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{genre.name}</h3>
                          <p className="text-gray-400">{genre.artists} artists</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(genre.totalDonations)}</p>
                        <p className="text-green-400 text-sm">{genre.change}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeChart === "independent" && charts.charts?.independent && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.charts.independent.map((artist: ChartArtist, index: number) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{artist.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-gray-400">{artist.donations} donations</span>
                      </div>
                      <p className="text-green-400 font-medium">{formatCurrency(artist.totalDonations)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Chart Footer */}
            <div className="text-center text-gray-400 text-sm">
              <p>Last updated: {new Date().toLocaleString()}</p>
              <p className="mt-2">
                These charts represent real financial support from music fans worldwide. 
                No corporate influence, no payola, just pure fan love. 💚
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No chart data available</p>
            <button
              onClick={fetchCharts}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Load Charts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
