// pages/api/test-db.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    // Test connection
    await prisma.$connect()
    
    // Count products
    const productCount = await prisma.product.count()
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT version();`
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      productCount,
      databaseVersion: result[0].version,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database connection failed:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    })
  } finally {
    await prisma.$disconnect()
  }
}