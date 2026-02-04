'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries';
import { UPDATE_CART_ITEM, REMOVE_FROM_CART } from '@/lib/graphql/mutations';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const { data, loading, refetch } = useQuery(GET_CART, {
    variables: { userId: user?.id },
    skip: !user,
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const cartItems = data?.cart || [];
  const total = cartItems.reduce((sum: number, item: any) => sum + item.cake.price * item.quantity, 0);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem({
        variables: { id: itemId, quantity: newQuantity },
      });
      refetch();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart({
        variables: { id: itemId },
      });
      refetch();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some delicious cakes to get started!</p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Browse Cakes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.cake.image}
                    alt={item.cake.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{item.cake.name}</h3>
                  <p className="text-primary-600 font-bold">${item.cake.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold mb-2">
                    ${(item.cake.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 text-center">
                Pay on Delivery Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
