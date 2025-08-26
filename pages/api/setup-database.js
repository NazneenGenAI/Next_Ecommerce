// pages/api/setup-database.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Products data
const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    stock: 15,
    features: ["Noise Cancellation", "30h Battery", "Quick Charge", "Premium Sound"]
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    description: "Soft and comfortable organic cotton t-shirt. Sustainable fashion that feels great and looks amazing.",
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    stock: 25,
    features: ["Organic Cotton", "Sustainable", "Soft Feel", "Multiple Colors"]
  },
  {
    name: "Smart Fitness Watch",
    price: 199.99,
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop",
    stock: 8,
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"]
  },
  {
    name: "Premium Coffee Beans",
    price: 24.99,
    description: "Freshly roasted arabica coffee beans sourced from sustainable farms.",
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    stock: 50,
    features: ["100% Arabica", "Freshly Roasted", "Sustainable Source", "Rich Flavor"]
  },
  {
    name: "Modern Desk Lamp",
    price: 45.99,
    description: "Sleek LED desk lamp with adjustable brightness and color temperature.",
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    stock: 12,
    features: ["LED Technology", "Adjustable Brightness", "Color Temperature", "Modern Design"]
  },
  {
    name: "Leather Messenger Bag",
    price: 89.99,
    description: "Handcrafted genuine leather messenger bag. Stylish and functional.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    stock: 18,
    features: ["Genuine Leather", "Handcrafted", "Multiple Compartments", "Adjustable Strap"]
  }
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Check current product count
    const productCount = await prisma.product.count()
    console.log(`📦 Current products in database: ${productCount}`)

    if (productCount === 0) {
      console.log('🌱 Seeding database with products...')
      
      for (const product of products) {
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        })
        
        if (!existingProduct) {
          await prisma.product.create({
            data: product
          })
          console.log(`✅ Created product: ${product.name}`)
        }
      }
      
      const newProductCount = await prisma.product.count()
      console.log(`🎉 Database seeded! Total products: ${newProductCount}`)
      
      return res.status(200).json({
        success: true,
        message: `Database seeded successfully with ${newProductCount} products`,
        productsCreated: newProductCount
      })
    } else {
      return res.status(200).json({
        success: true,
        message: `Database already has ${productCount} products`,
        productsCreated: 0
      })
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    })
  } finally {
    await prisma.$disconnect()
  }
}