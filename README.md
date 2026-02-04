# Sweet Delights Cake Shop

A full-stack e-commerce application for a cake shop with pay on delivery functionality.

## Overview

This is a complete e-commerce solution featuring:
- **Frontend**: Next.js 14 with TailwindCSS and Apollo Client
- **Backend**: GraphQL API with Apollo Server, Prisma ORM, and PostgreSQL
- **Features**: Browse cakes, shopping cart, user authentication, and pay on delivery checkout

## Project Structure

```
.
├── backend/           # GraphQL API server
│   ├── src/          # Source code
│   ├── prisma/       # Database schema and migrations
│   └── package.json
└── frontend/         # Next.js application
    ├── src/          # Source code
    └── package.json
```

## Technologies

### Backend
- Node.js with TypeScript
- Apollo Server (GraphQL)
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Apollo Client
- Lucide React (Icons)

## Features

✅ **User Authentication**
- Register new account
- Login with JWT
- Secure password hashing

✅ **Product Browsing**
- View all cakes
- Search functionality
- Filter by category
- Detailed product pages

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Persistent cart per user

✅ **Checkout & Orders**
- Pay on delivery system
- Order placement
- Order history
- Order status tracking
- Delivery on doorstep

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/cakeshop?schema=public"
JWT_SECRET="your-secret-key"
PORT=4000
```

4. Run database migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed the database:
```bash
npm run prisma:seed
```

6. Start the server:
```bash
npm run dev
```

Backend will be running at `http://localhost:4000/graphql`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

4. Start the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Demo Credentials

After seeding the database, you can login with:
```
Email: demo@cakeshop.com
Password: password123
```

## Database Schema

### Models
- **User**: Customer accounts with authentication
- **Cake**: Product catalog with details and pricing
- **CartItem**: Shopping cart items linked to users
- **Order**: Order records with delivery information
- **OrderItem**: Individual items within orders

## API Endpoints

The GraphQL API is available at `/graphql` with the following main operations:

### Queries
- `cakes(search, category)` - Get all cakes with optional filters
- `cake(id)` - Get single cake details
- `cart(userId)` - Get user's cart
- `orders(userId)` - Get user's orders
- `categories` - Get all cake categories

### Mutations
- `register(...)` - Create new user account
- `login(email, password)` - Authenticate user
- `addToCart(userId, cakeId, quantity)` - Add item to cart
- `updateCartItem(id, quantity)` - Update cart item
- `removeFromCart(id)` - Remove from cart
- `createOrder(...)` - Place new order

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run prisma:studio # Open Prisma Studio (database GUI)
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start Next.js dev server
npm run lint         # Run linting
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Features in Detail

### Pay on Delivery
- No advance payment required
- Cash or card payment at delivery
- Order confirmation via email (can be implemented)

### Order Status Tracking
Orders go through the following statuses:
- PENDING - Order placed
- CONFIRMED - Order confirmed by shop
- PREPARING - Cake being prepared
- OUT_FOR_DELIVERY - On the way
- DELIVERED - Successfully delivered
- CANCELLED - Order cancelled

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Secure HTTP-only cookies (can be implemented)
- Input validation on both client and server

## Future Enhancements

- Email notifications
- Admin dashboard
- Payment gateway integration
- Reviews and ratings
- Wishlist functionality
- Coupon codes and discounts
- Real-time order tracking

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
