'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import {
  ArrowLeft,
  Building2,
  Tag,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  User,
} from 'lucide-react';

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadCompany() {
    if (!id) return;
    try {
      const data = await fetchApi<any>(`/api/admin/companies/${id}`);
      setCompany(data);
    } catch (e) {
      console.error('Failed to load company details', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompany();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-stone-500">Loading company profile...</div>;
  }

  if (!company) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Company Not Found</h2>
        <Link href="/admin/companies" className="text-xs text-amber-400 underline">
          Back to companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Companies Directory</span>
      </Link>

      {/* Main Profile Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-white">{company.name}</h1>
            <span className="font-mono px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold">
              {company.code}
            </span>
            {company.status === 'ACTIVE' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3" />
                Active Partner
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-800 text-stone-400 border border-stone-700">
                <XCircle className="w-3 h-3" />
                Inactive
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            {company.contactPerson && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{company.contactPerson}</span>
              </div>
            )}
            {company.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{company.email}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{company.phone}</span>
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/admin/coupons/new?companyId=${company.id}`}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Issue Coupon for {company.code}</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-stone-400">Total Issued Coupons</span>
          <div className="text-2xl font-bold text-white">{company.totalCoupons}</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-emerald-400">Active Coupons</span>
          <div className="text-2xl font-bold text-emerald-400">{company.activeCoupons}</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-sky-400">Total Redemptions</span>
          <div className="text-2xl font-bold text-white">{company.totalRedemptions}</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-1">
          <span className="text-xs text-purple-400">Total Employee Savings</span>
          <div className="text-2xl font-bold text-amber-400">
            ₹{(company.totalDiscountGiven || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Coupons List for this Company */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Assigned Promotional Coupons ({company.coupons?.length || 0})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-semibold">
                <th className="pb-3">Coupon Code</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Minimum Order</th>
                <th className="pb-3">Usage / Limit</th>
                <th className="pb-3">Validity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {!company.coupons?.length ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No coupons have been created for {company.name} yet.
                  </td>
                </tr>
              ) : (
                company.coupons.map((c: any) => {
                  const isExpired = new Date(c.expiresAt) < new Date();
                  const isLimitReached = c.usageLimit && c.usageCount >= c.usageLimit;

                  return (
                    <tr key={c.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400">
                        <Link href={`/admin/coupons/${c.id}`} className="hover:underline">
                          {c.code}
                        </Link>
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </td>
                      <td className="py-3 text-stone-300">
                        {c.minimumOrderAmount
                          ? `₹${c.minimumOrderAmount.toLocaleString('en-IN')}`
                          : 'None'}
                      </td>
                      <td className="py-3 text-stone-200">
                        {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : '(Unlimited)'}
                      </td>
                      <td className="py-3 text-stone-400 text-[11px]">
                        {new Date(c.startsAt).toLocaleDateString()} to{' '}
                        {new Date(c.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {c.status === 'INACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-400 border border-stone-700">
                            Inactive
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                            Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                            Limit Met
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/coupons/${c.id}`}
                          className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
