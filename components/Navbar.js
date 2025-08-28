// components/Navbar.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    updateCartCount();
  }, []);

  // Function to update cart count
  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          const count = cartItems.reduce((total, item) => total + item.quantity, 0);
          setCartItemsCount(count);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.log('Error reading cart');
        setCartItemsCount(0);
      }
    }
  };

  // Listen for cart updates
  useEffect(() => {
    if (!mounted) return;

    // Update cart count when component mounts
    updateCartCount();

    // Listen for cart update events
    const handleCartUpdate = () => {
      updateCartCount();
    };

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    // Add event listeners
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mounted]);

  const navStyle = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '1px solid #e5e7eb'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
    textDecoration: 'none'
  };

  const menuStyle = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  };

  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const cartStyle = {
    position: 'relative',
    color: '#374151',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    animation: cartItemsCount > 0 ? 'pulse 0.5s ease-in-out' : 'none'
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .cart-link:hover {
          background-color: #f3f4f6;
        }
      `}</style>
      
      <nav style={navStyle}>
        <div style={containerStyle}>
          <div style={flexStyle}>
            {/* Logo */}
            <Link href="/" style={logoStyle}>
              NextCommerce
            </Link>

            {/* Desktop Menu */}
            <div style={menuStyle}>
              <Link href="/" style={linkStyle}>Home</Link>
              <Link href="/products" style={linkStyle}>Products</Link>
              <Link href="/about" style={linkStyle}>About</Link>
              <Link href="/contact" style={linkStyle}>Contact</Link>
            </div>

            {/* Right Side Icons */}
            <div style={iconContainerStyle}>
              {mounted && isAuthenticated ? (
                <>
                  <Link href="/profile" style={linkStyle}>
                    👤 {user?.firstName || 'Profile'}
                  </Link>
                  <button 
                    onClick={logout}
                    style={{
                      ...linkStyle,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link href="/login" style={linkStyle}>
                  👤 Login
                </Link>
              )}
              <Link 
                href="/cart" 
                style={cartStyle}
                className="cart-link"
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🛒 Cart
                {mounted && cartItemsCount > 0 && (
                  <span style={badgeStyle}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div style={{ paddingBottom: '16px' }}>
              <Link href="/" style={{ display: 'block', padding: '8px 0', color: '#374151', textDecoration: 'none' }}>
                Home
              </Link>
              <Link href="/products" style={{ display: 'block', padding: '8px 0', color: '#374151', textDecoration: 'none' }}>
                Products
              </Link>
              <Link href="/about" style={{ display: 'block', padding: '8px 0', color: '#374151', textDecoration: 'none' }}>
                About
              </Link>
              <Link href="/contact" style={{ display: 'block', padding: '8px 0', color: '#374151', textDecoration: 'none' }}>
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;