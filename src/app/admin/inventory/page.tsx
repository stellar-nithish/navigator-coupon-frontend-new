'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Product, Category } from '@/types';
import {
  Boxes,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  PackageCheck,
  ShieldAlert,
  X,
  Truck,
} from 'lucide-react';

// Dedicated Stepper & Direct-Type Input for Stock Adjustments
function StockStepperInput({
  product,
  isUpdating,
  onUpdateStock,
}: {
  product: Product;
  isUpdating: boolean;
  onUpdateStock: (product: Product, newStock: number) => Promise<void>;
}) {
  const [val, setVal] = useState<string>(String(product.stock));

  // Sync if external stock state updates
  useEffect(() => {
    setVal(String(product.stock));
  }, [product.stock]);

  const commitValue = () => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0 && num !== product.stock) {
      onUpdateStock(product, num);
    } else {
      setVal(String(product.stock));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setVal(String(product.stock));
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="inline-flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 shadow-inner">
      <button
        type="button"
        onClick={() => onUpdateStock(product, Math.max(0, product.stock - 1))}
        disabled={isUpdating || product.stock <= 0}
        className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 hover:text-white text-stone-400 flex items-center justify-center disabled:opacity-30 transition-colors cursor-pointer"
        title="Decrease 1 unit"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        min="0"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commitValue}
        onKeyDown={handleKeyDown}
        disabled={isUpdating}
        className="w-14 text-center font-mono font-bold text-xs bg-stone-900 text-amber-400 border border-stone-800 rounded-lg py-1 px-1 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        title="Type quantity directly and press Enter"
      />

      <button
        type="button"
        onClick={() => onUpdateStock(product, product.stock + 1)}
        disabled={isUpdating}
        className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 hover:text-white text-stone-400 flex items-center justify-center disabled:opacity-30 transition-colors cursor-pointer"
        title="Increase 1 unit"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'healthy' | 'low' | 'out'>('all');
  const [fabricFilter, setFabricFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Restock Dialog State
  const [selectedRestockProduct, setSelectedRestockProduct] = useState<Product | null>(null);
  const [restockMode, setRestockMode] = useState<'add' | 'set'>('add');
  const [restockUnits, setRestockUnits] = useState<number>(25);
  const [restockNote, setRestockNote] = useState<string>('Warehouse replenishment batch');
  const [restockSubmitting, setRestockSubmitting] = useState(false);

  async function loadInventory() {
    setLoading(true);
    try {
      const [prodRes, catData] = await Promise.all([
        fetchApi<{ data: Product[] } | Product[]>('/api/admin/products?limit=100'),
        fetchApi<Category[]>('/api/categories'),
      ]);

      const items = Array.isArray(prodRes) ? prodRes : prodRes?.data || [];
      setProducts(items);
      setCategories(catData || []);
    } catch (e) {
      console.error('Failed to load inventory', e);
      showToast('Failed to load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Direct Stock Update
  const handleUpdateStock = async (product: Product, newStock: number) => {
    const validStock = Math.max(0, Math.floor(newStock));
    if (validStock === product.stock) return;

    setUpdatingId(product.id);
    try {
      await fetchApi(`/api/admin/products/${product.id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: validStock }),
      });

      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: validStock } : p)),
      );
      showToast(`Updated "${product.title}" stock to ${validStock} units`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Restock Modal Submit
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestockProduct) return;

    const currentStock = selectedRestockProduct.stock;
    const newStock =
      restockMode === 'add'
        ? Math.max(0, currentStock + Number(restockUnits))
        : Math.max(0, Number(restockUnits));

    setRestockSubmitting(true);
    try {
      await fetchApi(`/api/admin/products/${selectedRestockProduct.id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: newStock }),
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedRestockProduct.id ? { ...p, stock: newStock } : p,
        ),
      );
      showToast(
        `Restocked "${selectedRestockProduct.title}": ${currentStock} → ${newStock} units`,
      );
      setSelectedRestockProduct(null);
    } catch (err: any) {
      showToast(err.message || 'Restock failed', 'error');
    } finally {
      setRestockSubmitting(false);
    }
  };

  // Metrics Calculations
  const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const healthyCount = products.filter((p) => p.stock > 15).length;
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= 15).length;
  const outCount = products.filter((p) => p.stock === 0).length;
  const totalValuation = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    // Search match
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchFabric = (p.fabric || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSku && !matchFabric) return false;
    }

    // Health state filter
    if (filterMode === 'healthy' && p.stock <= 15) return false;
    if (filterMode === 'low' && (p.stock === 0 || p.stock > 15)) return false;
    if (filterMode === 'out' && p.stock !== 0) return false;

    // Fabric filter
    if (fabricFilter !== 'all') {
      if (fabricFilter === 'Linen' && !p.fabric?.toLowerCase().includes('linen')) return false;
      if (fabricFilter === 'Cotton' && !p.fabric?.toLowerCase().includes('cotton')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-2xl animate-fadeIn ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-300'
              : 'bg-rose-950/90 border-rose-700 text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Warehouse & Inventory Control</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Live stock monitor, low inventory thresholds, and instant warehouse replenishment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadInventory}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Stock</span>
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* 5-Card High-Visibility KPI Grid with Proper Padding & Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Units */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="font-medium text-stone-300">Total Units in Stock</span>
            <Boxes className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              {loading ? '...' : totalUnits.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1">Across {products.length} garments</p>
          </div>
        </div>

        {/* Healthy Stock */}
        <div
          onClick={() => setFilterMode(filterMode === 'healthy' ? 'all' : 'healthy')}
          className={`border rounded-2xl p-5 sm:p-6 space-y-2.5 cursor-pointer transition-all shadow-md flex flex-col justify-between ${
            filterMode === 'healthy'
              ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500'
              : 'bg-stone-900 border-stone-800 hover:border-emerald-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span>Healthy Stock (&gt;15)</span>
            <PackageCheck className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tracking-tight">
              {loading ? '...' : healthyCount}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              {products.length > 0 ? Math.round((healthyCount / products.length) * 100) : 0}% of catalog
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setFilterMode(filterMode === 'low' ? 'all' : 'low')}
          className={`border rounded-2xl p-5 sm:p-6 space-y-2.5 cursor-pointer transition-all shadow-md flex flex-col justify-between ${
            filterMode === 'low'
              ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500'
              : lowCount > 0
              ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700'
              : 'bg-stone-900 border-stone-800'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span>Low Stock (1-15)</span>
            <ShieldAlert className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono tracking-tight">
              {loading ? '...' : lowCount}
            </div>
            <p className="text-xs text-amber-400/90 mt-1 font-medium">Needs reorder soon</p>
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setFilterMode(filterMode === 'out' ? 'all' : 'out')}
          className={`border rounded-2xl p-5 sm:p-6 space-y-2.5 cursor-pointer transition-all shadow-md flex flex-col justify-between ${
            filterMode === 'out'
              ? 'bg-rose-950/40 border-rose-500/70 ring-1 ring-rose-500'
              : outCount > 0
              ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700'
              : 'bg-stone-900 border-stone-800'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
            <span>Out of Stock (0)</span>
            <XCircle className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono tracking-tight">
              {loading ? '...' : outCount}
            </div>
            <p className="text-xs text-stone-400 mt-1">Unavailable for checkout</p>
          </div>
        </div>

        {/* Inventory Retail Valuation */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span className="text-stone-300">Inventory Valuation</span>
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono tracking-tight truncate">
              ₹{loading ? '...' : totalValuation.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1">Retail asset value</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by garment title, fabric (e.g. Linen), or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterMode === 'all'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterMode === 'low'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-amber-400 border border-stone-800'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterMode === 'out'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-stone-950 text-stone-400 hover:text-rose-400 border border-stone-800'
            }`}
          >
            Out of Stock ({outCount})
          </button>

          <div className="h-4 w-px bg-stone-800 mx-1 hidden sm:block" />

          <select
            value={fabricFilter}
            onChange={(e) => setFabricFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="all">All Fabrics</option>
            <option value="Linen">100% Linen</option>
            <option value="Cotton">Cotton Weave</option>
          </select>
        </div>
      </div>

      {/* Desktop / Tablet Inventory Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hidden sm:block shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[840px]">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 bg-stone-950/70 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Garment</th>
                <th className="p-4">SKU / Category</th>
                <th className="p-4">Stock Status & Health</th>
                <th className="p-4 text-center">Available Units</th>
                <th className="p-4 text-right">Unit Price</th>
                <th className="p-4 text-right">Asset Valuation</th>
                <th className="p-4 text-center">Quick Adjust</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-stone-500">
                    <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading inventory telemetry...</div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-stone-500">
                    No garments matched your inventory filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const rawImages = product.images;
                  const images = Array.isArray(rawImages)
                    ? rawImages
                    : typeof rawImages === 'string'
                    ? JSON.parse(rawImages || '[]')
                    : [];
                  const mainImage =
                    images[0] ||
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

                  const isLow = product.stock > 0 && product.stock <= 15;
                  const isOut = product.stock === 0;
                  const healthPercent = Math.min(100, Math.round((product.stock / 100) * 100));

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Garment Photo & Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={mainImage}
                            alt={product.title}
                            className="w-11 h-14 object-cover rounded-lg bg-stone-950 border border-stone-800 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">
                              {product.title}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                              {product.colourHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-stone-700 inline-block shrink-0"
                                  style={{ backgroundColor: product.colourHex }}
                                />
                              )}
                              <span>{product.color || 'Standard'}</span>
                              <span>•</span>
                              <span>{product.fabric || 'Fabric'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Category */}
                      <td className="p-4">
                        <div className="font-mono font-bold text-amber-400/90 text-[11px]">
                          {product.sku}
                        </div>
                        <span className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 mt-1 inline-block">
                          {product.category?.name || 'Menswear'}
                        </span>
                      </td>

                      {/* Stock Health Bar & Status */}
                      <td className="p-4 max-w-[180px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                                <XCircle className="w-3 h-3" />
                                <span>OUT OF STOCK</span>
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                                <AlertTriangle className="w-3 h-3" />
                                <span>LOW STOCK</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>IN STOCK</span>
                              </span>
                            )}
                            <span className="text-stone-500 font-mono text-[10px]">
                              {healthPercent}% cap
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden border border-stone-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOut
                                  ? 'bg-rose-500 w-0'
                                  : isLow
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.max(4, healthPercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Available Units */}
                      <td className="p-4 text-center font-mono">
                        <span
                          className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${
                            isOut
                              ? 'bg-rose-950/60 border-rose-800/80 text-rose-400'
                              : isLow
                              ? 'bg-amber-950/60 border-amber-800/80 text-amber-400'
                              : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="p-4 text-right font-medium text-stone-300">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Asset Valuation */}
                      <td className="p-4 text-right font-bold text-amber-400 font-mono">
                        ₹{(product.price * product.stock).toLocaleString('en-IN')}
                      </td>

                      {/* Quick Adjust: Minus, Direct Manual Input, Plus */}
                      <td className="p-4 text-center">
                        <StockStepperInput
                          product={product}
                          isUpdating={updatingId === product.id}
                          onUpdateStock={handleUpdateStock}
                        />
                      </td>

                      {/* Action / Restock Button */}
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRestockProduct(product);
                            setRestockUnits(25);
                            setRestockMode('add');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-stone-700/80 font-bold text-xs transition-all shadow-xs active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Phone Inventory Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            <div className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
            <div>Loading inventory...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 text-xs">
            No garments matched your filters.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const rawImages = product.images;
            const images = Array.isArray(rawImages)
              ? rawImages
              : typeof rawImages === 'string'
              ? JSON.parse(rawImages || '[]')
              : [];
            const mainImage =
              images[0] ||
              'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400';

            const isLow = product.stock > 0 && product.stock <= 15;
            const isOut = product.stock === 0;

            return (
              <div
                key={product.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4.5 space-y-3 shadow-md"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-14 h-18 object-cover rounded-xl bg-stone-950 border border-stone-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-amber-400 tracking-tight">
                      {product.sku}
                    </span>
                    <h3 className="font-bold text-white text-xs leading-snug truncate mt-0.5">
                      {product.title}
                    </h3>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {product.fabric || 'Fabric'} • {product.color || 'Standard'}
                    </div>
                    <div className="font-bold text-white text-xs mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Stock pill & valuation */}
                <div className="border-t border-stone-800 pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isOut
                          ? 'bg-rose-950/60 border-rose-800 text-rose-400'
                          : isLow
                          ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                          : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      }`}
                    >
                      {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}: {product.stock} units
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400">Valuation: </span>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      ₹{(product.price * product.stock).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quick actions bar with Stepper & Direct Type Input */}
                <div className="border-t border-stone-800 pt-2.5 flex items-center justify-between gap-2">
                  <StockStepperInput
                    product={product}
                    isUpdating={updatingId === product.id}
                    onUpdateStock={handleUpdateStock}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRestockProduct(product);
                      setRestockUnits(25);
                      setRestockMode('add');
                    }}
                    className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Restock</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Restock Batch Modal Popup */}
      {selectedRestockProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Warehouse Restock Batch
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    {selectedRestockProduct.sku} • {selectedRestockProduct.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRestockProduct(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current status banner */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400">Current Warehouse Stock:</span>
                <div className="font-mono text-base font-bold text-white mt-0.5">
                  {selectedRestockProduct.stock} units
                </div>
              </div>
              <div className="text-right">
                <span className="text-stone-400">Projected Value:</span>
                <div className="font-mono text-base font-bold text-amber-400 mt-0.5">
                  ₹{(
                    selectedRestockProduct.price *
                    (restockMode === 'add'
                      ? selectedRestockProduct.stock + Number(restockUnits || 0)
                      : Number(restockUnits || 0))
                  ).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setRestockMode('add')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    restockMode === 'add'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  + Add Shipment Units
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestockMode('set');
                    setRestockUnits(selectedRestockProduct.stock);
                  }}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    restockMode === 'set'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Set Exact New Stock
                </button>
              </div>

              {/* Units Input */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">
                  {restockMode === 'add' ? 'Incoming Batch Units (+)' : 'Exact Warehouse Count'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    required
                    value={restockUnits}
                    onChange={(e) => setRestockUnits(Number(e.target.value))}
                    className="flex-1 px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {restockMode === 'add' && (
                    <div className="flex gap-1">
                      {[10, 25, 50, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRestockUnits(preset)}
                          className={`px-2.5 py-3 rounded-xl border text-xs font-bold font-mono transition-colors ${
                            restockUnits === preset
                              ? 'bg-amber-400 text-stone-950 border-amber-400'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:text-white'
                          }`}
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Restock Batch Note */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">
                  Batch Log / Shipment Reference
                </label>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  placeholder="e.g. Factory shipment batch #104"
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setSelectedRestockProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={restockSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>
                    {restockSubmitting
                      ? 'Updating Stock...'
                      : restockMode === 'add'
                      ? `Confirm +${restockUnits} Units`
                      : `Set Stock to ${restockUnits}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
