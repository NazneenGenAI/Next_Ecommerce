// pages/payment-failed.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function PaymentFailed() {
  const router = useRouter();
  const { error, paymentIntentId } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  const errorIconStyle = {
    fontSize: '64px',
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '16px'
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
    <Layout title="Payment Failed - NextCommerce">
      <div style={containerStyle}>
        <div style={errorIconStyle}>❌</div>
        
        <h1 style={titleStyle}>Payment Failed</h1>
        
        <div style={messageStyle}>
          <p>We were unable to process your payment.</p>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              borderRadius: '8px',
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <p>Your cart items have been preserved. Please try again or use a different payment method.</p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link href="/checkout" style={buttonStyle}>
            Try Again
          </Link>
          
          <Link href="/cart" style={secondaryButtonStyle}>
            Review Cart
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
            Common Payment Issues:
          </h3>
          <ul style={{ color: '#6b7280', lineHeight: '1.6' }}>
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card information</li>
            <li>• Card expired or blocked</li>
            <li>• Bank security restrictions</li>
            <li>• Network connectivity issues</li>
          </ul>
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            If the problem persists, please contact your bank or try a different payment method.
          </p>
        </div>

        {paymentIntentId && (
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '16px'
          }}>
            Payment ID: {paymentIntentId}
          </div>
        )}
      </div>
    </Layout>
  );
}