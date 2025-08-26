import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ 
        error: "Not authenticated",
        message: "Please sign in with Spotify to view your top artists"
      }, { status: 401 });
    }

    const spotifyApi = new SpotifyWebApi({
      accessToken: session.accessToken as string,
    });

    // Get top artists for different time ranges
    const [shortTerm, mediumTerm, longTerm] = await Promise.all([
      spotifyApi.getMyTopArtists({ limit: 20, time_range: "short_term" }),
      spotifyApi.getMyTopArtists({ limit: 20, time_range: "medium_term" }),
      spotifyApi.getMyTopArtists({ limit: 20, time_range: "long_term" }),
    ]);

    const topArtists = {
      weekly: shortTerm.body.items,
      monthly: mediumTerm.body.items,
      yearly: longTerm.body.items,
    };

    return NextResponse.json(topArtists);
  } catch (error: any) {
    console.error("Error fetching top artists:", error);
    
    // Handle specific Spotify API errors
    if (error.statusCode === 401) {
      return NextResponse.json({
        error: "Token expired",
        message: "Your Spotify session has expired. Please sign in again.",
        code: "TOKEN_EXPIRED"
      }, { status: 401 });
    }
    
    if (error.statusCode === 403) {
      return NextResponse.json({
        error: "Insufficient permissions",
        message: "Spotify requires additional permissions to access your top artists.",
        code: "INSUFFICIENT_PERMISSIONS"
      }, { status: 403 });
    }
    
    if (error.statusCode === 429) {
      return NextResponse.json({
        error: "Rate limited",
        message: "Too many requests to Spotify. Please try again later.",
        code: "RATE_LIMITED"
      }, { status: 429 });
    }

    return NextResponse.json({
      error: "Failed to fetch top artists",
      message: "There was an error connecting to Spotify. Please try again.",
      code: "UNKNOWN_ERROR"
    }, { status: 500 });
  }
}
