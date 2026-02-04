'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_CART } from '@/lib/graphql/queries';
import { CREATE_ORDER } from '@/lib/graphql/mutations';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Package } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    deliveryAddress: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setFormData({
        customerName: currentUser.name || '',
        phone: currentUser.phone || '',
        deliveryAddress: currentUser.address || '',
      });
    }
  }, [router]);

  const { data, loading } = useQuery(GET_CART, {
    variables: { userId: user?.id },
    skip: !user,
  });

  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER);

  const cartItems = data?.cart || [];
  const total = cartItems.reduce((sum: number, item: any) => sum + item.cake.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.deliveryAddress) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const orderItems = cartItems.map((item: any) => ({
        cakeId: item.cakeId,
        quantity: item.quantity,
        price: item.cake.price,
      }));

      const { data: orderData } = await createOrder({
        variables: {
          userId: user.id,
          customerName: formData.customerName,
          phone: formData.phone,
          deliveryAddress: formData.deliveryAddress,
          items: orderItems,
        },
      });

      alert('Order placed successfully!');
      router.push(`/orders`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order');
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
        <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-3xl font-bold mb-4">No items to checkout</h2>
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
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Payment Method</h3>
                <p className="text-green-700">Pay on Delivery (Cash/Card)</p>
                <p className="text-sm text-green-600 mt-1">
                  No advance payment required. Pay when you receive your order.
                </p>
              </div>

              <button
                type="submit"
                disabled={creatingOrder}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
              >
                {creatingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.cake.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.cake.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
