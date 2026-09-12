'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Company, Category, Product } from '@/types';
import { ArrowLeft, Tag, PlusCircle, Check, Loader2, Sparkles, Building2 } from 'lucide-react';

export default function CreateCouponPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    companyId: '',
    code: '',
    type: 'FIXED',
    value: 50,
    minimumOrderAmount: 500,
    maximumDiscount: '',
    usageLimit: 500,
    startsAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'ACTIVE',
    eligibilityType: 'ALL',
    eligibleCategoryIds: [] as string[],
    eligibleProductIds: [] as string[],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [compData, catData, prodData] = await Promise.all([
          fetchApi<{ items: Company[] } | Company[]>('/api/admin/companies?limit=100'),
          fetchApi<Category[]>('/api/categories'),
          fetchApi<{ data: Product[] } | Product[]>('/api/products'),
        ]);
        const companiesList = Array.isArray(compData) ? compData : (compData?.items || []);
        const productsList = Array.isArray(prodData) ? prodData : (prodData?.data || []);
        setCompanies(companiesList);
        if (companiesList.length > 0) {
          setForm((f) => ({ ...f, companyId: companiesList[0].id }));
        }
        setCategories(catData || []);
        setProducts(productsList);
      } catch (e) {
        console.error('Failed to load initial form data', e);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  };

  const handleCategoryToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      eligibleCategoryIds: prev.eligibleCategoryIds.includes(id)
        ? prev.eligibleCategoryIds.filter((cid) => cid !== id)
        : [...prev.eligibleCategoryIds, id],
    }));
  };

  const handleProductToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      eligibleProductIds: prev.eligibleProductIds.includes(id)
        ? prev.eligibleProductIds.filter((pid) => pid !== id)
        : [...prev.eligibleProductIds, id],
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
      };

      if (form.eligibilityType === 'CATEGORY') {
        payload.eligibleCategoryIds = form.eligibleCategoryIds;
      } else if (form.eligibilityType === 'PRODUCT') {
        payload.eligibleProductIds = form.eligibleProductIds;
      }

      const created = await fetchApi<any>('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push(`/admin/coupons/${created.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-12 text-center text-xs text-stone-500">
        Loading creation environment...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-stone-800">
        <Link
          href="/admin/coupons/all"
          className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <span>Create Corporate Coupon</span>
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure partner discount rules, order thresholds, and eligibility restrictions.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-8 shadow-xl">
        {/* Section 1: Basic Parameters */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>1. Partner & Coupon Identity</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Corporate Partner Company *
              </label>
              <select
                required
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
              <label className="block text-stone-300 font-semibold mb-1.5">
                Coupon Code * (e.g. STELLAR50)
              </label>
              <input
                type="text"
                required
                name="code"
                placeholder="STELLAR50"
                value={form.code}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg font-mono font-bold text-amber-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Discount Mechanics */}
        <div className="space-y-4 pt-6 border-t border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>2. Discount Benefit</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Discount Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="FIXED">Fixed Amount (₹ Flat Off)</option>
                <option value="PERCENTAGE">Percentage (% Off)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Discount Value * {form.type === 'PERCENTAGE' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {form.type === 'PERCENTAGE' && (
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">
                  Maximum Discount Cap (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  name="maximumDiscount"
                  placeholder="e.g. 500"
                  value={form.maximumDiscount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Rules & Constraints */}
        <div className="space-y-4 pt-6 border-t border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            3. Order Rules & Usage Limits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Minimum Cart Order (₹)
              </label>
              <input
                type="number"
                min="0"
                name="minimumOrderAmount"
                value={form.minimumOrderAmount}
                onChange={handleChange}
                placeholder="500"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Cart subtotal must equal or exceed this amount.
              </span>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Total Redemptions Limit
              </label>
              <input
                type="number"
                min="1"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="500"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Transactional ceiling across all customers.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Validity & Status */}
        <div className="space-y-4 pt-6 border-t border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            4. Validity Period & Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Start Date *</label>
              <input
                type="date"
                required
                name="startsAt"
                value={form.startsAt}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Expiry Date *</label>
              <input
                type="date"
                required
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">Initial Status *</label>
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
        </div>

        {/* Section 5: Eligibility Rules */}
        <div className="space-y-4 pt-6 border-t border-stone-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            5. Garment Eligibility Scope
          </h2>

          <div className="text-xs space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                <input
                  type="radio"
                  name="eligibilityType"
                  value="ALL"
                  checked={form.eligibilityType === 'ALL'}
                  onChange={handleChange}
                  className="text-amber-400 focus:ring-0"
                />
                <span>All Products in Catalog</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                <input
                  type="radio"
                  name="eligibilityType"
                  value="CATEGORY"
                  checked={form.eligibilityType === 'CATEGORY'}
                  onChange={handleChange}
                  className="text-amber-400 focus:ring-0"
                />
                <span>Specific Categories</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                <input
                  type="radio"
                  name="eligibilityType"
                  value="PRODUCT"
                  checked={form.eligibilityType === 'PRODUCT'}
                  onChange={handleChange}
                  className="text-amber-400 focus:ring-0"
                />
                <span>Specific Products</span>
              </label>
            </div>

            {form.eligibilityType === 'CATEGORY' && (
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                <span className="text-stone-400 font-semibold block mb-2">
                  Select Applicable Categories:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        form.eligibleCategoryIds.includes(cat.id)
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-semibold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {form.eligibleCategoryIds.includes(cat.id) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.eligibilityType === 'PRODUCT' && (
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                <span className="text-stone-400 font-semibold block mb-2">
                  Select Applicable Garments:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {products.map((prod) => (
                    <button
                      type="button"
                      key={prod.id}
                      onClick={() => handleProductToggle(prod.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        form.eligibleProductIds.includes(prod.id)
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-semibold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="text-white font-medium">{prod.title}</div>
                        <div className="text-[10px] text-stone-500">₹{prod.price}</div>
                      </div>
                      {form.eligibleProductIds.includes(prod.id) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-6 border-t border-stone-800 flex justify-end gap-3">
          <Link
            href="/admin/coupons/all"
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
                <span>Creating Coupon...</span>
              </>
            ) : (
              <span>Create Coupon</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
