'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Building2,
  Tag,
  BarChart3,
  History,
  ShoppingBag,
  Package,
  Layers,
  ArrowUpRight,
  PlusCircle,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status on mount & route change
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const auth = localStorage.getItem('navigator_admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.replace(`/admin/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('navigator_admin_authenticated');
    localStorage.removeItem('navigator_admin_user');
    document.cookie = 'navigator_admin_session=; path=/; max-age=0';
    setIsAuthenticated(false);
    router.replace('/admin/login');
  };

  // If on login page, render child component directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading spinner while verifying credentials
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 text-xs font-sans space-y-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <div className="font-medium text-stone-300">Checking admin session...</div>
      </div>
    );
  }

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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-100">
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

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-1">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
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
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
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
                    onClick={() => setMobileMenuOpen(false)}
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

      {/* Bottom Store Switcher & Logout */}
      <div className="p-4 border-t border-stone-800 bg-stone-900/50 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-between transition-colors border border-stone-700/60"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront</span>
          </div>
          <ArrowUpRight className="w-3 h-3 text-stone-400" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors border border-rose-900/40 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] text-rose-400/80 font-mono">admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-900">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 border-r border-stone-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-stone-900 border-r border-stone-800 flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-950">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-stone-800 bg-stone-900/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-white sm:text-stone-300">
                <span className="lg:hidden font-bold text-amber-400 mr-1">NAVIGATOR</span>
                CouponForge
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                System Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/coupons/new"
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Coupon</span>
              <span className="sm:hidden">New</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors hidden sm:inline-flex"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}

