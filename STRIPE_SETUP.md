# 🚀 Setting Up Real Stripe Payments

## Current Status: Demo Mode ✅
- **Donations are currently simulated** for testing purposes
- **No real payments** are processed
- **Perfect for development and testing**

## 🔑 To Enable Real Payments:

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Get your **API keys** from the dashboard

### 2. Update Environment Variables
Replace these in `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key_here
```

### 3. Switch Back to Real Endpoint
In `src/components/ArtistCard.tsx`, change:
```typescript
// From mock endpoint
const response = await fetch('/api/donate-mock', {

// To real endpoint  
const response = await fetch('/api/donate', {
```

### 4. Start Express Server
Make sure the Express server is running:
```bash
npm run server
```

## 🧪 Testing with Stripe
- Use **test mode** during development
- Test cards: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## 💡 Benefits of Demo Mode
- **No Stripe account required** for development
- **Instant testing** of donation flow
- **Safe development** without real money
- **Easy to switch** to production when ready

## 🎯 Next Steps
1. **Test the current demo** - everything should work perfectly
2. **Set up Stripe account** when ready for production
3. **Update environment variables** with real keys
4. **Switch to real endpoint** in ArtistCard component
5. **Test with Stripe test cards**
6. **Go live!** 🎵✨
