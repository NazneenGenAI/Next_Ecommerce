// pages/api/products/index.js
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  console.log('=== PRODUCTS API CALLED ===')
  console.log('Method:', req.method)
  console.log('Query params:', req.query)
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  if (req.method === 'GET') {
    try {
      // If Prisma client failed to initialize, return empty array
      if (!prisma) {
        console.error('❌ Prisma client not available')
        return res.status(200).json([])
      }

      console.log('✅ Prisma client available')
      const { category, search } = req.query
      
      const where = {}
      
      if (category && category !== 'All') {
        where.category = category
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      console.log('🔍 Querying products with filter:', where)
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
      
      // Ensure we always return an array
      const safeProducts = Array.isArray(products) ? products : []
      
      console.log(`✅ Successfully fetched ${safeProducts.length} products`)
      console.log('Products preview:', safeProducts.slice(0, 2).map(p => ({ id: p.id, name: p.name })))
      
      // Send response immediately without disconnecting
      return res.status(200).json(safeProducts)
      
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      
      // Always return an empty array on error to prevent frontend crashes
      return res.status(500).json({ error: 'Failed to fetch products', products: [] })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}