/**
 * Type definitions for products
 */

/**
 * Represents a product item 
 */
export interface Product {
  id: number | string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string | null;
  discount?: string | null;
  image: string;
  description?: string;
  material?: string;
  care?: string[];
  features?: string[];
  sizes?: string[];
  colors?: Array<{name: string, code: string}>;
  category?: string;
  subcategory?: string;
  rating?: number;
  ratingCount?: number;
  deliveryInfo?: string;
  inStock?: boolean;
  images?: string[];
}

/**
 * Props for the ProductCard component
 */
export interface ProductCardProps {
  id: number | string;
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
export interface ProductCategory {
  title: string;
  image: string;
  link: string;
} 