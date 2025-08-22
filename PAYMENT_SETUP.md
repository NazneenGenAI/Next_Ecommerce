# Payment System Setup Guide

This Next.js e-commerce application now includes a complete Stripe payment integration with real transaction processing.

## 🚀 Quick Setup

### 1. Stripe Account Setup
1. Create a free Stripe account at https://stripe.com
2. Go to your Dashboard → Developers → API keys
3. Copy your test keys to `.env.local`:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 2. Database Migration
Run the database migration to add the new payment fields:
```bash
npx prisma db push
```

### 3. Webhook Setup (Optional but Recommended)
1. Go to Dashboard → Developers → Webhooks
2. Add endpoint: `YOUR_DOMAIN/api/stripe-webhook`
3. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 4. Start the Application
```bash
npm run dev
```

## 🧪 Testing

### Test Cards
Use these test card numbers in development:

| Purpose | Card Number | Result |
|---------|-------------|--------|
| Success | `4242 4242 4242 4242` | Payment succeeds |
| Decline | `4000 0000 0000 0002` | Payment declined |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |

- Use any CVC (e.g., 123)
- Use any future expiration date
- Use any ZIP code

### Testing Flow
1. Add items to cart
2. Go to checkout
3. Fill in customer information
4. Use a test card number
5. Complete payment
6. Verify order in database

## 🔧 Features Implemented

### ✅ Complete Payment Processing
- Real Stripe payment intents
- Secure card processing
- 3D Secure authentication support
- Automatic payment retries

### ✅ Order Management
- Payment intent tracking
- Order status updates
- Transaction logging
- Webhook handling

### ✅ Error Handling
- Card decline handling
- Payment failure pages
- Detailed error messages
- Retry mechanisms

### ✅ Security
- Webhook signature verification
- Secure API endpoints
- Payment data encryption
- PCI compliance via Stripe

## 📁 New Files Added

```
pages/api/
├── create-payment-intent.js  # Creates Stripe payment intents
├── stripe-webhook.js         # Handles Stripe webhooks
└── transactions/[id].js      # Transaction status API

pages/
└── payment-failed.js         # Payment failure page

components/
└── PaymentForm.js            # Updated with real Stripe integration
```

## 🛠 Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...

# Optional (for webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Database Schema Changes
- Added `paymentIntentId` field to Order model
- Updated payment status tracking
- Enhanced transaction logging

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-payment-intent` | POST | Creates payment intent |
| `/api/stripe-webhook` | POST | Handles Stripe events |
| `/api/transactions/[id]` | GET | Get transaction details |
| `/api/transactions/[id]` | POST | Refresh payment status |

## 🎯 Production Deployment

### 1. Switch to Live Keys
- Replace test keys with live keys in production
- Update webhook endpoint URL
- Configure production database

### 2. Webhook Security
- Ensure webhook endpoint is accessible
- Verify webhook signature validation
- Monitor webhook delivery

### 3. Monitoring
- Set up Stripe Dashboard monitoring
- Log payment failures
- Monitor transaction success rates

## 🚨 Security Best Practices

1. **Never expose secret keys** - Only use in server-side code
2. **Validate webhooks** - Always verify signatures
3. **Handle failures gracefully** - Provide clear error messages
4. **Log securely** - Don't log sensitive payment data
5. **Use HTTPS** - Required for production payments

## 💡 Customization

### Payment Methods
The integration supports all Stripe payment methods:
- Credit/debit cards
- Digital wallets (Apple Pay, Google Pay)
- Buy now, pay later options
- Bank transfers (ACH)

### Styling
Customize the payment form in `components/PaymentForm.js`:
```javascript
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      // Add your custom styles
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**Payment Intent Creation Fails**
- Check API keys are correctly set
- Verify minimum amount (50 cents)
- Ensure customer email is provided

**Webhook Not Receiving Events**
- Verify endpoint URL is correct
- Check webhook secret matches
- Ensure endpoint is publicly accessible

**Card Declined**
- Use test card numbers for development
- Check card details are valid
- Verify sufficient funds (for live cards)

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📞 Support

- **Stripe Documentation**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing
- **Webhook Testing**: https://stripe.com/docs/webhooks/test