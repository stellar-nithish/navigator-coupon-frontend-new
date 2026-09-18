'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import CouponBox from '@/components/storefront/CouponBox';
import { fetchApi } from '@/lib/api';
import { Order } from '@/types';
import { ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, finalTotal, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerEmail: 'vikram.singh@stellarsolutions.example',
    shippingName: 'Vikram Singh',
    shippingAddress: 'Flat 402, Embassy Residency, Indiranagar',
    shippingCity: 'Bengaluru',
    shippingPostalCode: '560038',
    shippingCountry: 'India',
  });

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    setSubmitting(true);
    setOrderError(null);

    try {
      const payload = {
        customerEmail: formData.customerEmail,
        shippingName: formData.shippingName,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingPostalCode: formData.shippingPostalCode,
        shippingCountry: formData.shippingCountry,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size,
        })),
      };

      const order = await fetchApi<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsSuccess(true);
      clearCart();
      router.replace(`/order-success/${order.orderNumber}`);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please check coupon and item details.');
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Header />
        <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-2xl border border-stone-200 text-center shadow-sm space-y-3">
          <Loader2 className="w-8 h-8 text-[#ab8d6c] animate-spin mx-auto" />
          <h2 className="font-serif text-lg font-bold text-stone-900">Confirming Your Order...</h2>
          <p className="text-xs text-stone-500">Redirecting to order confirmation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0 && !submitting) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Header />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border text-center">
          <p className="text-sm text-stone-600 mb-4">Your bag is empty.</p>
          <Link href="/shop" className="px-6 py-2 bg-[#1c1d1f] text-white rounded-full text-xs font-bold">
            Explore Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">Checkout & Shipping</h1>

        {orderError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {orderError}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-200">
              Delivery Address
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Email Address (for order tracking & coupon receipt)
                </label>
                <input
                  type="email"
                  required
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ab8d6c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  name="shippingName"
                  value={formData.shippingName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ab8d6c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ab8d6c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ab8d6c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1.5">PIN Code</label>
                  <input
                    type="text"
                    required
                    name="shippingPostalCode"
                    value={formData.shippingPostalCode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ab8d6c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-300 rounded-lg text-stone-600 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center gap-2 text-xs text-stone-500">
              <Lock className="w-4 h-4 text-[#ab8d6c]" />
              <span>All order and corporate coupon transactions are secured with end-to-end encryption.</span>
            </div>
          </div>

          {/* Right: Order Summary & Coupon Box */}
          <div className="lg:col-span-5 space-y-6">
            <CouponBox />

            {/* Order Review */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-200">
                Order Review ({cart.length} pieces)
              </h3>

              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 text-xs">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="py-2.5 flex justify-between">
                    <div>
                      <span className="font-semibold text-stone-900">{item.product.title}</span>
                      <div className="text-[11px] text-stone-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium bg-emerald-50/80 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Corporate Coupon ({appliedCoupon.code})</span>
                    </span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>Final Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#1c1d1f] hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all mt-4"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Transaction & Redeeming...</span>
                  </>
                ) : (
                  <span>Confirm Order & Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
