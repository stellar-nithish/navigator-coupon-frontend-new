import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-[#1c1d1f] flex items-center justify-center font-serif text-lg font-bold">
                N
              </div>
              <span className="font-serif text-xl tracking-wider font-bold text-white">
                NAVIGATOR
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Considered menswear for the rhythm of modern India. Pieces that breathe, travel well, and look put together without trying too hard.
            </p>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cotton-shirts" className="hover:text-white transition-colors">
                  100% Cotton Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=linen-shirts" className="hover:text-white transition-colors">
                  French Flax Linen
                </Link>
              </li>
              <li>
                <Link href="/shop?category=the-monsoon-edit" className="hover:text-white transition-colors">
                  The Monsoon Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Corporate */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Enterprise & Management
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Navigator Admin Portal</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">Admin</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/coupons" className="hover:text-amber-300 transition-colors">
                  CouponForge Management
                </Link>
              </li>
              <li>
                <Link href="/admin/companies" className="hover:text-amber-300 transition-colors">
                  Corporate Benefits Directory
                </Link>
              </li>
              <li>
                <Link href="/admin/coupons/analytics" className="hover:text-amber-300 transition-colors">
                  Coupon Analytics & Redemptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Notes from the road
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              New drops, practical style notes, and partner corporate privilege updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#ab8d6c] flex-1"
              />
              <button className="bg-[#ab8d6c] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#947556] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} The Navigator Menswear. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Corporate Coupon System Powered by CouponForge</span>
            <Link href="/admin" className="hover:text-stone-300">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
