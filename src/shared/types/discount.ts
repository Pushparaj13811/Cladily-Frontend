/**
 * Types for discounts and coupons
 */

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping'
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

export enum ApplicabilityScope {
  ALL_PRODUCTS = 'all_products',
  SPECIFIC_PRODUCTS = 'specific_products',
  SPECIFIC_CATEGORIES = 'specific_categories',
  SPECIFIC_COLLECTIONS = 'specific_collections'
}

export enum DiscountStatus {
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  EXPIRED = 'expired',
  INACTIVE = 'inactive'
}

/**
 * Base discount properties shared by both discounts and coupons
 */
interface BaseDiscountProperties {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  status: DiscountStatus;
  createdAt: string;
  updatedAt: string;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
}

/**
 * Discount entity
 */
export interface Discount extends BaseDiscountProperties {
  type: DiscountType;
  value: number; // Percentage or fixed amount
  applicabilityScope: ApplicabilityScope;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  applicableCollectionIds?: string[];
  priority: number;
  isAutomaticallyApplied: boolean;
  // For buy X get Y discounts
  buyQuantity?: number;
  getQuantity?: number;
}

/**
 * Coupon entity
 */
export interface Coupon extends BaseDiscountProperties {
  type: CouponType;
  code: string;
  value: number; // Percentage or fixed amount
  applicabilityScope: ApplicabilityScope;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  applicableCollectionIds?: string[];
  priority: number;
  isAutomaticallyApplied: boolean;
  isOneTimeUse: boolean;
  customerUsageLimit?: number;
  isFirstPurchaseOnly?: boolean;
} 