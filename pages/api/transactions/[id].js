// pages/api/transactions/[id].js
import { prisma } from '../../../lib/prisma';
import { stripe } from '../../../lib/stripe';

export default async function handler(req, res) {
  const { id } = req.query; // Payment Intent ID

  if (req.method === 'GET') {
    try {
      // Get transaction details from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(id);
      
      // Get corresponding order from database
      const order = await prisma.order.findFirst({
        where: {
          paymentIntentId: id
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      res.status(200).json({
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: new Date(paymentIntent.created * 1000),
          payment_method: paymentIntent.payment_method,
        },
        order: order
      });

    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ 
        error: 'Failed to fetch transaction details',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

  } else if (req.method === 'POST') {
    // Refresh payment status from Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(id);
      
      // Update order status based on current Stripe status
      let paymentStatus = 'PENDING';
      let orderStatus = 'PENDING';

      switch (paymentIntent.status) {
        case 'succeeded':
          paymentStatus = 'PAID';
          orderStatus = 'CONFIRMED';
          break;
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_action':
        case 'processing':
          paymentStatus = 'PENDING';
          orderStatus = 'PENDING';
          break;
        case 'canceled':
          paymentStatus = 'FAILED';
          orderStatus = 'CANCELLED';
          break;
        default:
          paymentStatus = 'FAILED';
          orderStatus = 'PENDING';
      }

      const updatedOrder = await prisma.order.updateMany({
        where: {
          paymentIntentId: id
        },
        data: {
          paymentStatus: paymentStatus,
          status: orderStatus,
          updatedAt: new Date()
        }
      });

      res.status(200).json({
        success: true,
        paymentStatus: paymentIntent.status,
        ordersUpdated: updatedOrder.count
      });

    } catch (error) {
      console.error('Error refreshing transaction status:', error);
      res.status(500).json({ 
        error: 'Failed to refresh transaction status',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}