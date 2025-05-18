import api from '@app/lib/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@shared/types';

// API base URL
const API_URL = "/api/categories";

// API error response interface
interface ApiErrorResponse {
  data?: {
    message?: string;
    statusCode?: number;
    success?: boolean;
  };
  status?: number;
  statusText?: string;
}

/**
 * Extract data from API response
 */
const extractData = <T>(response: unknown): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    const responseObj = response as Record<string, unknown>;
    
    if (responseObj.data && typeof responseObj.data === 'object' && 'data' in responseObj.data) {
      return (responseObj.data as Record<string, unknown>).data as T;
    }
    
    return responseObj.data as T;
  }
  
  return response as T;
};

/**
 * Fetch all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`${API_URL}/`);
    return extractData<Category[]>(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Fetch category hierarchy as a tree structure
 */
export const getCategoryHierarchy = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`${API_URL}/hierarchy`);
    return extractData<Category[]>(response);
  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    throw new Error('Failed to fetch category hierarchy');
  }
};

/**
 * Fetch root categories only (categories without parents)
 */
export const getRootCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`${API_URL}/roots`);
    return extractData<Category[]>(response);
  } catch (error) {
    console.error('Error fetching root categories:', error);
    throw new Error('Failed to fetch root categories');
  }
};

/**
 * Fetch subcategories for a specific parent category
 */
export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  try {
    const response = await api.get(`${API_URL}/parent/${parentId}`);
    return extractData<Category[]>(response);
  } catch (error) {
    console.error(`Error fetching subcategories for parent ${parentId}:`, error);
    throw new Error('Failed to fetch subcategories');
  }
};

/**
 * Fetch a category by ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get(`${API_URL}/id/${id}`);
    return extractData<Category>(response);
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw new Error('Failed to fetch category');
  }
};

/**
 * Fetch a category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const response = await api.get(`${API_URL}/slug/${slug}`);
    return extractData<Category>(response);
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    throw new Error('Failed to fetch category');
  }
};

/**
 * Create a new category
 */
export const createCategory = async (category: CreateCategoryDto): Promise<Category> => {
  try {
    console.log("Sending category data to API:", category);
    const response = await api.post(`${API_URL}`, category);
    return extractData<Category>(response);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('API Error response:', error.response);
      
      // Extract the specific error message from the response if available
      const errorResponse = error.response as ApiErrorResponse;
      if (errorResponse?.data?.message) {
        throw new Error(errorResponse.data.message);
      }
    }
    throw new Error('Failed to create category');
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: string, category: UpdateCategoryDto): Promise<Category> => {
  try {
    const response = await api.put(`${API_URL}/${id}`, category);
    return extractData<Category>(response);
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw new Error('Failed to update category');
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw new Error('Failed to delete category');
  }
}; 