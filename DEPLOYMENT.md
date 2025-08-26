# Vercel Deployment Guide

## Environment Variables Setup

Make sure you have these environment variables set in your Vercel project:

1. **DATABASE_URL** - Your production PostgreSQL URL
2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - Your Stripe publishable key
3. **STRIPE_SECRET_KEY** - Your Stripe secret key  
4. **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook secret

## Database Setup Steps

### 1. Check if your production database is accessible:
```bash
# Test database connection
npx prisma db pull --print
```

### 2. Push schema to production database:
```bash
npx prisma db push
```

### 3. Seed the production database:
```bash
npx prisma db seed
```

## Vercel Configuration

The build script automatically:
1. Generates Prisma client
2. Pushes database schema
3. Seeds the database
4. Builds the Next.js app

## Troubleshooting

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