'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Product, Category } from '@/types';
import {
  ArrowLeft,
  Package,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(100);
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('');
  const [colourHex, setColourHex] = useState('#5B7B88');
  const [badge, setBadge] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [fabricCare, setFabricCare] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [product, cats] = await Promise.all([
          fetchApi<Product>(`/api/admin/products/${id}`),
          fetchApi<Category[]>('/api/categories'),
        ]);

        setCategories(cats || []);
        if (product) {
          setTitle(product.title);
          setSlug(product.slug);
          setDescription(product.description);
          setPrice(product.price);
          setCompareAtPrice(product.compareAtPrice || '');
          setSku(product.sku);
          setStock(product.stock);
          setFabric(product.fabric || '');
          setColor(product.color || '');
          setColourHex(product.colourHex || '#5B7B88');
          setBadge(product.badge || '');
          setCategoryId(product.categoryId);
          setFabricCare(product.fabricCare || '');

          const parsedImages = Array.isArray(product.images)
            ? product.images
            : typeof product.images === 'string'
            ? JSON.parse(product.images || '[]')
            : [];
          setImageUrls(parsedImages.length > 0 ? parsedImages : ['']);

          const parsedDetails = Array.isArray(product.details)
            ? product.details
            : typeof product.details === 'string'
            ? JSON.parse(product.details || '[]')
            : [];
          setDetails(parsedDetails.length > 0 ? parsedDetails : ['']);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  function addImageUrl() {
    setImageUrls([...imageUrls, '']);
  }

  function updateImageUrl(index: number, val: string) {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  }

  function removeImageUrl(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  function addDetail() {
    setDetails([...details, '']);
  }

  function updateDetail(index: number, val: string) {
    const updated = [...details];
    updated[index] = val;
    setDetails(updated);
  }

  function removeDetail(index: number) {
    setDetails(details.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!title.trim() || !sku.trim() || !price || !categoryId) {
      setError('Please fill in all required fields (Title, SKU, Price, Category).');
      setSaving(false);
      return;
    }

    try {
      const validImages = imageUrls.filter((img) => img.trim() !== '');
      const validDetails = details.filter((d) => d.trim() !== '');

      await fetchApi(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          description: description.trim(),
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          sku: sku.trim().toUpperCase(),
          stock: Number(stock),
          fabric: fabric.trim() || null,
          color: color.trim() || null,
          colourHex: colourHex.trim() || null,
          badge: badge.trim() || null,
          categoryId,
          images: validImages,
          details: validDetails,
          fabricCare: fabricCare.trim() || null,
        }),
      });

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to update garment.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-stone-400">
        <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
        <div>Loading garment details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Edit Garment: {title}</span>
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Modify pricing, specifications, image gallery, or inventory for this product.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Garment Identity & Classification</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Garment Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Slug (URL Path)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Category <span className="text-amber-400">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Badge / Tag (Optional)</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">No Badge</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="NEW">NEW</option>
                <option value="20% OFF">20% OFF</option>
                <option value="LIMITED">LIMITED</option>
                <option value="PURE LINEN">PURE LINEN</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Short Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Pricing & Inventory Management</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Price (₹) <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                required
                min={0}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Compare Price (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) =>
                  setCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                min={0}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                SKU <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min={0}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Fabric & Swatches */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Fabric & Color Swatch</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Fabric Composition</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Color Name</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Color Swatch (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colourHex}
                  onChange={(e) => setColourHex(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={colourHex}
                  onChange={(e) => setColourHex(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-stone-300">Fabric & Care Guide</label>
            <input
              type="text"
              value={fabricCare}
              onChange={(e) => setFabricCare(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Studio Folded Garment Imagery (Gallery)</span>
            </h2>
            <button
              type="button"
              onClick={addImageUrl}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Angle</span>
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                  {url ? (
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px]">
                      No img
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(idx)}
                    className="p-2 text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bullet Details */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Product Specifications / Highlights</span>
            </h2>
            <button
              type="button"
              onClick={addDetail}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="space-y-2">
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => updateDetail(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="p-2 text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
