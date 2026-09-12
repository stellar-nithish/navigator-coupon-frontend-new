'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  Compass,
  Tag,
  Building2,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi<any>('/api/admin/coupons/analytics');
        setStats(data);
      } catch (e) {
        console.error('Failed to load dashboard stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-8 border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Navigator Store Management</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Welcome to Navigator Admin
          </h1>
          <p className="text-xs text-stone-400 max-w-xl">
            Centralized control for garments catalog, orders, and the integrated <strong>CouponForge Corporate Benefits</strong> module.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/coupons"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Open CouponForge</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium transition-colors border border-stone-700"
          >
            Visit Store
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Corporate Partners</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalCompanies || 0}
          </div>
          <p className="text-[11px] text-stone-500">Active corporate partnerships</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Active Coupons</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {loading ? '...' : stats?.summary?.activeCoupons || 0}
          </div>
          <p className="text-[11px] text-stone-500">
            Out of {stats?.summary?.totalCoupons || 0} total codes
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Total Redemptions</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : stats?.summary?.totalRedemptions || 0}
          </div>
          <p className="text-[11px] text-stone-500">Completed checkout orders</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Corporate Savings Given</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            ₹{loading ? '...' : (stats?.summary?.totalDiscountGiven || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">Distributed employee discounts</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/coupons"
          className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-400/50 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">
            CouponForge Business Module
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Manage corporate companies, generate promo vouchers (percentage / fixed ₹), configure order eligibility, and monitor transactional usage limits.
          </p>
        </Link>

        <Link
          href="/admin/companies"
          className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-400/50 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">
            Corporate Partners Directory
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            View registered organizations (e.g. Stellar Solutions, TechCorp), adjust active statuses, and inspect company redemption analytics.
          </p>
        </Link>
      </div>
    </div>
  );
}
