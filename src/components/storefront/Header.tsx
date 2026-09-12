'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowUpRight, ShieldCheck, Compass } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#f9f8f6]/90 backdrop-blur-md border-b border-stone-200/80">
      {/* Top micro-announcement */}
      <div className="bg-[#1c1d1f] text-stone-300 text-[11px] py-1.5 px-4 text-center tracking-wide flex items-center justify-between">
        <div className="hidden md:block w-32"></div>
        <div className="flex-1 text-center font-medium">
          Free shipping across India • 100% Breathable Egyptian & Indian Cotton
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors bg-white/10 px-2 py-0.5 rounded"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Portal</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#1c1d1f] text-white flex items-center justify-center font-serif text-lg font-bold group-hover:bg-[#ab8d6c] transition-colors">
              N
            </div>
            <span className="font-serif text-xl tracking-wider font-bold text-[#1c1d1f]">
              NAVIGATOR
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link
              href="/shop"
              className={`hover:text-[#1c1d1f] transition-colors ${
                pathname === '/shop' ? 'text-[#1c1d1f] font-semibold' : ''
              }`}
            >
              All Shirts
            </Link>
            <Link
              href="/shop?category=cotton-shirts"
              className="hover:text-[#1c1d1f] transition-colors"
            >
              Cotton
            </Link>
            <Link
              href="/shop?category=linen-shirts"
              className="hover:text-[#1c1d1f] transition-colors"
            >
              Linen
            </Link>
            <Link
              href="/shop?category=the-monsoon-edit"
              className="hover:text-[#1c1d1f] transition-colors flex items-center gap-1"
            >
              <span>The Monsoon Edit</span>
              <span className="text-[10px] bg-[#ab8d6c]/15 text-[#7a5d45] font-semibold px-1.5 py-0.2 rounded">
                New
              </span>
            </Link>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/coupons"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-full px-3 py-1.5 hover:bg-stone-100 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#ab8d6c]" />
            <span>CouponForge Module</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-800 hover:text-black transition-colors rounded-full hover:bg-stone-200/60"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ab8d6c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
