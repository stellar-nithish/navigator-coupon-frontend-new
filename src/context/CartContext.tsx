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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('navigator_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
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
            // If now invalid (e.g. subtotal dropped below min order)
            setCouponError(result.message);
            setAppliedCoupon(null);
          }
        } catch {
          // Keep current or silently fail
        }
      };
      revalidate();
    } else if (cart.length === 0 && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponError(null);
    }
  }, [subtotal, cart.length]);

  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size,
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size = 'M') => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, quantity: number, size = 'M') => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item,
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
