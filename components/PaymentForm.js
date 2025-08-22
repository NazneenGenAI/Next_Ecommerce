// components/PaymentForm.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ 
  total, 
  customerInfo, 
  items, 
  onPaymentSuccess, 
  onPaymentError,
  loading,
  setLoading 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          customerInfo,
          items,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || 'Failed to create payment intent');
        onPaymentError(new Error(data.error || 'Failed to create payment intent'));
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initialize payment');
      onPaymentError(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.zipCode,
              country: customerInfo.country || 'US',
            },
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        setError(error.message);
        onPaymentError(error);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: loading ? '#9ca3af' : '#2563eb',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    opacity: (!stripe || !clientSecret) ? 0.6 : 1
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
        Payment Information
      </h2>
      
      <div style={{
        backgroundColor: '#dcfdf7',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#047857'
      }}>
        🔒 Secure Payment Processing by Stripe
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#dc2626'
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ 
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f9fafb'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#374151'
          }}>
            Card Details
          </label>
          <CardElement 
            options={cardElementOptions}
            onChange={(event) => {
              if (event.error) {
                setError(event.error.message);
              } else {
                setError('');
              }
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          style={buttonStyle}
          onMouseOver={(e) => {
            if (!loading && stripe && clientSecret) {
              e.target.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && stripe && clientSecret) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {loading 
            ? 'Processing Payment...' 
            : !clientSecret 
            ? 'Loading...'
            : `Pay $${total.toFixed(2)}`
          }
        </button>
      </form>

      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '16px',
        textAlign: 'center'
      }}>
        🔒 Your payment is secured with 256-bit SSL encryption
        <br />
        <small>Use test card: 4242 4242 4242 4242 (any CVC, any future date)</small>
      </div>
    </div>
  );
};

const PaymentForm = ({ 
  total, 
  customerInfo, 
  items, 
  onPaymentSuccess, 
  onPaymentError,
  loading,
  setLoading 
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        total={total}
        customerInfo={customerInfo}
        items={items}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        loading={loading}
        setLoading={setLoading}
      />
    </Elements>
  );
};

export default PaymentForm;