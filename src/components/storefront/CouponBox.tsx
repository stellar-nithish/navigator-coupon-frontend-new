'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Tag, CheckCircle2, XCircle, Loader2, X, Sparkles } from 'lucide-react';

interface CouponBoxProps {
  compact?: boolean;
}

export default function CouponBox({ compact = false }: CouponBoxProps) {
  const {
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    isApplyingCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
  } = useCart();

  const [inputVal, setInputVal] = useState('');

  const handleApply = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    const code = inputVal.trim() || couponCodeInput.trim();
    if (!code) return;
    const success = await applyCoupon(code);
    if (success) {
      setInputVal('');
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      appliedCoupon
        ? 'bg-emerald-50/70 border-emerald-200'
        : 'bg-white/80 border-stone-200/80'
    } ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-stone-700">
          <Tag className="w-3.5 h-3.5 text-[#ab8d6c]" />
          <span>Have a Coupon or Corporate Code?</span>
        </div>
        {appliedCoupon && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Applied
          </span>
        )}
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {appliedCoupon.discountType === 'PERCENTAGE' ? '%' : '₹'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-stone-900 tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {appliedCoupon.discountType === 'PERCENTAGE'
                    ? `${appliedCoupon.discountValue}% OFF`
                    : `₹${appliedCoupon.discountAmount} OFF`}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {appliedCoupon.companyName ? `Corporate benefit via ${appliedCoupon.companyName}` : appliedCoupon.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="text-stone-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
            title="Remove coupon"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value.toUpperCase());
                  setCouponCodeInput(e.target.value.toUpperCase());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleApply(e);
                  }
                }}
                placeholder="e.g. STELLAR50"
                className="w-full px-3 py-2 text-xs uppercase tracking-wider font-mono bg-stone-50/80 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab8d6c] focus:border-transparent placeholder:text-stone-400 placeholder:normal-case placeholder:font-sans"
                disabled={isApplyingCoupon}
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplyingCoupon || !inputVal.trim()}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#1c1d1f] hover:bg-stone-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>

          {couponError && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600 bg-red-50/80 border border-red-200 rounded-lg p-2.5">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{couponError}</span>
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-stone-500">
            <Sparkles className="w-3 h-3 text-[#ab8d6c]" />
            <span>
              Partner code demo:{' '}
              <button
                type="button"
                onClick={() => {
                  setInputVal('STELLAR50');
                  applyCoupon('STELLAR50');
                }}
                className="font-mono font-medium text-stone-800 underline decoration-dotted hover:text-[#ab8d6c]"
              >
                STELLAR50
              </button>{' '}
              (₹50 off on ₹500+)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
