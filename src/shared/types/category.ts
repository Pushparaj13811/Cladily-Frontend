/**
 * Category related type definitions
 */

/**
 * Represents a product category
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new category
 */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
}

/**
 * DTO for updating an existing category
 */
export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
} 