# 🚀 Vercel Deployment Guide for Fairplay

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [x] All features implemented and working
- [x] CSRF/session loop issues resolved
- [x] Authentication working properly
- [x] All pages and API routes functional

### 🔧 Environment Variables Setup

**IMPORTANT**: You'll need to set these in Vercel's dashboard:

```bash
# Required for Production
SPOTIFY_CLIENT_ID=c0d3237d19474dc6a7595b379d30be91
SPOTIFY_CLIENT_SECRET=e421a0adec67416bbc775b7eadf8efb2
NEXTAUTH_SECRET=/y+y1RnIUK6u4oAJDah5Xk+WLky8zVN74F4GLCxDseM=

# Vercel will automatically set:
# NEXTAUTH_URL=https://your-domain.vercel.app

# Optional (for Stripe integration)
STRIPE_SECRET_KEY=your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_actual_stripe_publishable_key
```

## 🚀 Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
- Go to your project in Vercel dashboard
- Navigate to Settings → Environment Variables
- Add each variable from the list above

### 5. Update Spotify App Settings
- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Add your Vercel domain to Redirect URIs:
  - `https://your-domain.vercel.app/api/auth/callback/spotify`

## 🔍 Post-Deployment Verification

### ✅ Check These Features
- [ ] Landing page loads
- [ ] Spotify authentication works
- [ ] Artist data loads properly
- [ ] All navigation works (Charts, Community, Artists)
- [ ] No CSRF/session loops
- [ ] Mobile responsiveness

### 🐛 Common Issues & Solutions

**Issue**: Authentication redirects to localhost
**Solution**: Update Spotify app redirect URIs with your Vercel domain

**Issue**: Environment variables not working
**Solution**: Check Vercel dashboard → Settings → Environment Variables

**Issue**: Build fails
**Solution**: Check build logs for missing dependencies

## 📱 Production Features

Your deployed app will include:
- ✅ **Music Charts System** - Real-time artist rankings
- ✅ **Artist Onboarding** - Profile claiming and management
- ✅ **Community Features** - Live activity and supporter tracking
- ✅ **Spotify Integration** - Seamless authentication and data
- ✅ **Responsive Design** - Works on all devices
- ✅ **Performance Optimized** - Fast loading and smooth interactions

## 🌐 Custom Domain (Optional)

To use a custom domain:
1. Add domain in Vercel dashboard
2. Update DNS records
3. Update Spotify redirect URIs
4. Update NEXTAUTH_URL if needed

## 📊 Monitoring

Vercel provides:
- Real-time performance metrics
- Error tracking
- Analytics integration
- Automatic deployments from Git

---

**Ready to deploy?** Run `vercel --prod` and follow the prompts! 🎵✨
