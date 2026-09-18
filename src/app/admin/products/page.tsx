'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Product, Category } from '@/types';
import {
  Package,
  Search,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);

      const [prodRes, catRes] = await Promise.all([
        fetchApi<{ data: Product[] } | Product[]>(`/api/admin/products?${params.toString()}`),
        fetchApi<Category[]>('/api/categories'),
      ]);

      const items = Array.isArray(prodRes) ? prodRes : (prodRes?.data || []);
      setProducts(items);
      setCategories(catRes || []);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [search, selectedCategory]);

  async function handleDelete(id: string) {
    setActionLoading(true);
    try {
      await fetchApi(`/api/admin/products/${id}`, { method: 'DELETE' });
      setActionMessage({ type: 'success', text: 'Garment removed from catalog successfully.' });
      setDeletingId(null);
      await loadData();
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message || 'Failed to delete product.' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border-rose-800 text-rose-300'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Garments Catalog</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Navigator menswear shirts, fabrics, stock inventory, and coupon eligibility mapping.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search garment by title, fabric, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet Garments Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-950/60 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Garment</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Fabric</th>
                <th className="p-4 text-right">Stock</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Store Link</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-stone-500">
                    <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading garments catalog...</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-stone-500">
                    No garments found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const images = Array.isArray(p.images)
                    ? p.images
                    : typeof p.images === 'string'
                    ? JSON.parse(p.images || '[]')
                    : [];
                  const mainImg = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

                  return (
                    <tr key={p.id} className="hover:bg-stone-800/30 transition-colors group">
                      {/* Thumbnail & Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shrink-0 relative">
                            <img
                              src={mainImg}
                              alt={p.title}
                              className="w-full h-full object-cover object-center"
                            />
                            {p.badge && (
                              <div className="absolute top-0.5 left-0.5 bg-amber-400 text-[8px] font-black text-stone-950 px-1 rounded">
                                {p.badge}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                              {p.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.colourHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-stone-700 inline-block"
                                  style={{ backgroundColor: p.colourHex }}
                                />
                              )}
                              <span className="text-[11px] text-stone-400">{p.color || 'Standard'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-stone-950 text-stone-300 border border-stone-800 text-[11px] font-medium">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="p-4 font-mono text-stone-400 text-[11px] font-medium tracking-tight">
                        {p.sku}
                      </td>

                      {/* Fabric */}
                      <td className="p-4 text-stone-300 max-w-[150px] truncate">
                        {p.fabric || '—'}
                      </td>

                      {/* Stock */}
                      <td className="p-4 text-right">
                        <span
                          className={`font-semibold ${
                            p.stock <= 10
                              ? 'text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50'
                              : 'text-stone-200'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right">
                        <div className="font-bold text-amber-400 text-sm">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        {p.compareAtPrice && (
                          <div className="text-[10px] text-stone-500 line-through">
                            ₹{p.compareAtPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Store Link */}
                      <td className="p-4 text-center">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-300 transition-colors text-[11px] font-medium"
                        >
                          <span>Store</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Edit Garment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeletingId(p.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* Mobile Phone Garment Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
            <div>Loading garments catalog...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            No garments found.
          </div>
        ) : (
          products.map((p) => {
            const images = Array.isArray(p.images)
              ? p.images
              : typeof p.images === 'string'
              ? JSON.parse(p.images || '[]')
              : [];
            const mainImg = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

            return (
              <div
                key={p.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 shadow-md"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shrink-0 relative">
                    <img
                      src={mainImg}
                      alt={p.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {p.badge && (
                      <div className="absolute top-1 left-1 bg-amber-400 text-[8px] font-black text-stone-950 px-1 rounded">
                        {p.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {p.category?.name || 'Garment'}
                    </span>
                    <h3 className="font-bold text-white text-xs leading-snug line-clamp-2 mt-0.5">
                      {p.title}
                    </h3>
                    <div className="text-[11px] text-stone-400 mt-1 font-mono">
                      SKU: {p.sku}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Fabric: {p.fabric || '—'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-800 pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 text-[11px]">Stock: </span>
                    <span
                      className={`font-semibold ${
                        p.stock <= 10 ? 'text-rose-400' : 'text-stone-200'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-400 text-sm">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-800 pt-2 flex items-center justify-between gap-2">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Preview Store</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-2 bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeletingId(p.id)}
                      className="p-2 bg-stone-800 hover:bg-rose-500 text-stone-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-white">Delete Garment</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to remove this garment from the catalog? If this garment is attached to existing orders, its stock will be safely set to 0.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
