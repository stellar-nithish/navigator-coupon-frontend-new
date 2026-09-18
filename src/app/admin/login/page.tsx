'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin
    const isAuth = localStorage.getItem('navigator_admin_authenticated');
    if (isAuth === 'true') {
      router.replace(returnUrl);
    }
  }, [returnUrl, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (trimmedUser === 'admin' && trimmedPass === 'Navigator@2026') {
        localStorage.setItem('navigator_admin_authenticated', 'true');
        localStorage.setItem('navigator_admin_user', 'admin');
        localStorage.setItem('navigator_admin_login_time', new Date().toISOString());
        document.cookie = 'navigator_admin_session=1; path=/; max-age=86400; SameSite=Lax';
        setSuccess(true);
        setTimeout(() => {
          router.replace(returnUrl);
        }, 400);
      } else {
        setError('Invalid username or password. Please check your credentials.');
        setLoading(false);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('Navigator@2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-400 selection:text-stone-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer Storefront</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-[11px] text-amber-400/90 font-semibold">
            SECURE ACCESS GATEWAY
          </span>
        </div>
      </div>

      {/* Center Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Top Accent Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-black text-2xl mx-auto shadow-lg shadow-amber-400/10">
              N
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Navigator Admin
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              Sign in with your administrator credentials to manage products, orders, and CouponForge.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentication successful! Entering admin portal...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick autofill helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px] underline decoration-dotted"
              >
                <KeyRound className="w-3 h-3" />
                <span>Auto-fill credentials</span>
              </button>
              <span className="text-[10px] text-stone-600 font-mono">v1.0.0</span>
            </div>

            <button
              type="submit"
              disabled={loading || success || !username || !password}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 active:scale-98 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <span>Validating Credentials...</span>
              ) : success ? (
                <span>Access Granted</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-stone-600">
        © 2026 The Navigator Menswear. Powered by CouponForge Module.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 text-xs font-sans space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <div>Loading Admin Gateway...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
