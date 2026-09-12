'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Building2,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CouponAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi<any>('/api/admin/coupons/analytics');
        setStats(data);
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Performance & Financial Impact</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Coupon & Corporate Analytics</h1>
        <p className="text-xs text-stone-400 mt-1">
          Financial savings breakdown, corporate partnership ROI, and redemption conversion metrics.
        </p>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-stone-400">Total Order Volume via Coupons</span>
          <div className="text-2xl font-bold text-white">
            ₹{loading ? '...' : (stats?.summary?.totalOrderVolume || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">Gross order revenue from promo checkouts</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-purple-400">Total Corporate Discount Given</span>
          <div className="text-2xl font-bold text-amber-400">
            ₹{loading ? '...' : (stats?.summary?.totalDiscountGiven || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">Total savings delivered to customers</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-sky-400">Total Completed Redemptions</span>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalRedemptions || 0}
          </div>
          <p className="text-[11px] text-stone-500">Successful checkout redemptions</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-emerald-400">Avg. Discount Per Order</span>
          <div className="text-2xl font-bold text-emerald-400">
            ₹{loading ? '...' : (stats?.summary?.avgDiscountPerOrder || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">Average savings per promo order</p>
        </div>
      </div>

      {/* Corporate Partner Breakdown Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Partner Company Performance Breakdown</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                <th className="pb-3">Company Name</th>
                <th className="pb-3">Code</th>
                <th className="pb-3 text-right">Total Coupons</th>
                <th className="pb-3 text-right">Completed Redemptions</th>
                <th className="pb-3 text-right">Total Savings Distributed</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    Loading analytics data...
                  </td>
                </tr>
              ) : !stats?.topCompanies?.length ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No corporate activity recorded yet.
                  </td>
                </tr>
              ) : (
                stats.topCompanies.map((comp: any) => (
                  <tr key={comp.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 font-bold text-white">{comp.name}</td>
                    <td className="py-3 font-mono text-amber-400 font-semibold">{comp.code}</td>
                    <td className="py-3 text-right font-medium text-stone-300">
                      {comp.totalCoupons}
                    </td>
                    <td className="py-3 text-right font-medium text-stone-200">
                      {comp.totalRedemptions}
                    </td>
                    <td className="py-3 text-right font-bold text-amber-400">
                      ₹{comp.totalDiscountGiven.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/companies/${comp.id}`}
                        className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                      >
                        Details
                      </Link>
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
