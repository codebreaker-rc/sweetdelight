# Cake Shop Frontend

Modern e-commerce frontend for the cake shop built with Next.js, TailwindCSS, and Apollo Client.

## Technologies

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Apollo Client (GraphQL)
- Lucide React (Icons)

## Features

- 🏠 Browse and search cakes
- 🔍 Filter by category
- 🛒 Shopping cart management
- 💳 Checkout with pay on delivery
- 👤 User authentication (login/register)
- 📦 Order history and tracking
- 📱 Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

3. Make sure the backend is running on port 4000

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page (browse cakes)
│   ├── cake/[id]/         # Cake detail page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── orders/            # Order history
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ApolloWrapper.tsx  # Apollo Provider wrapper
│   ├── Navbar.tsx         # Navigation bar
│   └── CakeCard.tsx       # Cake card component
└── lib/                   # Utilities and configurations
    ├── apollo-client.ts   # Apollo Client setup
    ├── auth.ts            # Authentication helpers
    ├── types.ts           # TypeScript types
    └── graphql/           # GraphQL queries and mutations
        ├── queries.ts
        └── mutations.ts
```

## Key Features

### Authentication
- JWT-based authentication
- Local storage for token and user data
- Protected routes for cart, checkout, and orders

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart (tied to user account)
- Real-time total calculation

### Checkout
- Pay on delivery system
- Delivery address management
- Order confirmation

### Order Management
- View order history
- Track order status
- Order details with items

## Demo Credentials

```
Email: demo@cakeshop.com
Password: password123
```

## Design

The application uses a modern, clean design with:
- Primary color: Red (#ef4444)
- Responsive grid layouts
- Card-based UI components
- Smooth transitions and hover effects
- Mobile-first approach

## API Integration

The frontend communicates with the GraphQL backend using Apollo Client. All queries and mutations are defined in `src/lib/graphql/`.

### Main Queries
- `GET_CAKES` - Fetch all cakes with optional filters
- `GET_CAKE` - Fetch single cake details
- `GET_CART` - Fetch user's cart items
- `GET_ORDERS` - Fetch user's order history

### Main Mutations
- `LOGIN` / `REGISTER` - User authentication
- `ADD_TO_CART` - Add item to cart
- `UPDATE_CART_ITEM` - Update cart item quantity
- `REMOVE_FROM_CART` - Remove item from cart
- `CREATE_ORDER` - Place a new order

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
