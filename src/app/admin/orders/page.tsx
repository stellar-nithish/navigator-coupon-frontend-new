'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Search, CheckCircle2, Tag } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const data = await fetchApi<{ items: Order[] }>(`/api/admin/orders?${params.toString()}`);
      setOrders(data.items);
    } catch (e) {
      console.error('Failed to load admin orders', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Store Orders</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Overview of customer purchases, applied corporate coupons, and fulfillment status.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number, customer name, email, or coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-900/80 font-semibold">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Coupon</th>
                <th className="p-4 text-right">Subtotal</th>
                <th className="p-4 text-right">Discount</th>
                <th className="p-4 text-right">Total Paid</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="p-4 text-stone-300">
                      <div className="font-semibold text-white">{order.shippingName}</div>
                      <div className="text-[11px] text-stone-500">{order.customerEmail}</div>
                    </td>
                    <td className="p-4 text-stone-300">
                      {order.items?.length || 0} pieces
                    </td>
                    <td className="p-4">
                      {order.couponCode ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400">
                          <Tag className="w-3 h-3 text-amber-400" />
                          {order.couponCode}
                        </span>
                      ) : (
                        <span className="text-stone-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-medium text-stone-300">
                      ₹{order.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400">
                      {order.discountAmount > 0
                        ? `-₹${order.discountAmount.toLocaleString('en-IN')}`
                        : '—'}
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
