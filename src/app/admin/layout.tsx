'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Building2,
  Tag,
  BarChart3,
  History,
  ShoppingBag,
  Package,
  Users,
  Layers,
  ArrowUpRight,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Store Dashboard', href: '/admin', icon: Layers },
    {
      group: 'COUPON MANAGEMENT',
      items: [
        { label: 'Coupon Dashboard', href: '/admin/coupons', icon: Compass },
        { label: 'All Coupons', href: '/admin/coupons/all', icon: Tag },
        { label: 'Create Coupon', href: '/admin/coupons/new', icon: PlusCircle },
        { label: 'Partner Companies', href: '/admin/companies', icon: Building2 },
        { label: 'Redemptions Log', href: '/admin/coupons/usage', icon: History },
        { label: 'Coupon Analytics', href: '/admin/coupons/analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'STORE OPERATIONS',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Products', href: '/admin/products', icon: Package },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col shrink-0">
        {/* Logo / Brand Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-serif font-black text-base shadow-sm">
              N
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-white tracking-wider">
                NAVIGATOR
              </div>
              <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <span>ADMIN PANEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Overview</span>
            </Link>
          </div>

          {/* Groups */}
          {navItems.slice(1).map((section: any, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-300">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin' &&
                      item.href !== '/admin/coupons' &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                          : 'text-stone-300 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Store Switcher */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/50">
          <Link
            href="/"
            target="_blank"
            className="w-full px-3 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-between transition-colors border border-stone-700/60"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Storefront</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-stone-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-stone-950">
        {/* Top bar */}
        <header className="h-16 border-b border-stone-800 bg-stone-900/50 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">CouponForge Module</span>
            <span className="text-stone-600">•</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              System Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/coupons/new"
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Coupon</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
