'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, reviews } from '@/data/products';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/ProductCard';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <Link href="/shop" className="text-accent-orange hover:text-accent-orange/80">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-grey mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-white transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
            {!imageError ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-grey text-6xl">🏃</div>
            )}
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setSelectedImage(i); setImageError(false); }}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-accent-orange' : 'border-border'}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-accent-orange uppercase tracking-wider font-semibold mb-1">{product.brand}</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-lg ${star <= Math.round(product.rating) ? 'text-gold' : 'text-gray-600'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-text-grey">{product.rating} · {product.reviewCount} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold font-mono">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-text-grey line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-danger/20 text-danger text-sm font-semibold px-2 py-0.5 rounded-md">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-text-grey leading-relaxed mb-6">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-accent-orange bg-accent-orange/10 text-accent-orange'
                      : 'border-border text-text-grey hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Color</h3>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-accent-orange scale-110' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-lg hover:border-white/30 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-lg hover:border-white/30 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all ${
                added
                  ? 'bg-accent-green text-black'
                  : 'bg-accent-orange hover:bg-accent-orange/80 text-white'
              }`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <Link
              href="/cart"
              onClick={handleAddToCart}
              className="bg-white text-black py-3.5 px-8 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-white/90 transition-all"
            >
              Buy Now
            </Link>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-text-grey">
              <span>🚚</span>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-grey">
              <span>🔄</span>
              <span>30-day free returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-grey">
              <span>🔒</span>
              <span>Secure checkout</span>
            </div>
          </div>

          {/* Features */}
          {product.features && (
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-sm font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-grey">
                    <span className="text-accent-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-bold font-heading mb-8">CUSTOMER REVIEWS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.author}</p>
                    {review.verified && <p className="text-xs text-accent-green">✓ Verified Purchase</p>}
                  </div>
                </div>
                <span className="text-xs text-text-grey">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`text-xs ${star <= review.rating ? 'text-gold' : 'text-gray-600'}`}>★</span>
                ))}
              </div>
              <p className="text-sm text-text-grey leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold font-heading mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
