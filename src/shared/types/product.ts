/**
 * Type definitions for products
 */

export enum WeightUnit {
  GRAMS = 'GRAMS',
  KILOGRAMS = 'KILOGRAMS',
  POUNDS = 'POUNDS',
  OUNCES = 'OUNCES'
}

export interface ProductColor {
  name: string;
  code: string;
}

/**
 * Represents a product item 
 */
export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: string;
  originalPrice: string | null;
  image: string;
  featuredImageUrl?: string;
  discount: string | null;
  department: string;
  description: string;
  shortDescription?: string;
  material: string;
  care: string[];
  features: string[];
  sizes: string[];
  colors: ProductColor[];
  category: string;
  subcategory: string;
  rating: number;
  ratingCount: number;
  deliveryInfo: string;
  inStock: boolean;
  status?: string;
  images: string[];
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: WeightUnit;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * Represents a product variant option
 */
export interface ProductVariant {
  id?: string;
  name: string;
  sku?: string;
  barcode?: string;
  price?: string;
  compareAtPrice?: string;
  position: number;
  options: Record<string, string>; // E.g., {size: "S", color: "Red"}
  imageUrl?: string;
  inventoryQuantity: number;
  backorder: boolean;
  requiresShipping: boolean;
}

/**
 * DTO for creating a new product
 */
export interface CreateProductDto {
  name: string;
  slug?: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  discount?: string | null;
  department: string;
  description: string;
  shortDescription?: string;
  material: string;
  care: string[];
  features: string[];
  sizes: string[];
  colors: ProductColor[];
  category: string;
  categoryIds?: string[];
  subcategory: string;
  deliveryInfo: string;
  inStock: boolean;
  images: string[];
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: WeightUnit;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants?: ProductVariant[];
  hasVariants?: boolean;
}

/**
 * DTO for updating an existing product
 */
export interface UpdateProductDto {
  name?: string;
  slug?: string;
  price?: string;
  originalPrice?: string | null;
  image?: string;
  discount?: string | null;
  department?: string;
  description?: string;
  shortDescription?: string;
  material?: string;
  care?: string[];
  features?: string[];
  sizes?: string[];
  colors?: ProductColor[];
  category?: string;
  categoryIds?: string[];
  subcategory?: string;
  deliveryInfo?: string;
  inStock?: boolean;
  images?: string[];
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: WeightUnit;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  variants?: ProductVariant[];
  hasVariants?: boolean;
}

/**
 * Props for the ProductCard component
 */
export interface ProductCardProps {
  id: number;
  name: string;
  department: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  isNew?: boolean;
  rating?: number;
}

/**
 * Represents a product category
 */
export interface CategoryImage {
  title: string;
  image: string;
  link: string;
}

/**
 * Represents the sale banner data
 */
export interface SaleBanner {
  title: string;
  ctaWomen: string;
  ctaMen: string;
  hrefWomen: string;
  hrefMen: string;
}