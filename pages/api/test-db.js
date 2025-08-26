// pages/api/test-db.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseHost: process.env.DATABASE_URL?.split('@')?.[1]?.split(':')?.[0] || 'unknown'
  }

  try {
    console.log('Testing database connection...')
    console.log('Diagnostics:', diagnostics)
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Prisma connected')
    
    // Test raw query first
    const versionResult = await prisma.$queryRaw`SELECT version();`
    console.log('✅ Version query successful')
    
    // Test table access
    const productCount = await prisma.product.count()
    console.log('✅ Product count query successful')
    
    // Get sample products if any exist
    const sampleProducts = await prisma.product.findMany({
      take: 2,
      select: { name: true, price: true }
    })
    console.log('✅ Sample products query successful')
    
    return res.status(200).json({
      success: true,
      message: 'All database tests passed',
      diagnostics,
      results: {
        productCount,
        sampleProducts,
        databaseVersion: versionResult[0]?.version || 'unknown'
      }
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      diagnostics,
      suggestions: [
        'Check if DATABASE_URL is correctly set in Vercel environment variables',
        'Verify Supabase database is accessible from external connections',
        'Try using connection pooling URL (port 6543) instead of direct connection (port 5432)',
        'Add ?pgbouncer=true parameter to DATABASE_URL'
      ]
    })
  } finally {
    await prisma.$disconnect()
  }
}