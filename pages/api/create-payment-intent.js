// pages/api/create-payment-intent.js
import { stripe } from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'usd', customerInfo, items } = req.body;

      // Validate amount
      if (!amount || amount < 0.50) { // Minimum 50 cents
        return res.status(400).json({ error: 'Invalid amount - minimum $0.50 required' });
      }

      // Validate customer info
      if (!customerInfo || !customerInfo.email) {
        return res.status(400).json({ error: 'Customer email is required' });
      }

      console.log('Creating payment intent for:', {
        amount: amount,
        customer: customerInfo.email,
        items: items?.length || 0
      });

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          customerEmail: customerInfo.email,
          customerName: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
          customerPhone: customerInfo.phone || '',
          itemCount: items?.length?.toString() || '0',
          orderItems: JSON.stringify(items?.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })) || [])
        },
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: customerInfo.email,
      });

      console.log('Payment intent created:', paymentIntent.id);

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ 
        error: 'Failed to create payment intent',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}