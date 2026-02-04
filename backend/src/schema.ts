export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    address: String
    createdAt: String!
    orders: [Order!]!
  }

  type Cake {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String!
    category: String!
    weight: String!
    flavor: String!
    inStock: Boolean!
    createdAt: String!
  }

  type CartItem {
    id: ID!
    userId: String!
    cakeId: String!
    quantity: Int!
    cake: Cake!
    createdAt: String!
  }

  type Order {
    id: ID!
    userId: String!
    total: Float!
    status: OrderStatus!
    paymentMethod: String!
    deliveryAddress: String!
    phone: String!
    customerName: String!
    items: [OrderItem!]!
    createdAt: String!
  }

  type OrderItem {
    id: ID!
    orderId: String!
    cakeId: String!
    quantity: Int!
    price: Float!
    cake: Cake!
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PREPARING
    OUT_FOR_DELIVERY
    DELIVERED
    CANCELLED
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    cakes(search: String, category: String): [Cake!]!
    cake(id: ID!): Cake
    categories: [String!]!
    cart(userId: ID!): [CartItem!]!
    orders(userId: ID!): [Order!]!
    order(id: ID!): Order
    me(token: String!): User
  }

  type Mutation {
    register(email: String!, password: String!, name: String!, phone: String, address: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    addToCart(userId: ID!, cakeId: ID!, quantity: Int!): CartItem!
    updateCartItem(id: ID!, quantity: Int!): CartItem!
    removeFromCart(id: ID!): Boolean!
    clearCart(userId: ID!): Boolean!
    
    createOrder(
      userId: ID!
      deliveryAddress: String!
      phone: String!
      customerName: String!
      items: [OrderItemInput!]!
    ): Order!
    
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  }

  input OrderItemInput {
    cakeId: ID!
    quantity: Int!
    price: Float!
  }
`;
