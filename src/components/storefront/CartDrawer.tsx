'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CouponBox from './CouponBox';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, AlertCircle } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    finalTotal,
    appliedCoupon,
  } = useCart();

  const [stockWarning, setStockWarning] = useState<string | null>(null);

  const handleQtyChange = (productId: string, newQty: number, size = 'M') => {
    const res = updateQuantity(productId, newQty, size);
    if (res && !res.success) {
      setStockWarning(res.message || 'Cannot add more units than available stock.');
      setTimeout(() => setStockWarning(null), 3500);
    } else {
      setStockWarning(null);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f9f8f6] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-lg font-bold text-stone-900">Your Bag</h2>
              <span className="text-xs text-stone-500 font-sans">
                ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stock Warning Notice in Drawer */}
          {stockWarning && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-900 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium text-[11px]">{stockWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setStockWarning(null)}
                className="text-rose-400 hover:text-rose-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  Explore our collection of breathable cotton and linen shirts made for the road.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1c1d1f] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <>
                {/* Cart items list */}
                <div className="divide-y divide-stone-200/80">
                  {cart.map((item) => {
                    const images =
                      typeof item.product.images === 'string'
                        ? JSON.parse(item.product.images || '[]')
                        : item.product.images;
                    const mainImage = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

                    return (
                      <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4">
                        <img
                          src={mainImage}
                          alt={item.product.title}
                          className="w-20 h-24 object-cover rounded-lg bg-stone-200 shrink-0 border border-stone-200/60"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-semibold text-stone-900 leading-snug">
                                {item.product.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.product.id, item.size)}
                                className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                              <span>Size: {item.size}</span>
                              {item.product.fabric && <span>• {item.product.fabric}</span>}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                              <button
                                onClick={() => handleQtyChange(item.product.id, item.quantity - 1, item.size)}
                                className="p-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-medium text-stone-800 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.product.id, item.quantity + 1, item.size)}
                                className="p-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs font-semibold text-stone-900">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Coupon Box */}
                <div className="pt-2">
                  <CouponBox compact />
                </div>
              </>
            )}
          </div>

          {/* Footer / Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <span>Discount ({appliedCoupon.code})</span>
                    </span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total</span>
                  <span className="text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 bg-[#1c1d1f] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
