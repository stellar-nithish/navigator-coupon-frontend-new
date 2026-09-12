'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Company, Category, Product, Coupon } from '@/types';
import { ArrowLeft, Edit, Loader2, Tag, Building2, Check } from 'lucide-react';

export default function EditCouponPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyId: '',
    code: '',
    type: 'FIXED',
    value: 50,
    minimumOrderAmount: 500,
    maximumDiscount: '',
    usageLimit: 500,
    startsAt: '',
    expiresAt: '',
    status: 'ACTIVE',
    eligibilityType: 'ALL',
    eligibleCategoryIds: [] as string[],
    eligibleProductIds: [] as string[],
  });

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [couponData, compData, catData, prodData] = await Promise.all([
          fetchApi<Coupon>(`/api/admin/coupons/${id}`),
          fetchApi<{ items: Company[] } | Company[]>('/api/admin/companies?limit=100'),
          fetchApi<Category[]>('/api/categories'),
          fetchApi<{ data: Product[] } | Product[]>('/api/products'),
        ]);

        const companiesList = Array.isArray(compData) ? compData : (compData?.items || []);
        const productsList = Array.isArray(prodData) ? prodData : (prodData?.data || []);
        setCompanies(companiesList);
        setCategories(catData || []);
        setProducts(productsList);

        setForm({
          companyId: couponData.companyId,
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          minimumOrderAmount: couponData.minimumOrderAmount || 0,
          maximumDiscount: couponData.maximumDiscount ? String(couponData.maximumDiscount) : '',
          usageLimit: couponData.usageLimit || 0,
          startsAt: new Date(couponData.startsAt).toISOString().split('T')[0],
          expiresAt: new Date(couponData.expiresAt).toISOString().split('T')[0],
          status: couponData.status,
          eligibilityType: couponData.eligibilityType,
          eligibleCategoryIds: couponData.eligibleCategories?.map((c) => c.categoryId) || [],
          eligibleProductIds: couponData.eligibleProducts?.map((p) => p.productId) || [],
        });
      } catch (e) {
        console.error('Failed to load coupon data', e);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  };

  const handleCategoryToggle = (catId: string) => {
    setForm((prev) => ({
      ...prev,
      eligibleCategoryIds: prev.eligibleCategoryIds.includes(catId)
        ? prev.eligibleCategoryIds.filter((c) => c !== catId)
        : [...prev.eligibleCategoryIds, catId],
    }));
  };

  const handleProductToggle = (prodId: string) => {
    setForm((prev) => ({
      ...prev,
      eligibleProductIds: prev.eligibleProductIds.includes(prodId)
        ? prev.eligibleProductIds.filter((p) => p !== prodId)
        : [...prev.eligibleProductIds, prodId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: any = {
        companyId: form.companyId,
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minimumOrderAmount: form.minimumOrderAmount ? Number(form.minimumOrderAmount) : null,
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        startsAt: new Date(form.startsAt).toISOString(),
        expiresAt: new Date(`${form.expiresAt}T23:59:59.999Z`).toISOString(),
        status: form.status,
        eligibilityType: form.eligibilityType,
        eligibleCategoryIds: form.eligibleCategoryIds,
        eligibleProductIds: form.eligibleProductIds,
      };

      await fetchApi<any>(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      router.push(`/admin/coupons/${id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update coupon');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-12 text-center text-xs text-stone-500">Loading coupon form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-stone-800">
        <Link
          href={`/admin/coupons/${id}`}
          className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-amber-400" />
            <span>Edit Coupon {form.code}</span>
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Modify corporate coupon parameters and discount ceilings.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Company</label>
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg font-mono font-bold text-amber-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-6 border-t border-stone-800">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Discount Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="FIXED">Fixed Amount (₹)</option>
              <option value="PERCENTAGE">Percentage (%)</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Discount Value</label>
            <input
              type="number"
              step="any"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Max Discount Cap (₹)</label>
            <input
              type="number"
              name="maximumDiscount"
              value={form.maximumDiscount}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-6 border-t border-stone-800">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Minimum Order (₹)</label>
            <input
              type="number"
              name="minimumOrderAmount"
              value={form.minimumOrderAmount}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-6 border-t border-stone-800">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Start Date</label>
            <input
              type="date"
              name="startsAt"
              value={form.startsAt}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Expiry Date</label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex justify-end gap-3">
          <Link
            href={`/admin/coupons/${id}`}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
