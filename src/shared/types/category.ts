/**
 * Category related type definitions
 */

import { BaseEntity } from './base';

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