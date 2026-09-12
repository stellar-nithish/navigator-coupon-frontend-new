'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import { fetchApi } from '@/lib/api';
import { Product, Category } from '@/types';
import { SlidersHorizontal, Heart, ChevronDown } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory);
        if (selectedFabric) params.set('fabric', selectedFabric);

        const [prodRes, catData] = await Promise.all([
          fetchApi<{ data: Product[] } | Product[]>(`/api/products?${params.toString()}`),
          fetchApi<Category[]>('/api/categories'),
        ]);

        const items = Array.isArray(prodRes) ? prodRes : prodRes?.data || [];
        setProducts(items);
        setCategories(catData || []);
      } catch (e) {
        console.error('Failed to load shop data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeCategory, selectedFabric]);

  const currentCategoryObj = categories.find((c) => c.slug === activeCategory);
  const pageTitle = currentCategoryObj ? currentCategoryObj.name : 'All Shirts';
  const pageSubtitle = currentCategoryObj?.description || 'Thoughtful fabrics. Easy silhouettes. Made for wherever the day takes you.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-stone-900">
      {/* Category Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-[#D97736] uppercase">
          NAVIGATOR SHIRTS / 2026
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C2C24]">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pt-1">
          {pageSubtitle}
        </p>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveCategory('');
              setSelectedFabric('');
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              !activeCategory
                ? 'bg-[#1C2C24] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.slug
                  ? 'bg-[#1C2C24] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              {cat.name.replace(' Shirts', '')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto text-xs text-stone-600 font-medium">
          <button className="flex items-center gap-1.5 hover:text-stone-900">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <div className="flex items-center gap-1 cursor-pointer hover:text-stone-900">
            <span>Featured</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6 hidden lg:block text-xs">
          <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] pb-2 border-b border-stone-200">
            FILTER
          </div>

          {/* Fabric Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-semibold text-stone-800">
              <span>Fabric</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <div className="space-y-2 text-stone-600 pl-1">
              <label className="flex items-center justify-between cursor-pointer hover:text-stone-900">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFabric === 'Cotton'}
                    onChange={() => setSelectedFabric(selectedFabric === 'Cotton' ? '' : 'Cotton')}
                    className="rounded border-stone-300 text-[#1C2C24] focus:ring-0"
                  />
                  <span>Cotton</span>
                </span>
                <span className="text-stone-400">6</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer hover:text-stone-900">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFabric === 'Linen'}
                    onChange={() => setSelectedFabric(selectedFabric === 'Linen' ? '' : 'Linen')}
                    className="rounded border-stone-300 text-[#1C2C24] focus:ring-0"
                  />
                  <span>Linen</span>
                </span>
                <span className="text-stone-400">2</span>
              </label>
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between font-semibold text-stone-800">
              <span>Size</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between font-semibold text-stone-800">
              <span>Price</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="lg:col-span-9">
          <div className="text-xs text-stone-500 mb-4 font-medium">
            {products.length} styles
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="bg-stone-200 rounded-2xl aspect-[4/5]" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500 text-xs">No garments found matching the active filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => {
                const images = Array.isArray(product.images)
                  ? product.images
                  : typeof product.images === 'string'
                  ? JSON.parse(product.images || '[]')
                  : [];
                const mainImage = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900';

                return (
                  <div key={product.id} className="group flex flex-col space-y-3">
                    {/* Folded Shirt Studio Photography Card */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#CDBAA0]/35 border border-stone-200/80 shadow-xs group-hover:shadow-md transition-all">
                      <Link href={`/product/${product.slug}`} className="block w-full h-full">
                        <img
                          src={mainImage}
                          alt={product.title}
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                        />
                      </Link>

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-[#FAF9F5] text-stone-900 text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors shadow-xs"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-[#D97736] uppercase">
                        {product.category?.name?.toUpperCase() || 'COTTON SHIRTS'}
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-sm font-bold text-[#1C2C24] group-hover:text-[#D97736] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-xs font-bold text-[#1C2C24]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Colour Dot */}
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-500">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block shrink-0 shadow-inner"
                          style={{ backgroundColor: product.colourHex || '#5B7B88' }}
                        />
                        <span>{product.color || 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Header />
      <Suspense fallback={<div className="p-16 text-center text-xs text-stone-500">Loading collection...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
