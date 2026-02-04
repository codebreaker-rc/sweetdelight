'use client';

import { useQuery } from '@apollo/client';
import { GET_CAKES, GET_CATEGORIES } from '@/lib/graphql/queries';
import { Cake } from '@/lib/types';
import CakeCard from '@/components/CakeCard';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: cakesData, loading: cakesLoading } = useQuery(GET_CAKES, {
    variables: { search: searchTerm || undefined, category: selectedCategory || undefined },
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const cakes: Cake[] = cakesData?.cakes || [];
  const categories: string[] = categoriesData?.categories || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-600 mb-4">
          Sweet Delights Cake Shop
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Freshly baked cakes delivered to your doorstep with pay on delivery
        </p>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {cakesLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}

      {!cakesLoading && cakes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No cakes found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
