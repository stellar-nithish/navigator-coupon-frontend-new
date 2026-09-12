'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { CouponUsage } from '@/types';
import { History, Search, Download, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function RedemptionsLogPage() {
  const [usages, setUsages] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadUsages() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '20');

      const data = await fetchApi<{ items: CouponUsage[]; pagination: any }>(
        `/api/admin/coupon-usage?${params.toString()}`,
      );
      setUsages(data.items);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (e) {
      console.error('Failed to load usages', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsages();
  }, [search, page]);

  const exportCSV = () => {
    if (usages.length === 0) return;
    const headers = ['Order Number', 'Customer Email', 'Coupon Code', 'Company', 'Subtotal', 'Discount', 'Redeemed At'];
    const rows = usages.map((u) => [
      u.order?.orderNumber || u.orderId,
      u.customerEmail || 'Guest',
      u.coupon?.code || '',
      u.company?.name || '',
      u.orderAmount,
      u.discountAmount,
      new Date(u.redeemedAt).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `navigator_coupon_redemptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Coupon Redemptions Audit Log</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Immutable transaction records of all promotional coupons redeemed during order checkout.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={usages.length === 0}
          className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white text-xs font-semibold border border-stone-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number, customer email, coupon code, or partner company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Usages Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-900/80 font-semibold">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Partner Company</th>
                <th className="p-4 text-right">Order Subtotal</th>
                <th className="p-4 text-right">Discount Given</th>
                <th className="p-4 text-right">Redeemed At</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    Loading redemption audit logs...
                  </td>
                </tr>
              ) : usages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No redemption records found.
                  </td>
                </tr>
              ) : (
                usages.map((usage) => (
                  <tr key={usage.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {usage.order?.orderNumber || usage.orderId}
                    </td>
                    <td className="p-4 text-stone-300">
                      {usage.customerEmail || 'Guest Customer'}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/coupons/${usage.couponId}`}
                        className="font-mono font-bold text-amber-400 hover:underline"
                      >
                        {usage.coupon?.code}
                      </Link>
                    </td>
                    <td className="p-4 text-stone-300">
                      <Link
                        href={`/admin/companies/${usage.companyId}`}
                        className="hover:text-white"
                      >
                        {usage.company?.name}
                      </Link>
                    </td>
                    <td className="p-4 text-right font-medium text-stone-200">
                      ₹{usage.orderAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400">
                      -₹{usage.discountAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right text-stone-400 text-[11px]">
                      {new Date(usage.redeemedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" />
                        Redeemed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-white"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
