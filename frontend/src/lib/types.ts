export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  flavor: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  userId: string;
  cakeId: string;
  quantity: number;
  cake: Cake;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  cake: {
    name: string;
    image: string;
  };
}

export interface Order {
  id: string;
  total: number;
  status: string;
  deliveryAddress: string;
  phone: string;
  customerName: string;
  createdAt: string;
  items: OrderItem[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}
