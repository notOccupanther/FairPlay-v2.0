import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock data for now - will be replaced with real database queries
const mockChartData = {
  topDonated: {
    weekly: [
      { id: "1", name: "Taylor Swift", totalDonations: 15420, donations: 89, image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0" },
      { id: "2", name: "Drake", totalDonations: 12850, donations: 67, image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9f" },
      { id: "3", name: "The Weeknd", totalDonations: 11200, donations: 54, image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c4e504b4bb" },
      { id: "4", name: "Post Malone", totalDonations: 9870, donations: 43, image: "https://i.scdn.co/image/ab6761610000e5eb6be070445e02f8dbf9c466a88" },
      { id: "5", name: "Ed Sheeran", totalDonations: 8760, donations: 38, image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f380d4fd8b7c9" },
    ],
    monthly: [
      { id: "1", name: "Taylor Swift", totalDonations: 45600, donations: 234, image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0" },
      { id: "2", name: "Drake", totalDonations: 38900, donations: 189, image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9f" },
      { id: "3", name: "The Weeknd", totalDonations: 32400, donations: 156, image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c4e504b4bb" },
      { id: "4", name: "Post Malone", totalDonations: 28700, donations: 134, image: "https://i.scdn.co/image/ab6761610000e5eb6be070445e02f8dbf9c466a88" },
      { id: "5", name: "Ed Sheeran", totalDonations: 25600, donations: 112, image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f380d4fd8b7c9" },
    ],
    yearly: [
      { id: "1", name: "Taylor Swift", totalDonations: 234000, donations: 1234, image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3133a15fbb0" },
      { id: "2", name: "Drake", totalDonations: 198000, donations: 987, image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9f" },
      { id: "3", name: "The Weeknd", totalDonations: 167000, donations: 756, image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c4e504b4bb" },
      { id: "4", name: "Post Malone", totalDonations: 145000, donations: 634, image: "https://i.scdn.co/image/ab6761610000e5eb6be070445e02f8dbf9c466a88" },
      { id: "5", name: "Ed Sheeran", totalDonations: 128000, donations: 567, image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f380d4fd8b7c9" },
    ]
  },
  trending: [
    { id: "6", name: "Olivia Rodrigo", velocity: 45, change: "+12", image: "https://i.scdn.co/image/ab6761610000e5eb7a6f6c86738266f3e50c41f8" },
    { id: "7", name: "Doja Cat", velocity: 38, change: "+8", image: "https://i.scdn.co/image/ab6761610000e5ebc63aded6f3b28c9cbc7a3b3b" },
    { id: "8", name: "Lil Nas X", velocity: 32, change: "+15", image: "https://i.scdn.co/image/ab6761610000e5ebc8a11e48c91d3f048c1a0c8b" },
    { id: "9", name: "Billie Eilish", velocity: 29, change: "+5", image: "https://i.scdn.co/image/ab6761610000e5eb7a6f6c86738266f3e50c41f8" },
    { id: "10", name: "Dua Lipa", velocity: 26, change: "+9", image: "https://i.scdn.co/image/ab6761610000e5ebc8a11e48c91d3f048c1a0c8b" },
  ],
  genres: [
    { name: "Pop", totalDonations: 456000, artists: 89, change: "+15%" },
    { name: "Hip-Hop", totalDonations: 389000, artists: 67, change: "+8%" },
    { name: "R&B", totalDonations: 234000, artists: 45, change: "+12%" },
    { name: "Rock", totalDonations: 198000, artists: 56, change: "+3%" },
    { name: "Electronic", totalDonations: 145000, artists: 34, change: "+18%" },
  ],
  independent: [
    { id: "11", name: "Clairo", totalDonations: 8900, donations: 23, image: "https://i.scdn.co/image/ab6761610000e5eb7a6f6c86738266f3e50c41f8" },
    { id: "12", name: "Phoebe Bridgers", totalDonations: 7600, donations: 19, image: "https://i.scdn.co/image/ab6761610000e5ebc8a11e48c91d3f048c1a0c8b" },
    { id: "13", name: "Mac DeMarco", totalDonations: 6500, donations: 16, image: "https://i.scdn.co/image/ab6761610000e5eb7a6f6c86738266f3e50c41f8" },
    { id: "14", name: "Tame Impala", totalDonations: 5400, donations: 14, image: "https://i.scdn.co/image/ab6761610000e5ebc8a11e48c91d3f048c1a0c8b" },
    { id: "15", name: "King Gizzard", totalDonations: 4800, donations: 12, image: "https://i.scdn.co/image/ab6761610000e5eb7a6f6c86738266f3e50c41f8" },
  ]
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Charts are public - no authentication required
    const { searchParams } = new URL(request.url);
    const chartType = searchParams.get('type') || 'all';
    const timeRange = searchParams.get('range') || 'weekly';
    
    let responseData: any = {};
    
    switch (chartType) {
      case 'topDonated':
        responseData = {
          type: 'topDonated',
          timeRange,
          data: mockChartData.topDonated[timeRange as keyof typeof mockChartData.topDonated] || mockChartData.topDonated.weekly,
          metadata: {
            totalArtists: mockChartData.topDonated[timeRange as keyof typeof mockChartData.topDonated]?.length || 0,
            totalDonations: mockChartData.topDonated[timeRange as keyof typeof mockChartData.topDonated]?.reduce((sum, artist) => sum + artist.totalDonations, 0) || 0,
            lastUpdated: new Date().toISOString()
          }
        };
        break;
        
      case 'trending':
        responseData = {
          type: 'trending',
          data: mockChartData.trending,
          metadata: {
            totalArtists: mockChartData.trending.length,
            lastUpdated: new Date().toISOString()
          }
        };
        break;
        
      case 'genres':
        responseData = {
          type: 'genres',
          data: mockChartData.genres,
          metadata: {
            totalGenres: mockChartData.genres.length,
            lastUpdated: new Date().toISOString()
          }
        };
        break;
        
      case 'independent':
        responseData = {
          type: 'independent',
          data: mockChartData.independent,
          metadata: {
            totalArtists: mockChartData.independent.length,
            totalDonations: mockChartData.independent.reduce((sum, artist) => sum + artist.totalDonations, 0),
            lastUpdated: new Date().toISOString()
          }
        };
        break;
        
      default:
        // Return all charts
        responseData = {
          type: 'all',
          charts: {
            topDonated: mockChartData.topDonated,
            trending: mockChartData.trending,
            genres: mockChartData.genres,
            independent: mockChartData.independent
          },
          metadata: {
            lastUpdated: new Date().toISOString()
          }
        };
    }
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Error fetching charts:", error);
    return NextResponse.json(
      { error: "Failed to fetch charts" },
      { status: 500 }
    );
  }
}
