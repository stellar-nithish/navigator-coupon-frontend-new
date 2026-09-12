'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Coupon, Company } from '@/types';
import {
  Tag,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export default function AllCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadCoupons() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (companyFilter) params.set('companyId', companyFilter);
      params.set('page', String(page));
      params.set('limit', '15');

      const data = await fetchApi<{ items: Coupon[]; pagination: any }>(
        `/api/admin/coupons?${params.toString()}`,
      );
      setCoupons(data.items);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (e) {
      console.error('Failed to load coupons', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await fetchApi<{ items: Company[] }>('/api/admin/companies?limit=100');
        setCompanies(data.items);
      } catch (e) {
        console.error('Failed to load companies', e);
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [search, statusFilter, typeFilter, companyFilter, page]);

  const handleToggleStatus = async (id: string) => {
    try {
      await fetchApi(`/api/admin/coupons/${id}/toggle-status`, { method: 'PATCH' });
      loadCoupons();
    } catch (e) {
      console.error('Failed to toggle coupon status', e);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      await fetchApi(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch (e) {
      console.error('Failed to delete coupon', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>All Corporate Coupons</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Search, filter, toggle active state, and manage coupon restrictions.
          </p>
        </div>

        <Link
          href="/admin/coupons/new"
          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Coupon</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Company filter */}
        <select
          value={companyFilter}
          onChange={(e) => {
            setCompanyFilter(e.target.value);
            setPage(1);
          }}
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="EXPIRED">Expired</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Types</option>
          <option value="FIXED">Fixed Amount (₹)</option>
          <option value="PERCENTAGE">Percentage (%)</option>
        </select>
      </div>

      {/* Coupons Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-900/80 font-semibold">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Partner Company</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Order Criteria</th>
                <th className="p-4">Usage / Limit</th>
                <th className="p-4">Validity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    Loading coupon registry...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No coupons matched your query.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiresAt) < new Date();
                  const isLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">
                        <Link href={`/admin/coupons/${coupon.id}`} className="hover:underline">
                          {coupon.code}
                        </Link>
                      </td>
                      <td className="p-4 text-white font-medium">
                        {coupon.company?.name || 'Unknown'}
                        <span className="block text-[10px] font-mono text-stone-500">
                          {coupon.company?.code}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-400">
                        {coupon.type === 'PERCENTAGE'
                          ? `${coupon.value}% OFF`
                          : `₹${coupon.value} OFF`}
                        {coupon.maximumDiscount && (
                          <span className="block text-[10px] text-stone-400 font-normal">
                            Max: ₹{coupon.maximumDiscount}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-stone-300">
                        {coupon.minimumOrderAmount
                          ? `Min: ₹${coupon.minimumOrderAmount.toLocaleString('en-IN')}`
                          : 'No minimum'}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-stone-200">
                          {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '(Unlimited)'}
                        </div>
                        {coupon.remainingUsage !== null && coupon.remainingUsage !== undefined && (
                          <span className="text-[10px] text-stone-500">
                            {coupon.remainingUsage} remaining
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-stone-400 text-[11px]">
                        <div>{new Date(coupon.startsAt).toLocaleDateString()}</div>
                        <div className="text-stone-500">to {new Date(coupon.expiresAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        {coupon.status === 'INACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-400 border border-stone-700">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                            <Clock className="w-3 h-3" />
                            Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                            <AlertTriangle className="w-3 h-3" />
                            Limit Met
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(coupon.id)}
                            className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                            title={coupon.status === 'ACTIVE' ? 'Deactivate coupon' : 'Activate coupon'}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                coupon.status === 'ACTIVE' ? 'text-emerald-400' : 'text-stone-600'
                              }`}
                            />
                          </button>
                          <Link
                            href={`/admin/coupons/${coupon.id}`}
                            className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                            title="View coupon details & redemption history"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/coupons/${coupon.id}/edit`}
                            className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                            title="Edit coupon"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-1.5 rounded-md hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
