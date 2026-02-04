# Cake Shop Backend

GraphQL API backend for the cake shop e-commerce application.

## Technologies

- Node.js with TypeScript
- Apollo Server (GraphQL)
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/cakeshop?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=4000
```

3. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed the database with sample data:
```bash
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

The GraphQL API will be available at `http://localhost:4000/graphql`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with sample data

## GraphQL Schema

The API provides the following main types:
- **Cake** - Product information
- **User** - Customer accounts
- **CartItem** - Shopping cart items
- **Order** - Order information
- **OrderItem** - Individual items in an order

## Sample Queries

### Get all cakes
```graphql
query {
  cakes {
    id
    name
    price
    image
    category
  }
}
```

### Search cakes
```graphql
query {
  cakes(search: "chocolate") {
    id
    name
    price
  }
}
```

### Get user's cart
```graphql
query {
  cart(userId: "user-id") {
    id
    quantity
    cake {
      name
      price
    }
  }
}
```

## Sample Mutations

### Register
```graphql
mutation {
  register(
    email: "user@example.com"
    password: "password123"
    name: "John Doe"
  ) {
    token
    user {
      id
      email
      name
    }
  }
}
```

### Add to cart
```graphql
mutation {
  addToCart(
    userId: "user-id"
    cakeId: "cake-id"
    quantity: 1
  ) {
    id
    quantity
  }
}
```

### Create order
```graphql
mutation {
  createOrder(
    userId: "user-id"
    deliveryAddress: "123 Main St"
    phone: "+1234567890"
    customerName: "John Doe"
    items: [
      { cakeId: "cake-id", quantity: 1, price: 35.99 }
    ]
  ) {
    id
    total
    status
  }
}
```

## Default User

After seeding, you can login with:
- Email: `demo@cakeshop.com`
- Password: `password123`
