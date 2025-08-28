// pages/index.js (Alternative approach with client-side fetching)
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      console.log('=== HOMEPAGE: Fetching featured products... ===');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const response = await fetch('/api/products');
      console.log('Homepage API Response status:', response.status);
      
      const data = await response.json();
      console.log('Homepage received data:', data?.length || 0, 'hasError:', !!data?.error);
      
      // Handle both success response (array) and error response (object with products array)
      const products = Array.isArray(data) ? data : (data?.products || []);
      
      setFeaturedProducts(products.slice(0, 4)); // Get first 4 products
      console.log('✅ Featured products set:', products.slice(0, 4).length);
    } catch (error) {
      console.error('❌ Homepage error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Keep all your existing styles...
  const heroStyle = {
    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
    color: 'white',
    padding: '96px 0',
    textAlign: 'center'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const heroTitleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '24px',
    lineHeight: '1.1'
  };

  const heroTextStyle = {
    fontSize: '20px',
    marginBottom: '32px',
    maxWidth: '600px',
    margin: '0 auto 32px'
  };

  const sectionStyle = {
    padding: '64px 0',
    backgroundColor: '#f9fafb'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '48px'
  };

  const sectionTitleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#111827'
  };

  const sectionTextStyle = {
    textAlign: 'center',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
    marginBottom: '48px'
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={containerStyle}>
          <h1 style={heroTitleStyle}>
            Welcome to NextCommerce
          </h1>
          <p style={heroTextStyle}>
            Discover amazing products at unbeatable prices. Your satisfaction is our priority.
          </p>
          <Link
            href="/products"
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.2s'
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>Featured Products</h2>
          <p style={sectionTextStyle}>
            Check out our handpicked selection of amazing products
          </p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p>Loading products...</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              href="/products"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}