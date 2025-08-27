"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Play, 
  DollarSign, 
  TrendingUp, 
  ExternalLink, 
  Zap, 
  CreditCard, 
  Wallet, 
  Shield, 
  X,
  Smartphone,
  Monitor
} from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<'lightning' | 'traditional'>('lightning');
  const [lightningWallet, setLightningWallet] = useState<string | null>(null);
  const [escrowStatus, setEscrowStatus] = useState<'pending' | 'creating' | 'created'>('pending');

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount) return;

    if (paymentMethod === 'lightning') {
      // Lightning Network donation flow
      await handleLightningDonation();
    } else {
      // Traditional credit card donation flow
      await handleTraditionalDonation();
    }
  };

  const handleLightningDonation = async () => {
    try {
      setEscrowStatus('creating');
      
      // Simulate Lightning Network donation with HTLC escrow
      const response = await fetch('/api/donate-lightning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          artistName: artist.name,
          artistId: artist.id,
          amount: parseFloat(donationAmount),
          walletAddress: lightningWallet
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEscrowStatus('created');
        
        // Show success message with escrow details
        alert(`⚡ Lightning Donation Successful!\n\nAmount: ₿${donationAmount}\nEscrow ID: ${result.escrowId}\nStatus: Funds held securely until artist verification\n\nYour donation is now in escrow and will be released to ${artist.name} once they verify their profile.`);
        
        setShowDonationModal(false);
        setDonationAmount("");
        setEscrowStatus('pending');
      } else {
        throw new Error('Lightning donation failed');
      }
    } catch (error) {
      alert('Error processing Lightning donation. Please try again.');
      setEscrowStatus('pending');
    }
  };

  const handleTraditionalDonation = async () => {
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
        alert(`💳 ${result.message}\n\nThis is a mock donation for testing. In production, this would process a real payment through Stripe.`);
        setShowDonationModal(false);
        setDonationAmount("");
      } else {
        throw new Error('Donation failed');
      }
    } catch (error) {
      alert('Error processing donation. Please try again.');
    }
  };

  const connectLightningWallet = (walletType: 'phoenix' | 'breez') => {
    // Simulate wallet connection
    const mockWalletAddress = `${walletType}_${Math.random().toString(36).substr(2, 9)}`;
    setLightningWallet(mockWalletAddress);
    
    // Show connection success
    alert(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet connected successfully!\n\nWallet: ${mockWalletAddress}\n\nYou can now make Lightning Network donations with near-zero fees!`);
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

      {/* Enhanced Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Support {artist.name}
              </h3>
              <button 
                onClick={() => {
                  setShowDonationModal(false);
                  setDonationAmount("");
                  setPaymentMethod('lightning');
                  setLightningWallet(null);
                  setEscrowStatus('pending');
                }} 
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('lightning')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    paymentMethod === 'lightning'
                      ? "border-green-500 bg-green-500 bg-opacity-10 text-green-400"
                      : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                  )}
                >
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Lightning Network</div>
                    <div className="text-xs opacity-75">Instant & Low Fees</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('traditional')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    paymentMethod === 'traditional'
                      ? "border-blue-500 bg-blue-500 bg-opacity-10 text-blue-400"
                      : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                  )}
                >
                  <div className="text-center">
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Credit Card</div>
                    <div className="text-xs opacity-75">Familiar & Secure</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Lightning Network Benefits */}
            {paymentMethod === 'lightning' && (
              <div className="mb-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Lightning Network Benefits</span>
                </div>
                <ul className="text-sm text-green-300 space-y-1">
                  <li>• Near-zero fees (99.9%+ goes to artist)</li>
                  <li>• Instant global transactions</li>
                  <li>• Secure escrow until verification</li>
                  <li>• Transparent blockchain ledger</li>
                </ul>
              </div>
            )}

            {/* Donation Amount */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Donation Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {paymentMethod === 'lightning' ? '₿' : '$'}
                </span>
                <input
                  type="number"
                  id="amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={paymentMethod === 'lightning' ? "0.001" : "10"}
                  min={paymentMethod === 'lightning' ? "0.001" : "1"}
                  step={paymentMethod === 'lightning' ? "0.001" : "1"}
                  required
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                {paymentMethod === 'lightning' ? (
                  // Bitcoin amounts
                  ['0.001', '0.01', '0.1', '0.5'].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm transition-colors"
                    >
                      ₿{amount}
                    </button>
                  ))
                ) : (
                  // Dollar amounts
                  ['5', '10', '25', '50'].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm transition-colors"
                    >
                      ${amount}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Lightning Wallet Connection */}
            {paymentMethod === 'lightning' && !lightningWallet && (
              <div className="mb-6 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Connect Lightning Wallet</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => connectLightningWallet('phoenix')}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Smartphone className="w-4 h-4 inline mr-2" />
                    Phoenix
                  </button>
                  <button 
                    onClick={() => connectLightningWallet('breez')}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Monitor className="w-4 h-4 inline mr-2" />
                    Breez
                  </button>
                </div>
                <p className="text-xs text-blue-300 mt-2">
                  Don't have a Lightning wallet? We'll help you set one up!
                </p>
              </div>
            )}

            {/* Connected Wallet Display */}
            {paymentMethod === 'lightning' && lightningWallet && (
              <div className="mb-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Wallet Connected</span>
                </div>
                <p className="text-sm text-green-300">
                  {lightningWallet} - Ready for Lightning donations!
                </p>
              </div>
            )}

            {/* Escrow Information */}
            {paymentMethod === 'lightning' && (
              <div className="mb-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Secure Escrow Process</span>
                </div>
                <div className="text-sm text-yellow-300 space-y-1">
                  <p>Your donation will be held securely until {artist.name} verifies their profile.</p>
                  <p>• Funds held in Lightning Network escrow</p>
                  <p>• Automatic release after verification</p>
                  <p>• Full refund if verification fails</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDonationModal(false);
                  setDonationAmount("");
                  setPaymentMethod('lightning');
                  setLightningWallet(null);
                  setEscrowStatus('pending');
                }}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDonation}
                disabled={!donationAmount || (paymentMethod === 'lightning' && !lightningWallet)}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-medium transition-colors",
                  paymentMethod === 'lightning'
                    ? "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
                )}
              >
                {escrowStatus === 'creating' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    Creating Escrow...
                  </>
                ) : paymentMethod === 'lightning' ? (
                  <>
                    <Zap className="w-4 h-4 inline mr-2" />
                    Donate with Lightning
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Donate with Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
