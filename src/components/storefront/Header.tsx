'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-[#f9f8f6]/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Top micro-announcement */}
      <div className="bg-[#1c1d1f] text-stone-300 text-[11px] py-1.5 px-3 sm:px-4 tracking-wide flex items-center justify-between">
        <div className="hidden md:block w-28"></div>
        <div className="flex-1 text-center font-medium truncate sm:overflow-visible">
          Free shipping across India • 100% Cotton & Linen
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors bg-white/10 px-2 py-0.5 rounded shrink-0"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Menu button & Brand */}
        <div className="flex items-center gap-3 sm:gap-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-200/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#1c1d1f] text-white flex items-center justify-center font-serif text-lg font-bold group-hover:bg-[#ab8d6c] transition-colors">
              N
            </div>
            <span className="font-serif text-lg sm:text-xl tracking-wider font-bold text-[#1c1d1f]">
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
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/admin/coupons"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-full px-3 py-1.5 hover:bg-stone-100 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#ab8d6c]" />
            <span>CouponForge</span>
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

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#f9f8f6] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <div className="space-y-1">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-semibold text-stone-800 border-b border-stone-200/60"
            >
              <span>All Shirts</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
            <Link
              href="/shop?category=cotton-shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-medium text-stone-700 border-b border-stone-200/60"
            >
              <span>Cotton Shirts</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
            <Link
              href="/shop?category=linen-shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-medium text-stone-700 border-b border-stone-200/60"
            >
              <span>Linen Shirts</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
            <Link
              href="/shop?category=the-monsoon-edit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-medium text-stone-700 border-b border-stone-200/60"
            >
              <div className="flex items-center gap-1.5">
                <span>The Monsoon Edit</span>
                <span className="text-[10px] bg-[#ab8d6c]/20 text-[#7a5d45] font-bold px-1.5 py-0.5 rounded">
                  NEW
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/coupons"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>CouponForge Corporate Module</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

