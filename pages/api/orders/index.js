// pages/api/orders/index.js
import { prisma } from '../../../lib/prisma';

function generateOrderNumber() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export default async function handler(req, res) {
  console.log('API Route called:', req.method);
  
  if (req.method === 'POST') {
    try {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const {
        items,
        customerInfo,
        totals,
        paymentIntentId
      } = req.body;

      // Validate required fields
      if (!items || !customerInfo || !totals) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      console.log('Validation passed, checking products...');

      // Check product availability
      for (const item of items) {
        console.log(`Checking product: ${item.id}`);
        
        const product = await prisma.product.findUnique({
          where: { id: item.id }
        });
        
        if (!product) {
          console.log(`Product not found: ${item.id}`);
          return res.status(400).json({ error: `Product ${item.name} not found` });
        }
        
        if (product.stock < item.quantity) {
          console.log(`Insufficient stock for ${product.name}`);
          return res.status(400).json({ 
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          });
        }
      }

      console.log('Products validated, creating order...');

      // Create order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          subtotal: totals.subtotal,
          shippingCost: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country || 'US',
          paymentMethod: 'stripe',
          paymentStatus: 'PAID', // Payment is confirmed by Stripe before reaching this point
          paymentIntentId: paymentIntentId // Store Stripe Payment Intent ID
        }
      });

      console.log('Order created:', newOrder.id);

      // Create order items
      for (const item of items) {
        console.log(`Creating order item for: ${item.name}`);
        
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }
        });

        // Update product stock
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      console.log('Order completed successfully:', newOrder.orderNumber);
      
      res.status(201).json({ 
        success: true, 
        order: newOrder,
        orderNumber: newOrder.orderNumber 
      });

    } catch (error) {
      console.error('Detailed error creating order:', error);
      res.status(500).json({ 
        error: 'Failed to create order', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}