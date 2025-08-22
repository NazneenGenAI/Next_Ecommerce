// components/ProductCard.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!mounted) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = existingCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        {/* Using CSS background image instead of Next.js Image */}
        <div style={{
          width: '100%',
          height: '220px',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f8f9fa',
          cursor: 'pointer'
        }}>
          {/* Fallback text if image fails to load */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(248, 249, 250, 0.8)',
            fontSize: '14px',
            color: '#6b7280',
            opacity: product.image ? 0 : 1
          }}>
            {product.name}
          </div>
        </div>
      </Link>
      
      <div style={{
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Link href={`/product/${product.id}`} style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '8px',
          textDecoration: 'none',
          display: 'block',
          lineHeight: '1.4',
          minHeight: '50px'
        }}>
          {product.name}
        </Link>
        
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {product.description}
        </p>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>
              ${product.price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!mounted || product.stock === 0}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: '500',
            marginTop: '8px'
          }}>
            Stock: {product.stock} available
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;