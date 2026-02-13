'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { products, categories, testimonials } from '@/data/products';
import { useState } from 'react';

function HeroSection() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-secondary to-black" />
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-accent-orange uppercase tracking-[0.3em] text-sm font-semibold mb-4 animate-fade-in">
          Premium Sports Gear
        </p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6 animate-slide-left">
          UNLEASH YOUR
          <span className="text-accent-orange block">POTENTIAL</span>
        </h1>
        <p className="text-lg text-text-grey max-w-xl mx-auto mb-8 animate-fade-in-up stagger-2">
          Premium sports gear for every athlete. From footwear to equipment, gear up and dominate your game.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <Link
            href="/shop"
            className="bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-accent-orange/25"
          >
            Shop Now
          </Link>
          <Link
            href="/shop?badge=SALE"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200"
          >
            Explore Deals
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <svg className="w-6 h-6 text-text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3">SHOP BY CATEGORY</h2>
        <p className="text-text-grey">Find exactly what you need for your sport</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden card-hover"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-bold font-heading uppercase">{cat.name}</h3>
              <p className="text-xs text-text-grey mt-1">{cat.subcategories.length} subcategories</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrendingProducts() {
  const trending = products.filter(p => p.badge === 'BESTSELLER' || p.rating >= 4.6).slice(0, 8);
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3">TRENDING NOW</h2>
          <p className="text-text-grey">Most popular products this week</p>
        </div>
        <Link href="/shop" className="text-accent-orange hover:text-accent-orange/80 text-sm font-semibold transition-colors hidden sm:block">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {trending.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function DealsBanner() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-accent-orange/20 via-accent-orange/10 to-accent-blue/20 rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-accent-orange/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-lg">
          <span className="text-accent-orange text-sm font-bold uppercase tracking-wider">Limited Time Offer</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-4">
            UP TO 40% OFF<br />SELECTED ITEMS
          </h2>
          <p className="text-text-grey mb-6">
            Don&apos;t miss out on incredible deals on premium sports gear. Offer ends soon!
          </p>
          <Link
            href="/shop?badge=SALE"
            className="inline-block bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
          >
            Shop Deals
          </Link>
        </div>
      </div>
    </section>
  );
}

function BrandsSection() {
  const brandList = ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Wilson', 'Oakley'];
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-center text-3xl sm:text-4xl font-bold font-heading mb-12">TOP BRANDS</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {brandList.map(brand => (
          <Link
            key={brand}
            href={`/shop?brand=${encodeURIComponent(brand)}`}
            className="bg-card border border-border rounded-xl p-6 flex items-center justify-center text-center hover:border-accent-orange/40 transition-all card-hover"
          >
            <span className="font-heading text-lg font-bold text-text-grey group-hover:text-white transition-colors">
              {brand}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold font-heading mb-12">WHAT ATHLETES SAY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`text-sm ${star <= t.rating ? 'text-gold' : 'text-gray-600'}`}>★</span>
                ))}
              </div>
              <p className="text-sm text-text-grey leading-relaxed mb-4">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-text-grey">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">JOIN THE TEAM</h2>
        <p className="text-text-grey mb-8">
          Subscribe to get exclusive deals, early access to new drops, and athlete training tips.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
          />
          <button className="bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <TrendingProducts />
      <DealsBanner />
      <BrandsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
