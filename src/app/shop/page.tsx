'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories, sports, brands } from '@/data/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialBadge = searchParams.get('badge') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }
    if (selectedSport) {
      result = result.filter(p => p.sport === selectedSport);
    }
    if (initialBadge) {
      result = result.filter(p => p.badge === initialBadge);
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (a.badge === 'NEW' ? -1 : 1)); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [selectedCategory, selectedBrand, selectedSport, priceRange, sortBy, initialBadge]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSport('');
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedCategory || selectedBrand || selectedSport || initialBadge;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            {initialBadge ? `${initialBadge} ITEMS` : selectedCategory ? selectedCategory.toUpperCase() : 'ALL PRODUCTS'}
          </h1>
          <p className="text-text-grey text-sm mt-1">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden bg-card border border-border rounded-lg px-4 py-2 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-orange"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
          <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-72 bg-secondary p-6 overflow-y-auto' : ''} lg:relative lg:w-full lg:p-0`}>
            {filtersOpen && (
              <button onClick={() => setFiltersOpen(false)} className="lg:hidden absolute top-4 right-4 text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            <div className="space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Active Filters</span>
                    <button onClick={clearFilters} className="text-xs text-accent-orange hover:text-accent-orange/80">Clear All</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="bg-accent-orange/20 text-accent-orange text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('')}>×</button>
                      </span>
                    )}
                    {selectedBrand && (
                      <span className="bg-accent-orange/20 text-accent-orange text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        {selectedBrand}
                        <button onClick={() => setSelectedBrand('')}>×</button>
                      </span>
                    )}
                    {selectedSport && (
                      <span className="bg-accent-orange/20 text-accent-orange text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        {selectedSport}
                        <button onClick={() => setSelectedSport('')}>×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat.slug} className="flex items-center gap-2 text-sm text-text-grey hover:text-white cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                        className="accent-accent-orange"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sport */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Sport</h3>
                <div className="space-y-2">
                  {sports.map(sport => (
                    <label key={sport} className="flex items-center gap-2 text-sm text-text-grey hover:text-white cursor-pointer">
                      <input
                        type="radio"
                        name="sport"
                        checked={selectedSport === sport}
                        onChange={() => setSelectedSport(selectedSport === sport ? '' : sport)}
                        className="accent-accent-orange"
                      />
                      {sport}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-text-grey hover:text-white cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                        className="accent-accent-orange"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Price Range</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-grey">${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 accent-accent-orange"
                  />
                  <span className="text-xs text-text-grey">${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-text-grey mb-4">Try adjusting your filters to find what you&apos;re looking for.</p>
              <button onClick={clearFilters} className="text-accent-orange hover:text-accent-orange/80 text-sm font-semibold">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-text-grey">Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
