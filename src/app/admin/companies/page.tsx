'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Company } from '@/types';
import {
  Building2,
  PlusCircle,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  X,
  Tag,
  ShoppingBag,
} from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
  });

  async function loadCompanies() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('limit', '50');

      const data = await fetchApi<{ items: Company[] }>(
        `/api/admin/companies?${params.toString()}`,
      );
      setCompanies(data.items);
    } catch (e) {
      console.error('Failed to load companies', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, [search, statusFilter]);

  const handleToggleStatus = async (id: string) => {
    try {
      await fetchApi(`/api/admin/companies/${id}/toggle-status`, { method: 'PATCH' });
      loadCompanies();
    } catch (e) {
      console.error('Failed to toggle company status', e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete company ${name}? All associated coupons will also be deleted.`))
      return;
    try {
      await fetchApi(`/api/admin/companies/${id}`, { method: 'DELETE' });
      loadCompanies();
    } catch (e) {
      console.error('Failed to delete company', e);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalError(null);

    try {
      await fetchApi('/api/admin/companies', {
        method: 'POST',
        body: JSON.stringify({
          name: newCompany.name,
          code: newCompany.code.trim().toUpperCase(),
          contactPerson: newCompany.contactPerson || undefined,
          email: newCompany.email || undefined,
          phone: newCompany.phone || undefined,
          status: newCompany.status,
        }),
      });

      setIsModalOpen(false);
      setNewCompany({
        name: '',
        code: '',
        contactPerson: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
      });
      loadCompanies();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create company');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Corporate Partners Registry</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage corporate organizations authorized to distribute The Navigator promotional coupon codes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Corporate Company</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company by name, code, contact or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Desktop / Tablet Companies Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hidden sm:block shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-950/60 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Company Name</th>
                <th className="p-4">Corporate Code</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Coupons</th>
                <th className="p-4 text-right">Redemptions</th>
                <th className="p-4 text-right">Savings Distributed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading corporate registry...</div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No companies found. Add one using the button above.
                  </td>
                </tr>
              ) : (
                companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <Link href={`/admin/companies/${comp.id}`} className="hover:text-amber-400">
                        {comp.name}
                      </Link>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-400">{comp.code}</td>
                    <td className="p-4 text-stone-300">
                      <div>{comp.contactPerson || '—'}</div>
                      <div className="text-[10px] text-stone-500">{comp.email}</div>
                    </td>
                    <td className="p-4 text-stone-300">
                      <span className="font-semibold text-white">{comp.totalCoupons || 0}</span>
                      <span className="text-stone-500 text-[10px] ml-1">
                        ({comp.activeCoupons || 0} active)
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-stone-200">
                      {comp.totalRedemptions || 0}
                    </td>
                    <td className="p-4 text-right font-semibold text-amber-400">
                      ₹{(comp.totalDiscountGiven || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      {comp.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-400 border border-stone-700">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(comp.id)}
                          className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                          title={comp.status === 'ACTIVE' ? 'Deactivate company' : 'Activate company'}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              comp.status === 'ACTIVE' ? 'text-emerald-400' : 'text-stone-600'
                            }`}
                          />
                        </button>
                        <Link
                          href={`/admin/companies/${comp.id}`}
                          className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                          title="View company profile and coupon list"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(comp.id, comp.name)}
                          className="p-1.5 rounded-md hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 transition-colors"
                          title="Delete company"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Phone Company Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
            <div>Loading companies...</div>
          </div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            No companies found.
          </div>
        ) : (
          companies.map((comp) => (
            <div
              key={comp.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/admin/companies/${comp.id}`}
                    className="font-bold text-white text-sm hover:text-amber-400"
                  >
                    {comp.name}
                  </Link>
                  <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                    {comp.code}
                  </div>
                </div>

                {comp.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-400 border border-stone-700">
                    Inactive
                  </span>
                )}
              </div>

              <div className="border-t border-stone-800/80 pt-2 space-y-1.5 text-xs">
                {comp.contactPerson && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Contact:</span>
                    <span className="text-stone-300">{comp.contactPerson}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-400">Coupons:</span>
                  <span className="text-stone-200">
                    {comp.totalCoupons || 0} ({comp.activeCoupons || 0} active)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Redemptions:</span>
                  <span className="text-stone-200 font-medium">{comp.totalRedemptions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Savings:</span>
                  <span className="font-bold text-amber-400">
                    ₹{(comp.totalDiscountGiven || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-800/80 pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleToggleStatus(comp.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      comp.status === 'ACTIVE' ? 'text-emerald-400' : 'text-stone-500'
                    }`}
                  />
                  <span>{comp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
                </button>
                <Link
                  href={`/admin/companies/${comp.id}`}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="View Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(comp.id, comp.name)}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-rose-950/60 text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Company */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Add Corporate Partner</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stellar Solutions"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Company Code * (e.g. STELLAR)
                </label>
                <input
                  type="text"
                  required
                  placeholder="STELLAR"
                  value={newCompany.code}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg font-mono font-bold text-amber-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Mehta"
                  value={newCompany.contactPerson}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, contactPerson: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Corporate Email</label>
                <input
                  type="email"
                  placeholder="perks@stellarsolutions.example"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center gap-1.5"
                >
                  {modalSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Company</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
