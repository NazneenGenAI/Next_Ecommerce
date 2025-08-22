// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Headphones",
    stock: 15,
    features: ["Noise Cancellation", "30h Battery", "Quick Charge", "Premium Sound"]
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    description: "Soft and comfortable organic cotton t-shirt. Sustainable fashion that feels great and looks amazing.",
    category: "Clothing",
    image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=T-Shirt",
    stock: 25,
    features: ["Organic Cotton", "Sustainable", "Soft Feel", "Multiple Colors"]
  },
  {
    name: "Smart Fitness Watch",
    price: 199.99,
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone connectivity.",
    category: "Electronics",
    image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Watch",
    stock: 8,
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"]
  },
  {
    name: "Premium Coffee Beans",
    price: 24.99,
    description: "Freshly roasted arabica coffee beans sourced from sustainable farms.",
    category: "Food & Beverage",
    image: "https://via.placeholder.com/400x400/D97706/FFFFFF?text=Coffee",
    stock: 50,
    features: ["100% Arabica", "Freshly Roasted", "Sustainable Source", "Rich Flavor"]
  },
  {
    name: "Modern Desk Lamp",
    price: 45.99,
    description: "Sleek LED desk lamp with adjustable brightness and color temperature.",
    category: "Home & Garden",
    image: "https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Desk+Lamp",
    stock: 12,
    features: ["LED Technology", "Adjustable Brightness", "Color Temperature", "Modern Design"]
  },
  {
    name: "Leather Messenger Bag",
    price: 89.99,
    description: "Handcrafted genuine leather messenger bag. Stylish and functional.",
    category: "Accessories",
    image: "https://via.placeholder.com/400x400/7C2D12/FFFFFF?text=Bag",
    stock: 18,
    features: ["Genuine Leather", "Handcrafted", "Multiple Compartments", "Adjustable Strap"]
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const product of products) {
    const result = await prisma.product.create({
      data: {
        ...product,
        features: product.features.join(', ')
      },
    })
    console.log(`Created product with id: ${result.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })