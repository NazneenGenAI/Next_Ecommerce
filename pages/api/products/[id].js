// pages/api/products/[id].js
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: String(id) }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      res.status(200).json(product)
    } catch (error) {
      console.error('Error fetching product:', error)
      res.status(500).json({ error: 'Failed to fetch product' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}