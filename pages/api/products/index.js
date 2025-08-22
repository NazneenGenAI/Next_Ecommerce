// pages/api/products/index.js
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
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
      
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
      
      res.status(200).json(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({ error: 'Failed to fetch products' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}