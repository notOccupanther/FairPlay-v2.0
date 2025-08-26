import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch top artists" },
      { status: 500 }
    );
  }
}
