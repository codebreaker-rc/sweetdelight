'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_CAKE } from '@/lib/graphql/queries';
import { ADD_TO_CART } from '@/lib/graphql/mutations';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { useState } from 'react';

export default function CakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const { data, loading } = useQuery(GET_CAKE, {
    variables: { id: params.id },
  });

  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART);

  const cake = data?.cake;

  const handleAddToCart = async () => {
    const user = getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await addToCart({
        variables: {
          userId: user.id,
          cakeId: cake.id,
          quantity,
        },
      });
      alert('Added to cart!');
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl">Cake not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-96 md:h-[600px] rounded-lg overflow-hidden">
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <span className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
              {cake.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{cake.name}</h1>

          <p className="text-gray-600 text-lg mb-6">{cake.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-lg font-semibold">{cake.weight}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Flavor</p>
              <p className="text-lg font-semibold">{cake.flavor}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Availability</p>
            <p className={`text-lg font-semibold ${cake.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {cake.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Quantity</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold">Total Price:</span>
              <span className="text-3xl font-bold text-primary-600">
                ${(cake.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!cake.inStock || addingToCart}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg text-lg font-semibold transition ${
              cake.inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span>{addingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
          </button>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pay on Delivery:</strong> No advance payment required. Pay when you receive your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
