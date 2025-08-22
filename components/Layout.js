// components/Layout.js
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import SmartChatbot from './SmartChatbot'; // Change this import

const Layout = ({ children, title = 'NextCommerce - Modern E-commerce Store' }) => {
  const layoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const mainStyle = {
    flex: 1
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Modern e-commerce store built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={layoutStyle}>
        <Navbar />
        <main style={mainStyle}>{children}</main>
        <Footer />
        <SmartChatbot /> {/* Use Smart Chatbot */}
      </div>
    </>
  );
};

export default Layout;