// pages/_app.js
import '../styles/global.css';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </CartProvider>
  );
}