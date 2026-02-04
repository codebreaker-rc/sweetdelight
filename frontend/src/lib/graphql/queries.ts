import { gql } from '@apollo/client';

export const GET_CAKES = gql`
  query GetCakes($search: String, $category: String) {
    cakes(search: $search, category: $category) {
      id
      name
      description
      price
      image
      category
      weight
      flavor
      inStock
    }
  }
`;

export const GET_CAKE = gql`
  query GetCake($id: ID!) {
    cake(id: $id) {
      id
      name
      description
      price
      image
      category
      weight
      flavor
      inStock
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

export const GET_CART = gql`
  query GetCart($userId: ID!) {
    cart(userId: $userId) {
      id
      userId
      cakeId
      quantity
      cake {
        id
        name
        price
        image
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($userId: ID!) {
    orders(userId: $userId) {
      id
      total
      status
      deliveryAddress
      phone
      customerName
      createdAt
      items {
        id
        quantity
        price
        cake {
          name
          image
        }
      }
    }
  }
`;
