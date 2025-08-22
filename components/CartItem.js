// components/CartItem.js
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          -
        </button>
        
        <span className="w-12 text-center">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>
      
      <div className="ml-4 flex items-center">
        <span className="text-lg font-semibold text-gray-900 w-20 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="ml-4 text-red-600 hover:text-red-800"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;