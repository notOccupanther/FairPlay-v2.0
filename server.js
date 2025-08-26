const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/donate', async (req, res) => {
  const { amount, artistName } = req.body;
  if (!amount || !artistName) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10) * 100,
      currency: 'usd',
      metadata: { artist: artistName },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});