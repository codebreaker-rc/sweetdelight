import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $phone: String, $address: String) {
    register(email: $email, password: $password, name: $name, phone: $phone, address: $address) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($userId: ID!, $cakeId: ID!, $quantity: Int!) {
    addToCart(userId: $userId, cakeId: $cakeId, quantity: $quantity) {
      id
      quantity
      cake {
        id
        name
        price
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id)
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $userId: ID!
    $deliveryAddress: String!
    $phone: String!
    $customerName: String!
    $items: [OrderItemInput!]!
  ) {
    createOrder(
      userId: $userId
      deliveryAddress: $deliveryAddress
      phone: $phone
      customerName: $customerName
      items: $items
    ) {
      id
      total
      status
      deliveryAddress
      phone
      customerName
      createdAt
    }
  }
`;
