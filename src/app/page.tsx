'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import { fetchApi } from '@/lib/api';
import { Product } from '@/types';
import { ArrowRight, Sparkles, Compass, CheckCircle, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchApi<{ data: Product[] } | Product[]>('/api/products');
        const items = Array.isArray(res) ? res : res?.data || [];
        setProducts(items);
      } catch (e) {
        console.error('Failed to load products', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#f2eee9] border-b border-stone-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ab8d6c]/15 text-[#7a5d45] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Monsoon Edit • New Season</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.1]">
                Made for the road. <br />
                <span className="italic font-normal text-stone-700">Refined for everywhere.</span>
              </h1>
              <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
                Breathable shirts, easy layers and considered details for days that change direction. Crafted with Indian climate in mind.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="px-8 py-3.5 rounded-full bg-[#1c1d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  <span>Explore the edit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/shop?category=linen-shirts"
                  className="px-8 py-3.5 rounded-full bg-white text-stone-900 border border-stone-300 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Shop Pure Linen
                </Link>
              </div>

              {/* Corporate Partner Callout */}
              <div className="pt-4 flex items-center gap-3 text-xs text-stone-500">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">S</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">T</div>
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">N</div>
                </div>
                <span>
                  Corporate employee? Use coupon code <strong className="text-stone-900 font-mono">STELLAR50</strong> in cart for partner benefits.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80"
                  alt="Coastal Blue Cotton Shirt"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200/80 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#ab8d6c] tracking-wider">
                        Featured Piece
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-900">
                        Coastal Blue Cotton Shirt
                      </h4>
                      <p className="text-xs text-stone-500">100% Giza Long-Staple Cotton</p>
                    </div>
                    <span className="text-sm font-bold text-stone-900">₹1,499</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              Built around how you live
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Selected natural fabrics engineered for breathability, lightweight travel, and enduring comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Card 1 */}
            <Link
              href="/shop?category=cotton-shirts"
              className="group relative rounded-2xl overflow-hidden bg-[#e4dcce] aspect-[16/10] flex items-end p-8 border border-stone-200 hover:shadow-xl transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
                alt="Cotton, in its element"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d3c4ad]">
                  Everyday Essential
                </span>
                <h3 className="font-serif text-2xl font-bold">Cotton, in its element</h3>
                <p className="text-xs text-stone-300">Light. Reliable. Always ready.</p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-white underline decoration-dotted">
                  <span>Shop cotton collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link
              href="/shop?category=linen-shirts"
              className="group relative rounded-2xl overflow-hidden bg-[#d3c4ad] aspect-[16/10] flex items-end p-8 border border-stone-200 hover:shadow-xl transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80"
                alt="Live easy in linen"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d3c4ad]">
                  Natural Comfort
                </span>
                <h3 className="font-serif text-2xl font-bold">Live easy in linen</h3>
                <p className="text-xs text-stone-300">French Flax & pure breathable weaves.</p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-white underline decoration-dotted">
                  <span>Shop linen collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white border-y border-stone-200/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#ab8d6c]">
                  Curated Catalog
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  The shirts going places
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-stone-700 hover:text-black mt-2 sm:mt-0 flex items-center gap-1 underline decoration-dotted"
              >
                <span>View all pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="bg-stone-200 rounded-xl aspect-[3/4]" />
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(Array.isArray(products) ? products : []).slice(0, 4).map((product) => {
                  const images =
                    typeof product.images === 'string'
                      ? JSON.parse(product.images || '[]')
                      : product.images;
                  const mainImage = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500';

                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col bg-[#f9f8f6] rounded-xl overflow-hidden border border-stone-200/70 hover:shadow-lg transition-all"
                    >
                      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                        <img
                          src={mainImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-[#1c1d1f] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.badge}
                          </span>
                        )}
                      </Link>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] text-stone-500 uppercase tracking-wider">
                            {product.category?.name || 'Menswear'}
                          </span>
                          <Link href={`/product/${product.slug}`}>
                            <h3 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#ab8d6c] transition-colors line-clamp-1 mt-0.5">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-stone-500 mt-1">{product.color}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-stone-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                ₹{product.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => addToCart(product, 1, 'M')}
                            className="px-3 py-1.5 rounded-lg bg-[#1c1d1f] hover:bg-[#ab8d6c] text-white text-xs font-medium transition-colors shadow-sm"
                          >
                            Add to bag
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Corporate Partnership Banner (Explaining CouponForge integration) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-stone-700 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Enterprise Corporate Perks</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Corporate Benefits with CouponForge
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Partner companies like <strong>Stellar Solutions</strong> distribute exclusive promo codes to their employees. Redeem your company voucher directly at checkout on The Navigator.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-full bg-white text-stone-900 text-xs font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors"
                >
                  Shop with Corporate Code
                </Link>
                <Link
                  href="/admin/coupons"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-300/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Coupon Module</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
