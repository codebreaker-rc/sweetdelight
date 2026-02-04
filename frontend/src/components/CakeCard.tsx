'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cake as CakeType } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '@/lib/graphql/mutations';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface CakeCardProps {
  cake: CakeType;
}

export default function CakeCard({ cake }: CakeCardProps) {
  const router = useRouter();
  const [addToCart, { loading }] = useMutation(ADD_TO_CART);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
          quantity: 1,
        },
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <Link href={`/cake/${cake.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-64 w-full">
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            className="object-cover"
          />
          {!cake.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
              {cake.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{cake.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {cake.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{cake.weight}</span>
            <span className="text-sm text-gray-500">{cake.flavor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${cake.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!cake.inStock || loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                cake.inStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
