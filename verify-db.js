const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if Product table exists and count products
    const productCount = await prisma.product.count();
    console.log(`📦 Products in database: ${productCount}`);
    
    if (productCount === 0) {
      console.log('⚠️  No products found. Database needs to be seeded.');
      console.log('💡 Run: npx prisma db seed');
    } else {
      // Show first few products
      const products = await prisma.product.findMany({
        take: 3,
        select: { name: true, price: true, image: true }
      });
      
      console.log('\n📋 Sample products:');
      products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} - $${p.price}`);
        console.log(`   Image: ${p.image.substring(0, 60)}...`);
      });
    }
    
    // Check orders table
    const orderCount = await prisma.order.count();
    console.log(`\n📋 Orders in database: ${orderCount}`);
    
    console.log('\n✅ Database verification complete');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('💡 Database connection failed. Check your DATABASE_URL environment variable.');
    } else if (error.code === 'P2021') {
      console.log('💡 Table does not exist. Run: npx prisma db push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();