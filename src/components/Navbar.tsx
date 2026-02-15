'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { categories } from '@/data/products';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {/* Account / User Menu */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-xs font-bold text-accent-orange uppercase">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">
                      {user.firstName}
                    </span>
                    <svg className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-secondary rounded-xl border border-border shadow-2xl overflow-hidden animate-fade-in">
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-text-grey truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-card transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          My Account
                        </Link>
                        <Link href="/account?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-card transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          Orders
                        </Link>
                        <Link href="/account?tab=wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-card transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          Wishlist
                        </Link>
                        <Link href="/account?tab=settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-card transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-border py-1">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
              )}
            </div>

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
            {/* Mobile Auth */}
            {user ? (
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-sm font-bold text-accent-orange uppercase">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-text-grey truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pb-3 mb-3 border-b border-border">
                <Link href="/login" className="flex-1 text-center bg-accent-orange text-white py-2.5 rounded-lg text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="flex-1 text-center border border-border text-white py-2.5 rounded-lg text-sm font-semibold hover:border-white/30" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}

            <Link href="/shop" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Shop All</Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                {cat.name}
              </Link>
            ))}
            <Link href="/shop?badge=SALE" className="block text-sm text-accent-orange hover:text-white py-2" onClick={() => setMenuOpen(false)}>Deals</Link>
            <Link href="/about" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Contact</Link>

            {user && (
              <>
                <div className="border-t border-border pt-3 mt-3 space-y-3">
                  <Link href="/account" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>My Account</Link>
                  <Link href="/account?tab=orders" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Orders</Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="block text-sm text-danger hover:text-danger/80 py-2"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
