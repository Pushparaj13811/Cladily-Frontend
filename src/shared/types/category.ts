/**
 * Category related type definitions
 */

import { BaseEntity } from './base';

/**
 * Department enum for categorizing products
 */
export enum Department {
  Menswear = "Menswear",
  Womenswear = "Womenswear",
  Kidswear = "Kidswear"
}

/**
 * Department interface representing a department entity
 */
export interface DepartmentType extends BaseEntity {
  /** Department name */
  name: string;
  
  /** URL-friendly slug */
  slug: string;
  
  /** Optional department description */
  description?: string;
  
  /** Categories that belong to this department */
  categories?: Category[];
}

/**
 * Category interface representing a product category
 */
export interface Category extends BaseEntity {
  /** Category name */
  name: string;
  
  /** URL-friendly slug */
  slug: string;
  
  /** Optional category description */
  description?: string;
  
  /** Parent category ID (null for root categories) */
  parentId?: string | null;
  
  /** Path in category tree (e.g., /1/5/12/) */
  path?: string;
  
  /** Depth level in category hierarchy (0 for root) */
  level?: number;
  
  /** Whether category is active */
  isActive: boolean;
  
  /** Whether category is visible in navigation */
  isVisible: boolean;
  
  /** Department the category belongs to */
  department?: Department;
  
  /** SEO meta title */
  metaTitle?: string;
  
  /** SEO meta description */
  metaDescription?: string;
  
  /** SEO meta keywords */
  metaKeywords?: string;
  
  /** Main category image URL */
  imageUrl?: string;
  
  /** Category icon URL */
  iconUrl?: string;
  
  /** Sort order (higher numbers appear first) */
  position: number;
  
  /** Count of products in this category */
  productsCount?: number;
  
  /** Count of direct child categories */
  childrenCount?: number;
}

/**
 * Data transfer object for creating a new category
 */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  department?: Department | string;
  isActive?: boolean;
  isVisible?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  imageUrl?: string;
  iconUrl?: string;
  position?: number;
}

/**
 * Data transfer object for updating a category
 * All fields are optional to allow partial updates
 */
export type UpdateCategoryDto = Partial<CreateCategoryDto>; 