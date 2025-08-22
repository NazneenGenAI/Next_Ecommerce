// pages/checkout.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PaymentForm from '../components/PaymentForm';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Payment
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  useEffect(() => {
    setMounted(true);
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
          if (items.length === 0) {
            router.push('/cart');
          }
        } else {
          router.push('/cart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        router.push('/cart');
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
    
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const totals = calculateTotals();
      
      const orderData = {
        items: cartItems,
        customerInfo: formData,
        totals: totals,
        paymentIntentId: paymentIntentId
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Redirect to order confirmation
        router.push(`/order-confirmation?orderNumber=${result.orderNumber}`);
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    
    // Extract meaningful error message
    let errorMessage = 'Payment failed. Please try again.';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.type) {
      switch (error.type) {
        case 'card_error':
          errorMessage = `Card Error: ${error.message || 'Your card was declined.'}`;
          break;
        case 'validation_error':
          errorMessage = 'Please check your card information and try again.';
          break;
        default:
          errorMessage = 'Payment failed. Please try again.';
      }
    }

    toast.error(errorMessage);
    
    // Optional: Redirect to failure page for serious errors
    if (error.type === 'card_error' && error.decline_code) {
      const searchParams = new URLSearchParams({
        error: errorMessage,
        paymentIntentId: error.payment_intent?.id || ''
      });
      router.push(`/payment-failed?${searchParams.toString()}`);
    }
  };

  if (!mounted || cartItems.length === 0) {
    return (
      <Layout title="Checkout - NextCommerce">
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

  const totals = calculateTotals();

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: currentStep === 1 ? '2fr 1fr' : '1fr 1fr',
    gap: '32px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const stepIndicatorStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px'
  };

  const stepStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    margin: '0 16px',
    color: active ? '#2563eb' : '#9ca3af',
    fontWeight: active ? '600' : '400'
  });

  return (
    <Layout title="Checkout - NextCommerce">
      <div style={containerStyle}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          Checkout
        </h1>

        {/* Step Indicator */}
        <div style={stepIndicatorStyle}>
          <div style={stepStyle(currentStep === 1)}>
            <span style={{ 
              backgroundColor: currentStep === 1 ? '#2563eb' : '#e5e7eb',
              color: currentStep === 1 ? 'white' : '#6b7280',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              1
            </span>
            Information
          </div>
          <div style={stepStyle(currentStep === 2)}>
            <span style={{ 
              backgroundColor: currentStep === 2 ? '#2563eb' : '#e5e7eb',
              color: currentStep === 2 ? 'white' : '#6b7280',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              2
            </span>
            Payment
          </div>
        </div>

        <div style={gridStyle}>
          {/* Left Column */}
          <div>
            {currentStep === 1 ? (
              /* Step 1: Customer Information */
              <form onSubmit={handleContinueToPayment}>
                {/* Personal Information */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                    Personal Information
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                    Shipping Address
                  </h2>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address *"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code *"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      style={inputStyle}
                      required
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="US">Finland</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              /* Step 2: Payment */
              <div>
                <PaymentForm
                  total={totals.total}
                  customerInfo={formData}
                  items={cartItems}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  loading={loading}
                  setLoading={setLoading}
                />
                
                <button
                  onClick={() => setCurrentStep(1)}
                  style={{
                    width: '100%',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  ← Back to Information
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Order Summary
              </h2>
              
              {/* Items */}
              <div style={{ marginBottom: '16px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Shipping:</span>
                  <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Tax:</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '8px'
                }}>
                  <span>Total:</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              {totals.subtotal < 50 && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '16px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  Add ${(50 - totals.subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}