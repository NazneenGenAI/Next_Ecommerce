// components/CheckoutForm.js
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutForm = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success('Order placed successfully!');
      clearCart();
      setIsProcessing(false);
      // In a real app, redirect to success page
    }, 2000);
  };

  const total = getCartTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            className="input-field"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            className="input-field"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="input-field"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="input-field"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            required
            className="input-field"
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              className="input-field"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              required
              className="input-field"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number (1234 5678 9012 3456)"
            required
            className="input-field"
            value={formData.cardNumber}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              required
              className="input-field"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              required
              className="input-field"
              value={formData.cvv}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold">
            <div className="flex justify-between text-lg">
              <span>Total: </span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;