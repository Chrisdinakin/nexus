'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`text-xs ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-600'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeColors: Record<string, string> = {
    NEW: 'bg-accent-green text-black',
    SALE: 'bg-danger text-white',
    BESTSELLER: 'bg-gold text-black',
    LIMITED: 'bg-accent-orange text-white',
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden card-hover">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        {!imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-grey text-4xl">
            🏃
          </div>
        )}
        {product.badge && (
          <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-text-grey uppercase tracking-wider mb-1">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-white hover:text-accent-orange transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-text-grey">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold font-mono">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-text-grey line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-xs text-danger font-semibold">-{discount}%</span>
            </>
          )}
        </div>

        {/* Colors */}
        <div className="flex gap-1.5 mt-3">
          {product.colors.map(color => (
            <span
              key={color}
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
          className="mt-3 w-full bg-accent-orange hover:bg-accent-orange/80 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
