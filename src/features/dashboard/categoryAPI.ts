import api from '../../app/lib/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@shared/types';

// API endpoints
const API_URL = '/api/categories';

/**
 * Fetch all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get(API_URL);
    return response.data.data;
};

/**
 * Fetch a single category by ID
 * @param id Category ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
    const response = await api.get(`${API_URL}/id/${id}`);
    return response.data.data;
};

/**
 * Fetch category by Slug
 * @param slug 
 * @returns 
 */

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
    const response = await api.get(`${API_URL}/slug/${slug}`)
    return response.data.data;
}
/**
 * Create a new category
 * @param categoryData Category data
 */
export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
    const response = await api.post(API_URL, categoryData);
    return response.data.data;
};

/**
 * Update an existing category
 * @param id Category ID
 * @param categoryData Updated category data
 */
export const updateCategory = async (id: string, categoryData: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put(`${API_URL}/${id}`, categoryData);
    return response.data.data;
};

/**
 * Delete a category
 * @param id Category ID
 */
export const deleteCategory = async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
    return;
}; 