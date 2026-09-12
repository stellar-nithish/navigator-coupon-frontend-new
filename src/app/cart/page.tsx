'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import CouponBox from '@/components/storefront/CouponBox';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    finalTotal,
    appliedCoupon,
  } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Looks like you haven&apos;t added any shirts to your bag yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex px-8 py-3 rounded-full bg-[#1c1d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-md"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items Table/List */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm divide-y divide-stone-200">
              {cart.map((item) => {
                const images =
                  typeof item.product.images === 'string'
                    ? JSON.parse(item.product.images || '[]')
                    : item.product.images;
                const mainImage = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

                return (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={mainImage}
                        alt={item.product.title}
                        className="w-20 h-24 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                          {item.product.category?.name || 'Menswear'}
                        </span>
                        <h3 className="font-serif text-sm font-bold text-stone-900 mt-0.5">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Size: <strong className="text-stone-800">{item.size}</strong> • {item.product.fabric}
                        </p>
                        <p className="text-xs font-bold text-stone-900 mt-2 sm:hidden">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 mt-2 sm:mt-0">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-stone-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="p-2 text-stone-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Coupon Module */}
            <div className="lg:col-span-4 space-y-6">
              {/* Interactive Coupon Box */}
              <CouponBox />

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#1c1d1f] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all mt-4"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
