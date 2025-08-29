// pages/api/products/index.js
import { prisma } from '../../../lib/prisma'
import productsData from '../../../data/products.json'

export default async function handler(req, res) {
  console.log('=== PRODUCTS API CALLED ===')
  console.log('Method:', req.method)
  console.log('Query params:', req.query)
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  
  if (req.method === 'GET') {
    const { category, search } = req.query
    
    try {
      // Try database first if available
      if (prisma && process.env.DATABASE_URL) {
        console.log('✅ Attempting database connection')
        
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
        
        const safeProducts = Array.isArray(products) ? products : []
        console.log(`✅ Successfully fetched ${safeProducts.length} products from database`)
        
        return res.status(200).json(safeProducts)
      }
    } catch (error) {
      console.error('❌ Database error, falling back to JSON data:', error.message)
    }
    
    // Fallback to JSON data
    console.log('📄 Using fallback JSON data')
    let filteredProducts = [...productsData]
    
    // Apply category filter
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    console.log(`✅ Returning ${filteredProducts.length} products from JSON fallback`)
    return res.status(200).json(filteredProducts)
    
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}