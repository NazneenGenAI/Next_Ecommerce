// pages/api/debug.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    databaseUrlPreview: process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.substring(0, 30) + '...' + process.env.DATABASE_URL.slice(-20) : 
      'Not available'
  }

  try {
    // Test 1: Basic connection
    await prisma.$connect()
    debug.connectionTest = '✅ Success'

    // Test 2: Check if tables exist
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
      `
      debug.tablesFound = tables.map(t => t.table_name)
    } catch (err) {
      debug.tablesError = err.message
    }

    // Test 3: Product count
    try {
      const productCount = await prisma.product.count()
      debug.productCount = productCount
    } catch (err) {
      debug.productCountError = err.message
    }

    // Test 4: Sample products
    if (debug.productCount > 0) {
      try {
        const sampleProducts = await prisma.product.findMany({
          take: 3,
          select: { id: true, name: true, price: true, image: true }
        })
        debug.sampleProducts = sampleProducts
      } catch (err) {
        debug.sampleProductsError = err.message
      }
    }

    // Test 5: Raw database version
    try {
      const version = await prisma.$queryRaw`SELECT version();`
      debug.databaseVersion = version[0]?.version
    } catch (err) {
      debug.versionError = err.message
    }

    return res.status(200).json({
      success: true,
      message: 'Debug information gathered',
      debug
    })

  } catch (error) {
    debug.connectionError = error.message
    debug.errorCode = error.code

    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      debug
    })
  } finally {
    await prisma.$disconnect()
  }
}