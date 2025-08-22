// test-prisma.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products`);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();