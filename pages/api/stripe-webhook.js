// pages/api/stripe-webhook.js
import { stripe } from '../../lib/stripe';
import { prisma } from '../../lib/prisma';

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Stripe webhook event received:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order payment status
        await updateOrderPaymentStatus(paymentIntent.id, 'PAID');
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update order payment status
        await updateOrderPaymentStatus(failedPayment.id, 'FAILED');
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('Payment canceled:', canceledPayment.id);
        
        // Update order payment status
        await updateOrderPaymentStatus(canceledPayment.id, 'FAILED');
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function updateOrderPaymentStatus(paymentIntentId, status) {
  try {
    console.log(`Updating payment status for ${paymentIntentId} to ${status}`);
    
    // Find and update the order by payment intent ID
    const updatedOrder = await prisma.order.updateMany({
      where: {
        paymentIntentId: paymentIntentId
      },
      data: {
        paymentStatus: status,
        status: status === 'PAID' ? 'CONFIRMED' : 'PENDING',
        updatedAt: new Date()
      }
    });

    if (updatedOrder.count > 0) {
      console.log(`Successfully updated ${updatedOrder.count} order(s) for payment ${paymentIntentId}`);
    } else {
      console.log(`No orders found for payment intent ${paymentIntentId}`);
    }
    
  } catch (error) {
    console.error('Error updating order payment status:', error);
    throw error;
  }
}