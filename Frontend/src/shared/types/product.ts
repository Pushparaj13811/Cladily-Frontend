/**
 * Type definitions for products
 */

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
  price: string;
  originalPrice: string | null;
  image: string;
  discount: string | null;
  department: string;
  description: string;
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
  images: string[];
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