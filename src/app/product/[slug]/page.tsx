'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import { fetchApi } from '@/lib/api';
import { Product } from '@/types';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Check,
  Ruler,
  X,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [addedNotice, setAddedNotice] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [fabricCareOpen, setFabricCareOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        const data = await fetchApi<Product>(`/api/products/${slug}`);
        setProduct(data);
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const result = addToCart(product, 1, selectedSize);
    if (result && !result.success) {
      setStockErrorMessage(result.message || `Insufficient stock for "${product.title}". Available: ${product.stock}`);
      setAddedNotice(false);
    } else {
      setStockErrorMessage(null);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-xs text-stone-500">
          <div className="w-8 h-8 border-2 border-[#D97736] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div>Loading garment details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1C2C24] mb-2">Garment Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">The requested garment is currently unavailable.</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-[#1C2C24] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.images === 'string'
    ? JSON.parse(product.images || '[]')
    : [];

  const mainImage =
    images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900';
  const secondaryImage =
    images[1] || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900';

  const detailsList = Array.isArray(product.details)
    ? product.details
    : typeof product.details === 'string'
    ? JSON.parse(product.details || '[]')
    : [
        'Regular fit',
        'Full sleeves',
        'Curved hem',
        'Machine wash cold',
        'Made in India',
      ];

  const categoryCaps =
    product.category?.name?.toUpperCase() || 'COTTON SHIRTS';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Shirts</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Dual Studio Folded Photography Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#CDBAA0]/40 aspect-[4/5] border border-stone-200 shadow-sm">
              <img
                src={mainImage}
                alt={`${product.title} front`}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-[#FAF9F5] text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                  {product.badge}
                </div>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#E2D4C3]/50 aspect-[4/5] border border-stone-200 shadow-sm hidden sm:block">
              <img
                src={secondaryImage}
                alt={`${product.title} detail angle`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product Purchasing Box */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category Tag & Title */}
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#D97736] uppercase">
                {categoryCaps}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2C24] mt-1.5 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price & Taxes */}
            <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#1C2C24]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500 italic">Inclusive of all taxes</span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch */}
            <div className="flex items-center gap-2 pt-1">
              <span
                className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shrink-0 shadow-inner"
                style={{ backgroundColor: product.colourHex || '#5B7B88' }}
              />
              <span className="text-xs text-stone-700">
                <strong className="font-semibold text-stone-900">Colour:</strong> {product.color || 'Standard'}
              </span>
            </div>

            {/* Size Selector & Stock Availability */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-900">Select size</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-stone-500 hover:text-stone-900 underline text-[11px] tracking-wider uppercase font-medium flex items-center gap-1"
                >
                  <Ruler className="w-3 h-3" />
                  <span>SIZE GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    disabled={product.stock === 0}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-semibold rounded-lg border transition-all ${
                      product.stock === 0
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : selectedSize === size
                        ? 'bg-[#1C2C24] text-white border-[#1C2C24] shadow-sm'
                        : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Real-Time Stock Status Badges */}
              {product.stock === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Out of stock · Currently unavailable for purchase</span>
                </div>
              ) : product.stock <= 10 ? (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-semibold flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>
                      Only <strong>{product.stock} items</strong> left in stock — order soon!
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                    Low Stock
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>In Stock ({product.stock} units available in warehouse)</span>
                </div>
              )}
            </div>

            {/* Insufficient Stock Error Banner */}
            {stockErrorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start justify-between gap-2.5 shadow-sm animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-900">Stock Limit Reached</div>
                    <div className="text-rose-800 text-[11px] mt-0.5 leading-snug">
                      {stockErrorMessage}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStockErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Add to Bag Button */}
            <div className="pt-1 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  product.stock === 0
                    ? 'bg-stone-400 cursor-not-allowed opacity-75'
                    : 'bg-[#E07A2B] hover:bg-[#CA6B22] active:scale-[0.99] hover:shadow-lg cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
              </button>

              <div className="text-center text-[11px] text-stone-500">
                Free delivery by 3-5 business days · Cash on delivery available
              </div>

              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Added <strong>{product.title}</strong> (Size: {selectedSize}) to your bag!
                  </span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0ECE1]/60 border border-stone-200/80 text-xs text-stone-700">
                <Truck className="w-4 h-4 text-[#D97736] shrink-0" />
                <span className="text-[11px] font-medium">Free shipping over ₹1,499</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0ECE1]/60 border border-stone-200/80 text-xs text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#D97736] shrink-0" />
                <span className="text-[11px] font-medium">7-day easy returns</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-stone-200 pt-4 space-y-3 text-xs">
              {/* Product Details Accordion */}
              <div className="border-b border-stone-200/80 pb-3">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between font-semibold text-stone-900 py-1 text-left"
                >
                  <span>Product details</span>
                  {detailsOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                </button>
                {detailsOpen && (
                  <div className="pt-2 text-stone-600 leading-relaxed text-xs">
                    {detailsList.join(' · ')}
                  </div>
                )}
              </div>

              {/* Fabric & Care Accordion */}
              <div className="border-b border-stone-200/80 pb-3">
                <button
                  type="button"
                  onClick={() => setFabricCareOpen(!fabricCareOpen)}
                  className="w-full flex items-center justify-between font-semibold text-stone-900 py-1 text-left"
                >
                  <span>Fabric & care</span>
                  {fabricCareOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                </button>
                {fabricCareOpen && (
                  <div className="pt-2 text-stone-600 leading-relaxed text-xs">
                    {product.fabricCare || `${product.fabric || '100% Premium Fabric'} · Machine wash cold with similar colors · Low iron.`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#D97736]" />
                <span>Menswear Size Guide (Inches)</span>
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border border-stone-200 rounded-lg overflow-hidden">
                <thead className="bg-[#F0ECE1] text-stone-800 font-semibold">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Shoulder</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-600">
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">S (38)</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">17.5"</td>
                    <td className="p-2.5">29.0"</td>
                    <td className="p-2.5">25.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">M (40)</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">18.0"</td>
                    <td className="p-2.5">29.5"</td>
                    <td className="p-2.5">25.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">L (42)</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">18.75"</td>
                    <td className="p-2.5">30.0"</td>
                    <td className="p-2.5">26.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">XL (44)</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">19.5"</td>
                    <td className="p-2.5">30.5"</td>
                    <td className="p-2.5">26.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">XXL (46)</td>
                    <td className="p-2.5">48"</td>
                    <td className="p-2.5">20.25"</td>
                    <td className="p-2.5">31.0"</td>
                    <td className="p-2.5">27.0"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="px-5 py-2 rounded-xl bg-[#1C2C24] text-white text-xs font-semibold hover:bg-stone-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
