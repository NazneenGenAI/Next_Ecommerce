# NextCommerce - Modern E-commerce Platform

A full-featured e-commerce website built with Next.js, React, Tailwind CSS, and real payment processing.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real Payment Processing**: Stripe integration with secure transactions
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with persistent cart state
- **Complete Checkout**: Multi-step checkout with real payment processing
- **Order Management**: Full order tracking and transaction logging
- **Database Integration**: PostgreSQL/SQLite with Prisma ORM
- **Admin Dashboard**: Product CRUD operations
- **Mobile Responsive**: Optimized for all devices
- **SEO Optimized**: Server-side rendering with Next.js

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Payments**: Stripe Payment Intents
- **State Management**: React Context API
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Images**: Next.js Image optimization

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local and add:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
DATABASE_URL="file:./dev.db"
```

4. Set up database:
```bash
npx prisma db push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── components/           # Reusable UI components
│   ├── Layout.js        # Main layout wrapper
│   ├── Navbar.js        # Navigation component
│   ├── Footer.js        # Footer component
│   ├── ProductCard.js   # Product display card
│   ├── CartItem.js      # Cart item component
│   └── CheckoutForm.js  # Checkout form
├── context/             # React Context providers
│   └── CartContext.js   # Shopping cart state management
├── data/                # Mock data
│   └── products.json    # Product database
├── pages/               # Next.js pages
│   ├── index.js         # Homepage
│   ├── products.js      # Products listing
│   ├── cart.js          # Shopping cart
│   ├── checkout.js      # Checkout process
│   ├── login.js         # User login
│   ├── register.js      # User registration
│   ├── product/[id].js  # Product details
│   ├── admin/           # Admin pages
│   └── api/             # API routes
├── styles/              # Global styles
│   └── globals.css      # Tailwind imports
└── utils/               # Utility functions
    ├── constants.js     # App constants
    └── formatters.js    # Helper functions
```

## 🎨 Pages Overview

### Homepage (`/`)
- Hero section with call-to-action
- Featured products grid
- Company features and benefits

### Products Page (`/products`)
- All products with search functionality
- Category filtering
- Responsive grid layout

### Product Detail Page (`/product/[id]`)
- Detailed product information
- Add to cart functionality
- Related products section

### Shopping Cart (`/cart`)
- Cart items with quantity controls
- Order summary with calculations
- Proceed to checkout

### Checkout (`/checkout`)
- Customer information form
- Shipping address
- Payment details (mock)
- Order summary

### Authentication
- Login page (`/login`)
- Registration page (`/register`)
- Mock authentication system

### Admin Dashboard (`/admin`)
- View all products
- Add new products
- Delete products
- Simple CRUD operations

## 🛒 Key Features

### Shopping Cart
- Persistent cart state (localStorage)
- Add/remove/update quantities
- Real-time total calculations
- Cart item counter in navbar

### Product Management
- Dynamic product pages
- Search and filter functionality
- Category-based organization
- Stock management

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible navigation

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color scheme
- Extended utility classes
- Responsive breakpoints
- Component classes for buttons and forms

### Environment Variables
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🎯 Future Enhancements

- Real payment integration (Stripe)
- User authentication with NextAuth.js
- Product reviews and ratings
- Wishlist functionality
- Order history
- Email notifications
- Advanced search with filters
- Product recommendations
- Admin analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- Unsplash for product images

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**