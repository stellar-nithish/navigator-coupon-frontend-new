'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  Compass,
  Building2,
  Tag,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function CouponDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi<any>('/api/admin/coupons/analytics');
        setStats(data);
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>CouponForge Domain</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Coupon Management Dashboard</h1>
          <p className="text-xs text-stone-400 mt-1">
            Overview of corporate discount codes, active campaigns, and real-time checkout redemptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/companies"
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-medium border border-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Companies</span>
          </Link>
          <Link
            href="/admin/coupons/new"
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Coupon</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-stone-400">Total Companies</span>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalCompanies || 0}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-stone-400">Total Coupons</span>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalCoupons || 0}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-emerald-400">Active Coupons</span>
          <div className="text-2xl font-bold text-emerald-400">
            {loading ? '...' : stats?.summary?.activeCoupons || 0}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-rose-400">Expired Coupons</span>
          <div className="text-2xl font-bold text-rose-400">
            {loading ? '...' : stats?.summary?.expiredCoupons || 0}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-sky-400">Total Redemptions</span>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalRedemptions || 0}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-medium text-purple-400">Total Discount Given</span>
          <div className="text-2xl font-bold text-amber-400">
            ₹{loading ? '...' : (stats?.summary?.totalDiscountGiven || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Top Tables Grid: Top Companies & Top Coupons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Corporate Partners */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Top Corporate Partners</span>
            </h3>
            <Link
              href="/admin/companies"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Code</th>
                  <th className="pb-3">Coupons</th>
                  <th className="pb-3 text-right">Redemptions</th>
                  <th className="pb-3 text-right">Total Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-500">
                      Loading partners...
                    </td>
                  </tr>
                ) : !stats?.topCompanies?.length ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-500">
                      No corporate data recorded.
                    </td>
                  </tr>
                ) : (
                  stats.topCompanies.map((comp: any) => (
                    <tr key={comp.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        <Link href={`/admin/companies/${comp.id}`} className="hover:text-amber-400">
                          {comp.name}
                        </Link>
                      </td>
                      <td className="py-3 font-mono text-stone-300">{comp.code}</td>
                      <td className="py-3 text-stone-400">{comp.totalCoupons}</td>
                      <td className="py-3 text-right font-medium text-stone-200">
                        {comp.totalRedemptions}
                      </td>
                      <td className="py-3 text-right font-semibold text-amber-400">
                        ₹{comp.totalDiscountGiven.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Coupons */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Top Active Coupons</span>
            </h3>
            <Link
              href="/admin/coupons/all"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                  <th className="pb-3">Coupon Code</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Benefit</th>
                  <th className="pb-3 text-right">Usage / Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-500">
                      Loading coupons...
                    </td>
                  </tr>
                ) : !stats?.topCoupons?.length ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-500">
                      No coupon data recorded.
                    </td>
                  </tr>
                ) : (
                  stats.topCoupons.map((c: any) => (
                    <tr key={c.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3">
                        <Link
                          href={`/admin/coupons/${c.id}`}
                          className="font-mono font-bold text-amber-400 hover:underline"
                        >
                          {c.code}
                        </Link>
                      </td>
                      <td className="py-3 text-stone-300">{c.companyName}</td>
                      <td className="py-3 text-emerald-400 font-medium">
                        {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </td>
                      <td className="py-3 text-right font-medium text-stone-200">
                        {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : '(Unlimited)'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Redemptions Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span>Recent Corporate Redemptions</span>
          </h3>
          <Link
            href="/admin/coupons/usage"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Full audit log</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Customer Email</th>
                <th className="pb-3">Coupon Code</th>
                <th className="pb-3">Partner Company</th>
                <th className="pb-3 text-right">Order Subtotal</th>
                <th className="pb-3 text-right">Discount Applied</th>
                <th className="pb-3 text-right">Redeemed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    Loading redemption events...
                  </td>
                </tr>
              ) : !stats?.recentRedemptions?.length ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No orders have redeemed coupons yet. Test by placing an order on The Navigator storefront!
                  </td>
                </tr>
              ) : (
                stats.recentRedemptions.map((usage: any) => (
                  <tr key={usage.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 font-mono font-semibold text-white">
                      {usage.order?.orderNumber || usage.orderId}
                    </td>
                    <td className="py-3 text-stone-300">{usage.customerEmail || 'Guest'}</td>
                    <td className="py-3 font-mono font-bold text-amber-400">
                      {usage.coupon?.code}
                    </td>
                    <td className="py-3 text-stone-300">{usage.company?.name}</td>
                    <td className="py-3 text-right font-medium text-stone-200">
                      ₹{usage.orderAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      -₹{usage.discountAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right text-stone-400">
                      {new Date(usage.redeemedAt).toLocaleDateString()} {new Date(usage.redeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
