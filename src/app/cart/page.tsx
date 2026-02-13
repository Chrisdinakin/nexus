'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice - discount + shipping;

  const handlePromo = () => {
    if (promoCode.toLowerCase() === 'sport10') {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-text-grey mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop" className="bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-8">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-card border border-border rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-text-grey uppercase tracking-wider">{item.product.brand}</p>
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-semibold hover:text-accent-orange transition-colors">{item.product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-grey">
                      <span>Size: {item.selectedSize}</span>
                      <span className="w-3 h-3 rounded-full border border-white/20 inline-block" style={{ backgroundColor: item.selectedColor }} />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-text-grey hover:text-danger transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-sm hover:border-white/30"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-sm hover:border-white/30"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>

            {/* Promo */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Promo code"
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange"
              />
              <button
                onClick={handlePromo}
                className="bg-secondary border border-border hover:border-accent-orange text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-accent-green text-xs mb-4">✓ Code SPORT10 applied — 10% off!</p>
            )}

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-grey">Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-accent-green">Discount</span>
                  <span className="text-accent-green">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-grey">Shipping</span>
                <span>{shipping === 0 ? <span className="text-accent-green">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-accent-orange hover:bg-accent-orange/80 text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider mt-6 transition-all"
            >
              Proceed to Checkout
            </Link>

            <Link href="/shop" className="block text-center text-text-grey hover:text-white text-sm mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
