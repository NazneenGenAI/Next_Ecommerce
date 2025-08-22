// components/CartCounter.js
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

const CartCounter = () => {
  const { getCartItemsCount } = useCart();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartItemsCount());
  }, [getCartItemsCount]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
};

export default CartCounter;