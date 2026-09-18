'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Order } from '@/types';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Tag,
  Eye,
  X,
  User,
  MapPin,
  Calendar,
  Building2,
  Package,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

      {/* Desktop / Tablet Table View */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hidden sm:block shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-950/60 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Coupon</th>
                <th className="p-4 text-right">Subtotal</th>
                <th className="p-4 text-right">Discount</th>
                <th className="p-4 text-right">Total Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500">
                    <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading orders...</div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500">
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
                      {order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items?.length || 0} pieces
                    </td>
                    <td className="p-4">
                      {order.couponCode ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
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
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-stone-700/80 transition-all font-semibold active:scale-95 cursor-pointer shadow-xs"
                        title="View order product details"
                        aria-label="View order details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Phone Card View */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
            <div>Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            No orders placed yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono font-bold text-white text-xs">
                    {order.orderNumber}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <CheckCircle2 className="w-3 h-3" />
                  {order.status}
                </span>
              </div>

              <div className="border-t border-stone-800/80 pt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Customer:</span>
                  <span className="text-white font-medium">{order.shippingName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Items:</span>
                  <span className="text-stone-300">
                    {order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items?.length || 0} pieces
                  </span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Coupon:</span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 text-[11px]">
                      <Tag className="w-3 h-3" />
                      {order.couponCode} (-₹{order.discountAmount})
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-stone-800/60">
                  <span className="text-stone-400 font-semibold">Total Paid:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="w-full py-2 bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-stone-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Product Details</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Order Product Details Modal Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <h2 className="font-serif text-xl font-bold text-white">Order Details</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 ml-2">
                    <CheckCircle2 className="w-3 h-3" />
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                  <span className="font-mono font-bold text-amber-400">
                    {selectedOrder.orderNumber}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-500" />
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-400" />
                  Customer
                </span>
                <p className="font-semibold text-white">{selectedOrder.shippingName}</p>
                <p className="text-stone-400 font-mono text-[11px]">{selectedOrder.customerEmail}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Delivery Address
                </span>
                <p className="text-stone-300 leading-snug">{selectedOrder.shippingAddress}</p>
                <p className="text-stone-400">
                  {selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}, {selectedOrder.shippingCountry}
                </p>
              </div>
            </div>

            {/* Corporate Coupon Details (if applied) */}
            {selectedOrder.couponCode && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">
                        {selectedOrder.couponCode}
                      </span>
                      {selectedOrder.couponUsage?.company && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 flex items-center gap-1 border border-stone-700">
                          <Building2 className="w-3 h-3 text-amber-400" />
                          {selectedOrder.couponUsage.company.name}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Applied via CouponForge Corporate Engine
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold text-sm">
                    -₹{selectedOrder.discountAmount.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Discount</div>
                </div>
              </div>
            )}

            {/* Products Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Purchased Products ({selectedOrder.items?.length || 0} line items)</span>
              </h3>

              <div className="border border-stone-800 rounded-xl overflow-hidden divide-y divide-stone-800 bg-stone-950/50">
                {selectedOrder.items?.map((item) => {
                  const rawImages = item.product?.images;
                  const images = Array.isArray(rawImages)
                    ? rawImages
                    : typeof rawImages === 'string'
                    ? JSON.parse(rawImages || '[]')
                    : [];
                  const mainImage =
                    images[0] ||
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mainImage}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded-lg bg-stone-800 border border-stone-700 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-white text-xs leading-snug">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold text-[10px] border border-stone-700">
                              Size: {item.size || 'M'}
                            </span>
                            {item.product?.fabric && (
                              <span className="text-[11px] text-stone-400">
                                • {item.product.fabric}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-stone-400">
                          ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                        </div>
                        <div className="font-bold text-white text-xs mt-0.5">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-stone-200">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Corporate Discount ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-white">
                <span>Total Paid</span>
                <span className="text-amber-400 text-base">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

