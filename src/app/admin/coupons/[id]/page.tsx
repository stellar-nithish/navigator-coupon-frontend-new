'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Coupon } from '@/types';
import {
  ArrowLeft,
  Tag,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Edit,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function CouponDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadCoupon() {
    if (!id) return;
    try {
      const data = await fetchApi<any>(`/api/admin/coupons/${id}`);
      setCoupon(data);
    } catch (e) {
      console.error('Failed to load coupon details', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupon();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      await fetchApi(`/api/admin/coupons/${id}/toggle-status`, { method: 'PATCH' });
      loadCoupon();
    } catch (e) {
      console.error('Failed to toggle status', e);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete coupon ${coupon?.code}?`)) return;
    try {
      await fetchApi(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      router.push('/admin/coupons/all');
    } catch (e) {
      console.error('Failed to delete coupon', e);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-stone-500">Loading coupon record...</div>;
  }

  if (!coupon) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Coupon Not Found</h2>
        <Link href="/admin/coupons/all" className="text-xs text-amber-400 underline">
          Back to all coupons
        </Link>
      </div>
    );
  }

  const isExpired = new Date(coupon.expiresAt) < new Date();
  const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
  const usagePercentage = coupon.usageLimit
    ? Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100))
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/coupons/all"
        className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Coupons Registry</span>
      </Link>

      {/* Main Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl font-black text-amber-400 tracking-wider">
              {coupon.code}
            </span>
            {coupon.status === 'INACTIVE' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-800 text-stone-400 border border-stone-700">
                <XCircle className="w-3.5 h-3.5" />
                Inactive
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                <Clock className="w-3.5 h-3.5" />
                Expired
              </span>
            ) : isLimitReached ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                <AlertTriangle className="w-3.5 h-3.5" />
                Usage Limit Reached
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400">
            Corporate Partner:{' '}
            <Link
              href={`/admin/companies/${coupon.companyId}`}
              className="text-amber-400 hover:underline font-semibold"
            >
              {coupon.company?.name} ({coupon.company?.code})
            </Link>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStatus}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors border border-stone-700 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{coupon.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
          </button>
          <Link
            href={`/admin/coupons/${coupon.id}/edit`}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors border border-stone-700 flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold transition-colors border border-rose-800/40 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Metrics & Progress Gauge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Discount Benefit */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-stone-400">Discount Benefit</span>
          <div className="text-2xl font-bold text-emerald-400">
            {coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
          </div>
          <p className="text-[11px] text-stone-500">
            {coupon.minimumOrderAmount
              ? `Min order: ₹${coupon.minimumOrderAmount.toLocaleString('en-IN')}`
              : 'No minimum order'}
          </p>
        </div>

        {/* Metric 2: Usage / Limit */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400">Usage Progress</span>
            <span className="text-amber-400 font-mono font-bold">
              {coupon.usageCount} / {coupon.usageLimit || '∞'}
            </span>
          </div>
          {coupon.usageLimit && (
            <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          )}
          <p className="text-[11px] text-stone-500">
            {coupon.remainingUsage !== null
              ? `${coupon.remainingUsage} redemptions remaining`
              : 'Unlimited redemptions'}
          </p>
        </div>

        {/* Metric 3: Total Discount Given */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-stone-400">Total Discount Given</span>
          <div className="text-2xl font-bold text-amber-400">
            ₹{(coupon.totalDiscountGiven || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-500">Across all completed checkouts</p>
        </div>

        {/* Metric 4: Validity */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-stone-400">Validity Period</span>
          <div className="text-xs font-semibold text-white">
            {new Date(coupon.startsAt).toLocaleDateString()}
          </div>
          <div className="text-xs text-stone-400">
            to {new Date(coupon.expiresAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Rules and Eligibility Details */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Configured Eligibility & Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
          <div>
            <span className="text-stone-500 block mb-1 font-semibold">Scope of Eligibility</span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 font-medium inline-block">
              {coupon.eligibilityType === 'ALL'
                ? 'All Garments in Catalog'
                : coupon.eligibilityType === 'CATEGORY'
                ? `Specific Categories (${coupon.eligibleCategories?.length || 0})`
                : `Specific Products (${coupon.eligibleProducts?.length || 0})`}
            </span>
          </div>

          <div>
            <span className="text-stone-500 block mb-1 font-semibold">Max Discount Cap</span>
            <span className="text-stone-200 font-medium">
              {coupon.maximumDiscount ? `₹${coupon.maximumDiscount}` : 'No cap (Unlimited)'}
            </span>
          </div>

          <div>
            <span className="text-stone-500 block mb-1 font-semibold">Created Date</span>
            <span className="text-stone-200 font-medium">
              {new Date(coupon.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Redemption History Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-sky-400" />
          <span>Real-Time Redemption History ({coupon.usages?.length || 0} Records)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                <th className="pb-3">Order ID / Number</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3 text-right">Order Subtotal</th>
                <th className="pb-3 text-right">Discount Given</th>
                <th className="pb-3 text-right">Redemption Date</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {!coupon.usages?.length ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No orders have redeemed this coupon yet.
                  </td>
                </tr>
              ) : (
                coupon.usages.map((usage: any) => (
                  <tr key={usage.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 font-mono font-semibold text-white">
                      {usage.order?.orderNumber || usage.orderId}
                    </td>
                    <td className="py-3 text-stone-300">
                      {usage.customerEmail || usage.customer?.email || 'Guest Customer'}
                    </td>
                    <td className="py-3 text-right font-medium text-stone-200">
                      ₹{usage.orderAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      -₹{usage.discountAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right text-stone-400">
                      {new Date(usage.redeemedAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
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
      </div>
    </div>
  );
}
