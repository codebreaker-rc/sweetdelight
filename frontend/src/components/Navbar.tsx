'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Cake } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
            <Cake className="w-8 h-8" />
            <span>Sweet Delights</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>

            {user ? (
              <>
                <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </Link>
                <Link href="/orders" className="text-gray-700 hover:text-primary-600 transition">
                  Orders
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
