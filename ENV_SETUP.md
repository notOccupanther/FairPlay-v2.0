# 🔑 Environment Variables Setup

## Required Environment Variables

To run Fairplay, you need to set up the following environment variables in a `.env.local` file:

### Spotify API Credentials
```bash
# Get these from https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### NextAuth Configuration
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Setup Instructions

1. **Create Spotify App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create App"
   - Fill in app details
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`

2. **Create Environment File**:
   ```bash
   # In your fairplay directory
   touch .env.local
   ```

3. **Add Variables**:
   ```bash
   # Copy the variables above into .env.local
   # Replace the placeholder values with your actual credentials
   ```

4. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

- **"Loading Fairplay..." stuck**: Usually means missing Spotify credentials
- **Authentication errors**: Check that redirect URI matches exactly
- **CORS issues**: Ensure NEXTAUTH_URL is correct

## Security Notes

- Never commit `.env.local` to version control
- Keep your Spotify credentials secure
- Use different credentials for development/production
