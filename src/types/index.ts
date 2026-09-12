export type CompanyStatus = 'ACTIVE' | 'INACTIVE';
export type DiscountType = 'FIXED' | 'PERCENTAGE';
export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'USAGE_LIMIT_REACHED';
export type EligibilityType = 'ALL' | 'CATEGORY' | 'PRODUCT';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Company {
  id: string;
  name: string;
  code: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
  totalCoupons?: number;
  activeCoupons?: number;
  totalRedemptions?: number;
  totalDiscountGiven?: number;
  coupons?: Coupon[];
}

export interface Coupon {
  id: string;
  companyId: string;
  code: string;
  type: DiscountType;
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startsAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  computedStatus?: string;
  eligibilityType: EligibilityType;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  remainingUsage?: number | null;
  totalDiscountGiven?: number;
  usages?: CouponUsage[];
  eligibleCategories?: { categoryId: string; category?: Category }[];
  eligibleProducts?: { productId: string; product?: Product }[];
  _count?: { usages: number };
}

export interface CouponUsage {
  id: string;
  couponId: string;
  companyId: string;
  orderId: string;
  customerId?: string | null;
  customerEmail?: string | null;
  orderAmount: number;
  discountAmount: number;
  redeemedAt: string;
  coupon?: Coupon;
  company?: Company;
  order?: Order;
  customer?: Customer | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  stock: number;
  fabric?: string | null;
  color?: string | null;
  colourHex?: string | null;
  images: string | string[];
  details?: string | string[] | null;
  fabricCare?: string | null;
  badge?: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size?: string | null;
  subtotal: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerEmail: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  shippingAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  couponUsage?: CouponUsage | null;
  customer?: Customer | null;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  couponId?: string;
  companyId?: string;
  companyName?: string;
  discountType?: DiscountType;
  discountValue?: number;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  reason?: string;
  message: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}
