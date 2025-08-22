// components/Footer.js
import Link from 'next/link';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '48px 0 24px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginBottom: '32px'
  };

  const companyInfoStyle = {
    gridColumn: 'span 2'
  };

  const logoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: 'white'
  };

  const descriptionStyle = {
    color: '#d1d5db',
    lineHeight: '1.6',
    marginBottom: '16px',
    maxWidth: '400px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'white'
  };

  const linkListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const linkItemStyle = {
    marginBottom: '8px'
  };

  const linkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'color 0.2s'
  };

  const borderStyle = {
    borderTop: '1px solid #374151',
    paddingTop: '24px',
    textAlign: 'center'
  };

  const copyrightStyle = {
    color: '#9ca3af',
    fontSize: '14px',
    marginBottom: '8px'
  };

  const creditsStyle = {
    color: '#9ca3af',
    fontSize: '14px'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* Company Info */}
          <div style={companyInfoStyle}>
            <h3 style={logoStyle}>NextCommerce</h3>
            <p style={descriptionStyle}>
              Your trusted online store for quality products. We deliver excellence 
              with every purchase and prioritize customer satisfaction above all else.
            </p>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>
              📧 support@nextcommerce.com
              <br />
              📞 1-800-NEXT-COM
              <br />
              📍 123 Commerce St, Tech City, TC 12345
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={sectionTitleStyle}>Quick Links</h4>
            <ul style={linkListStyle}>
              <li style={linkItemStyle}>
                <Link 
                  href="/" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Home
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/products" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Products
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/about" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  About Us
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/contact" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={sectionTitleStyle}>Customer Service</h4>
            <ul style={linkListStyle}>
              <li style={linkItemStyle}>
                <Link 
                  href="/shipping" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Shipping Info
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/returns" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/faq" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  FAQ
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/support" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={sectionTitleStyle}>Categories</h4>
            <ul style={linkListStyle}>
              <li style={linkItemStyle}>
                <Link 
                  href="/products?category=Electronics" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Electronics
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/products?category=Clothing" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Clothing
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/products?category=Home" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Home & Garden
                </Link>
              </li>
              <li style={linkItemStyle}>
                <Link 
                  href="/products?category=Food" 
                  style={linkStyle}
                  onMouseOver={(e) => e.target.style.color = 'white'}
                  onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                >
                  Food & Beverage
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={borderStyle}>
          <p style={copyrightStyle}>
            © 2024 NextCommerce. All rights reserved.
          </p>
          <p style={creditsStyle}>
            Built with ❤️ using Next.js, React, and modern web technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;