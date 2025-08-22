// update-images.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateImages() {
  console.log('Updating product images...')
  
  // Update each product with working image URLs
  await prisma.product.updateMany({
    where: { name: { contains: "Leather Messenger Bag" } },
    data: { image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" }
  })
  
  await prisma.product.updateMany({
    where: { name: { contains: "Modern Desk Lamp" } },
    data: { image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" }
  })
  
  await prisma.product.updateMany({
    where: { name: { contains: "Premium Coffee Beans" } },
    data: { image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop" }
  })
  
  await prisma.product.updateMany({
    where: { name: { contains: "Smart Fitness Watch" } },
    data: { image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop" }
  })
  
  await prisma.product.updateMany({
    where: { name: { contains: "Wireless Bluetooth Headphones" } },
    data: { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" }
  })
  
  await prisma.product.updateMany({
    where: { name: { contains: "Organic Cotton T-Shirt" } },
    data: { image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" }
  })
  
  console.log('Image update finished.')
}

updateImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })