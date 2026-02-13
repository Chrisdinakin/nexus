'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { categories } from '@/data/products';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-xl font-bold tracking-wider font-heading text-white">
              ATHLETIX
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link href="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Shop
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              {shopOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-secondary rounded-xl border border-border p-6 grid grid-cols-4 gap-4 animate-fade-in shadow-2xl">
                  {categories.map(cat => (
                    <div key={cat.slug}>
                      <Link href={`/shop?category=${cat.slug}`} className="text-sm font-semibold text-accent-orange hover:text-white transition-colors">
                        {cat.name}
                      </Link>
                      <ul className="mt-2 space-y-1">
                        {cat.subcategories.slice(0, 5).map(sub => (
                          <li key={sub}>
                            <Link href={`/shop?subcategory=${encodeURIComponent(sub)}`} className="text-xs text-text-grey hover:text-white transition-colors">
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Brands</Link>
            <Link href="/shop?badge=SALE" className="text-sm font-medium text-accent-orange hover:text-white transition-colors">Deals</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Account */}
            <Link href="/account" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 animate-fade-in">
            <input
              type="text"
              placeholder="Search for products, brands, sports..."
              className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-secondary border-t border-border animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <Link href="/shop" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Shop All</Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                {cat.name}
              </Link>
            ))}
            <Link href="/shop?badge=SALE" className="block text-sm text-accent-orange hover:text-white py-2" onClick={() => setMenuOpen(false)}>Deals</Link>
            <Link href="/about" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
