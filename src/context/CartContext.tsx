'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CouponValidationResult } from '../types';
import { fetchApi } from '../lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: CouponValidationResult | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  isApplyingCoupon: boolean;
  couponError: string | null;
  applyCoupon: (code?: string) => Promise<boolean>;
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to determine if two line items match the exact same product variant & size
function isSameItem(
  item: CartItem,
  targetProduct: { id?: string; slug?: string; sku?: string; title?: string },
  targetSize: string = 'M',
): boolean {
  const s1 = (item.size || 'M').trim().toUpperCase();
  const s2 = (targetSize || 'M').trim().toUpperCase();
  if (s1 !== s2) return false;

  const p1 = item.product;
  if (p1.id && targetProduct.id && p1.id === targetProduct.id) return true;
  if (p1.slug && targetProduct.slug && p1.slug === targetProduct.slug) return true;
  if (p1.sku && targetProduct.sku && p1.sku === targetProduct.sku) return true;
  if (
    p1.title &&
    targetProduct.title &&
    p1.title.trim().toLowerCase() === targetProduct.title.trim().toLowerCase()
  ) {
    return true;
  }

  return false;
}

// Consolidate duplicate rows for same product + same size
function consolidateCart(items: CartItem[]): CartItem[] {
  const consolidated: CartItem[] = [];
  for (const item of items) {
    const existingIndex = consolidated.findIndex((c) =>
      isSameItem(c, item.product, item.size),
    );
    if (existingIndex > -1) {
      consolidated[existingIndex] = {
        ...consolidated[existingIndex],
        quantity: consolidated[existingIndex].quantity + item.quantity,
        product: { ...consolidated[existingIndex].product, ...item.product },
      };
    } else {
      consolidated.push({
        ...item,
        size: (item.size || 'M').trim().toUpperCase(),
      });
    }
  }
  return consolidated;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Load cart from localStorage and auto-consolidate
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('navigator_cart');
      if (savedCart) {
        const parsed: CartItem[] = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const clean = consolidateCart(parsed);
          setCart(clean);
        }
      }
      const savedCoupon = localStorage.getItem('navigator_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('navigator_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart]);

  // Save coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('navigator_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('navigator_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to storage', e);
    }
  }, [appliedCoupon]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Revalidate applied coupon when cart items/subtotal change
  useEffect(() => {
    if (appliedCoupon && cart.length > 0) {
      const revalidate = async () => {
        try {
          const itemsPayload = cart.map((i) => ({
            productId: i.product.id,
            categoryId: i.product.categoryId,
            quantity: i.quantity,
            price: i.product.price,
          }));

          const result = await fetchApi<CouponValidationResult>('/api/coupons/validate', {
            method: 'POST',
            body: JSON.stringify({
              code: appliedCoupon.code,
              cartTotal: subtotal,
              items: itemsPayload,
            }),
          });

          if (result.valid) {
            setAppliedCoupon(result);
            setCouponError(null);
          } else {
            setCouponError(result.message);
            setAppliedCoupon(null);
          }
        } catch {
          // keep or handle silently
        }
      };
      revalidate();
    } else if (cart.length === 0 && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponError(null);
    }
  }, [subtotal, cart.length]);

  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    const normalizedSize = (size || 'M').trim().toUpperCase();
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) =>
        isSameItem(item, product, normalizedSize),
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          product: { ...updated[existingIndex].product, ...product },
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          size: normalizedSize,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size = 'M') => {
    const normalizedSize = (size || 'M').trim().toUpperCase();
    setCart((prev) =>
      prev.filter(
        (item) =>
          !isSameItem(
            item,
            { id: productId, slug: productId, sku: productId },
            normalizedSize,
          ),
      ),
    );
  };

  const updateQuantity = (productId: string, quantity: number, size = 'M') => {
    const normalizedSize = (size || 'M').trim().toUpperCase();
    if (quantity <= 0) {
      removeFromCart(productId, normalizedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        isSameItem(
          item,
          { id: productId, slug: productId, sku: productId },
          normalizedSize,
        )
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponCodeInput('');
  };

  const applyCoupon = async (codeToApply?: string): Promise<boolean> => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    if (cart.length === 0) {
      setCouponError('Your cart is empty.');
      return false;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const itemsPayload = cart.map((i) => ({
        productId: i.product.id,
        categoryId: i.product.categoryId,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const result = await fetchApi<CouponValidationResult>('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code,
          cartTotal: subtotal,
          items: itemsPayload,
        }),
      });

      if (result.valid) {
        setAppliedCoupon(result);
        setCouponError(null);
        setCouponCodeInput('');
        return true;
      } else {
        setCouponError(result.message || 'Invalid coupon code.');
        setAppliedCoupon(null);
        return false;
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon.');
      setAppliedCoupon(null);
      return false;
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponCodeInput('');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        couponCodeInput,
        setCouponCodeInput,
        isApplyingCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
