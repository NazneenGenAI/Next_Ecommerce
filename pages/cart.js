// pages/cart.js
import Layout from '../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  if (!mounted) {
    return (
      <Layout title="Shopping Cart - NextCommerce">
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '32px 16px',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart - NextCommerce">
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '64px 16px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '16px' 
            }}>
              Your Cart is Empty
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '32px', 
              fontSize: '18px' 
            }}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/products"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart - NextCommerce">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 16px' 
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '32px' 
        }}>
          Shopping Cart ({cartItems.length} items)
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '32px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Cart Items */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    paddingBottom: '24px'
                  }}>
                    {/* Product Image */}
                    <div style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      <Link 
                        href={`/product/${item.id}`}
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#111827',
                          textDecoration: 'none',
                          display: 'block',
                          marginBottom: '4px'
                        }}
                      >
                        {item.name}
                      </Link>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px',
                        margin: 0
                      }}>
                        ${item.price} each
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        -
                      </button>
                      
                      <span style={{
                        minWidth: '40px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div style={{
                      minWidth: '80px',
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textDecoration: 'underline'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  {index < cartItems.length - 1 && (
                    <div style={{
                      borderBottom: '1px solid #e5e7eb',
                      marginBottom: '24px'
                    }} />
                  )}
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '24px',
                textAlign: 'center'
              }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: '1px solid #dc2626',
                    color: '#dc2626',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              border: '1px solid #e5e7eb',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#111827'
              }}>
                Order Summary
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#6b7280' }}>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#6b7280' }}>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#6b7280' }}>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '8px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {total < 50 && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  Add ${(50 - total).toFixed(2)} more for free shipping!
                </div>
              )}

              <Link
                href="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}
              >
                Proceed to Checkout
              </Link>
              
              <Link
                href="/products"
                style={{
                  display: 'block',
                  width: '100%',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}