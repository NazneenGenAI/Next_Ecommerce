// pages/product/[id].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import products from '../../data/products.json';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <Layout>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '64px 16px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Product not found
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!mounted) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = existingCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...existingCart, { ...product, quantity: quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== id)
    .slice(0, 4);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    marginBottom: '64px'
  };

  const imageStyle = {
    position: 'relative',
    width: '100%',
    height: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa'
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: '1.2'
  };

  const categoryStyle = {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const priceStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2563eb'
  };

  const descriptionStyle = {
    color: '#374151',
    lineHeight: '1.6',
    fontSize: '16px'
  };

  const featuresStyle = {
    marginTop: '16px'
  };

  const featureListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const featureItemStyle = {
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151'
  };

  const stockContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 0'
  };

  const stockDotStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444'
  };

  const quantityStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  };

  const quantityButtonStyle = {
    width: '40px',
    height: '40px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600'
  };

  const quantityDisplayStyle = {
    minWidth: '60px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600'
  };

  const addToCartButtonStyle = {
    backgroundColor: product.stock === 0 ? '#9ca3af' : '#2563eb',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'background-color 0.2s'
  };

  const relatedSectionStyle = {
    marginTop: '64px'
  };

  const relatedTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '32px'
  };

  const relatedGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  };

  return (
    <Layout title={`${product.name} - NextCommerce`}>
      <div style={containerStyle}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', fontSize: '14px' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', color: '#d1d5db' }}>/</span>
          <Link href="/products" style={{ color: '#6b7280', textDecoration: 'none' }}>Products</Link>
          <span style={{ margin: '0 8px', color: '#d1d5db' }}>/</span>
          <span style={{ color: '#111827' }}>{product.name}</span>
        </div>

        {/* Product Details */}
        <div style={gridStyle}>
          {/* Product Image */}
          <div style={imageStyle}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Product Info */}
          <div style={contentStyle}>
            <div>
              <p style={categoryStyle}>{product.category}</p>
              <h1 style={titleStyle}>{product.name}</h1>
            </div>

            <div style={priceStyle}>
              ${product.price}
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Description
              </h3>
              <p style={descriptionStyle}>{product.description}</p>
            </div>

            {/* Features */}
            <div style={featuresStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Features
              </h3>
              <ul style={featureListStyle}>
                {product.features.map((feature, index) => (
                  <li key={index} style={featureItemStyle}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Status */}
            <div style={stockContainerStyle}>
              <div style={stockDotStyle}></div>
              <span style={{ color: '#374151', fontWeight: '500' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Quantity:
                </label>
                <div style={quantityStyle}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={quantityButtonStyle}
                  >
                    -
                  </button>
                  <span style={quantityDisplayStyle}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={quantityButtonStyle}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!mounted || product.stock === 0}
              style={addToCartButtonStyle}
              onMouseOver={(e) => {
                if (product.stock > 0) {
                  e.target.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseOut={(e) => {
                if (product.stock > 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
            >
              {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={relatedSectionStyle}>
            <h2 style={relatedTitleStyle}>Related Products</h2>
            <div style={relatedGridStyle}>
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb'
                }}>
                  <Link href={`/product/${relatedProduct.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        {relatedProduct.name}
                      </h3>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#2563eb'
                      }}>
                        ${relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}