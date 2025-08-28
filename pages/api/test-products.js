// pages/api/test-products.js
// Simple test endpoint to verify API and database connectivity
import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  console.log('=== TEST PRODUCTS API CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  try {
    // Test 1: Basic API response
    const testResponse = {
      status: 'API endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrlExists: !!process.env.DATABASE_URL,
      publicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set'
    };

    // Test 2: Database connection
    if (!prisma) {
      testResponse.database = 'Prisma client not initialized';
      return res.status(200).json(testResponse);
    }

    console.log('Testing database connection...');
    await prisma.$connect();
    testResponse.database = 'Connected successfully';

    // Test 3: Simple query
    console.log('Testing database query...');
    const productCount = await prisma.product.count();
    testResponse.productCount = productCount;

    // Test 4: Sample products
    const sampleProducts = await prisma.product.findMany({
      take: 2,
      select: {
        id: true,
        name: true,
        category: true,
        price: true
      }
    });
    testResponse.sampleProducts = sampleProducts;

    console.log('✅ All tests passed');
    res.status(200).json(testResponse);

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    const errorResponse = {
      status: 'Error',
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    };

    res.status(500).json(errorResponse);
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(console.error);
    }
  }
}