# Vercel Deployment Guide

## Quick Fix for Database Issues

**⚠️ If products aren't showing after deployment:**

1. **Deploy the app first** (let it build without database operations)
2. **After deployment, visit**: `https://your-app.vercel.app/api/setup-database` (POST request)
3. **Or run this command locally**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/setup-database
   ```

This will seed your production database with products.

## Environment Variables Setup

Make sure you have these environment variables set in your Vercel project:

1. **DATABASE_URL** - Your production PostgreSQL URL from Supabase
2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - Your Stripe publishable key
3. **STRIPE_SECRET_KEY** - Your Stripe secret key  
4. **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook secret

### Getting the correct DATABASE_URL:

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** under "Connection pooling"
4. Use the **Transaction** mode connection string for better compatibility with Vercel

## Database Setup Steps

The build process now only:
1. Generates Prisma client
2. Builds the Next.js app

Database setup happens separately via the `/api/setup-database` endpoint.

## Vercel Configuration

### Products not showing after deployment?

1. **Check Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure DATABASE_URL is set correctly

2. **Check Database Connection:**
   - Verify your Supabase database is accessible from Vercel
   - Check if database tables exist

3. **Manual Database Seed:**
   If automatic seeding fails, you can manually seed:
   ```bash
   # In Vercel Functions tab, run:
   npx prisma db seed
   ```

4. **Check Vercel Build Logs:**
   - Look for Prisma errors during build
   - Check if seeding completed successfully

## Database Status Check

Run this to verify your production database:
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.count().then(count => {
  console.log('Products in database:', count);
  return prisma.\$disconnect();
}).catch(console.error);
"
```