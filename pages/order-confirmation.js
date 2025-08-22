// pages/order-confirmation.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // If no order number, redirect to home
    if (mounted && !orderNumber) {
      router.push('/');
    }
  }, [orderNumber, mounted, router]);

  if (!mounted || !orderNumber) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '64px 16px' }}>
          Loading...
        </div>
      </Layout>
    );
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '64px 16px',
    textAlign: 'center'
  };

  const successIconStyle = {
    fontSize: '64px',
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px'
  };

  const orderNumberStyle = {
    fontSize: '20px',
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: '24px'
  };

  const messageStyle = {
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '32px'
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
    margin: '8px'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
    margin: '8px'
  };

  return (
    <Layout title="Order Confirmation - NextCommerce">
      <div style={containerStyle}>
        <div style={successIconStyle}>✅</div>
        
        <h1 style={titleStyle}>Order Confirmed!</h1>
        
        <p style={orderNumberStyle}>
          Order Number: {orderNumber}
        </p>
        
        <div style={messageStyle}>
          <p>Thank you for your purchase! Your order has been successfully placed and is being processed.</p>
          <p>You will receive an email confirmation shortly with your order details and tracking information.</p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link href="/products" style={buttonStyle}>
            Continue Shopping
          </Link>
          
          <Link href="/" style={secondaryButtonStyle}>
            Back to Home
          </Link>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          padding: '24px',
          borderRadius: '8px',
          marginTop: '32px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            What's Next?
          </h3>
          <ul style={{ color: '#6b7280', lineHeight: '1.6' }}>
            <li>✓ Order confirmation email sent</li>
            <li>✓ Payment processed successfully</li>
            <li>⏳ Order being prepared for shipment</li>
            <li>📦 Tracking information will be provided</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}