# 🎵 Fairplay - Support Artists Fairly

Fairplay is a revolutionary platform that connects music lovers with the artists they love most on Spotify. By leveraging your listening habits, Fairplay enables direct financial support to artists, ensuring they receive fair compensation for their creative work.

## ✨ Features

- **🎧 Spotify Integration**: Connect your Spotify account to see your top artists
- **📊 Listening Analytics**: View your top artists weekly, monthly, and yearly
- **💝 Direct Donations**: Support artists directly through Stripe payments
- **🎨 Beautiful Interface**: Spotify-like design that's intuitive and empathetic
- **🔒 Secure Authentication**: NextAuth.js with Spotify OAuth
- **📱 Responsive Design**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Spotify Developer Account
- Stripe Account (for payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd fairplay
npm install
```

### 2. Environment Setup

Create a `.env.local` file with your credentials:

```bash
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 3. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs
4. Copy Client ID and Client Secret to your `.env.local`

### 4. Stripe Setup

1. Create a [Stripe Account](https://stripe.com)
2. Get your API keys from the dashboard
3. Add them to your `.env.local`

### 5. Run the Application

```bash
# Terminal 1: Next.js Frontend
npm run dev

# Terminal 2: Express Backend (for Stripe)
npm run server
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🏗️ Architecture

### Frontend (Next.js 14)
- **App Router**: Modern Next.js routing with server components
- **TypeScript**: Full type safety
- **TailwindCSS**: Beautiful, responsive styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icons

### Backend (Express.js)
- **Stripe Integration**: Secure payment processing
- **CORS Support**: Cross-origin resource sharing
- **Body Parser**: Request body parsing

### Authentication (NextAuth.js)
- **Spotify OAuth**: Secure authentication flow
- **Session Management**: Persistent user sessions
- **Token Handling**: Access token management for API calls

## 📱 User Experience

### For Music Lovers
1. **Connect Spotify**: One-click authentication with your Spotify account
2. **Discover Your Taste**: See your top artists organized by time period
3. **Support Artists**: Make direct donations to your favorite musicians
4. **Track Impact**: See how your support helps artists

### For Artists
1. **Direct Revenue**: Receive 100% of donations (minus Stripe fees)
2. **Fan Connection**: Build stronger relationships with your audience
3. **Fair Compensation**: Get paid what your music is worth
4. **Transparent Platform**: No hidden fees or complex contracts

## 🔧 Development

### Project Structure
```
fairplay/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # NextAuth endpoints
│   │   │   └── spotify/    # Spotify API integration
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/          # React components
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   ├── ArtistCard.tsx  # Artist display card
│   │   └── NextAuthProvider.tsx
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript declarations
├── server.js                # Express backend
├── next.config.js           # Next.js configuration
└── package.json
```

### Key Components

- **Sidebar**: Spotify-like navigation with user profile
- **ArtistCard**: Beautiful artist display with donation functionality
- **Top Artists**: Organized by weekly, monthly, and yearly listening
- **Player Bar**: Music player interface (ready for future Spotify integration)

## 🌟 Business Model

Fairplay operates on a **sustainable, ethical model**:

- **Free Platform**: No subscription fees or hidden costs
- **Direct Support**: 100% of donations go to artists
- **Revenue Streams**: 
  - Non-intrusive advertising
  - Optional NFT drops
  - Partnered content streams
- **Artist Empowerment**: Transparent, fair compensation

## 🚀 Future Roadmap

- **Spotify Playback**: Direct music playback integration
- **Artist Profiles**: Detailed artist pages and stories
- **Community Features**: Fan communities and discussions
- **Analytics Dashboard**: Detailed listening insights
- **Mobile App**: Native iOS and Android applications
- **International Expansion**: Support for global markets

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code standards
- Pull request process
- Development setup
- Testing procedures

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Spotify**: For their excellent API and platform
- **Stripe**: For secure payment processing
- **Next.js Team**: For the amazing framework
- **Music Artists**: For inspiring this platform

---

**Fairplay** - Because every artist deserves fair compensation for their art. 🎵✨
