'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { fetchApi } from '@/lib/api';
import { Order } from '@/types';
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Tag, ExternalLink } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const data = await fetchApi<Order>(`/api/orders/${id}`);
        setOrder(data);
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
          Loading order details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Header />
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border text-center">
          <h2 className="font-serif text-xl font-bold mb-2">Order Not Found</h2>
          <Link href="/shop" className="text-xs text-[#ab8d6c] font-bold underline">
            Back to Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f6]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-bold tracking-wider text-[#ab8d6c]">
            Order Confirmed & Payment Received
          </span>

          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Thank you, {order.shippingName}!
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Your order <strong className="font-mono text-stone-900">{order.orderNumber}</strong> has been successfully placed and routed to dispatch.
          </p>

          {/* Coupon Redemption Highlights */}
          {order.couponCode && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Coupon Redeemed: {order.couponCode}
                  </h4>
                  <span className="text-xs font-bold text-emerald-800">
                    -₹{order.discountAmount.toLocaleString('en-IN')} Saved
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  {order.couponUsage?.company?.name
                    ? `Corporate benefit applied via partner: ${order.couponUsage.company.name}`
                    : 'Coupon discount applied successfully.'}
                </p>
                <div className="mt-2 text-[11px] text-emerald-600 font-mono">
                  Usage recorded inside Navigator Backend with transaction ID: {order.id.slice(0, 8)}...
                </div>
              </div>
            </div>
          )}

          {/* Order Details Breakdown */}
          <div className="pt-6 border-t border-stone-100 text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Garments in this Order
            </h3>

            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-stone-900">{item.title}</span>
                    <span className="text-stone-500 ml-2">
                      (Size: {item.size || 'M'} • Qty: {item.quantity})
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Corporate Discount</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                <span>Total Paid</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-[#1c1d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-md"
            >
              Continue Shopping
            </Link>
            <Link
              href="/admin/coupons"
              className="px-6 py-3 rounded-full bg-white text-stone-900 border border-stone-300 text-xs font-semibold hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#ab8d6c]" />
              <span>Inspect in Admin Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
