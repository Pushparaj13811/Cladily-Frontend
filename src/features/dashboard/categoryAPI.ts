import api from '@app/lib/api';
import { Category, UpdateCategoryDto, Department } from '@shared/types';
import { getAllDepartments } from './departmentAPI';

// API base URL
const API_URL = "/api/categories";


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
 * Fetch categories filtered by department
 */
export const getCategoriesByDepartment = async (department: Department | string): Promise<Category[]> => {
  try {
    // Convert department enum to ID if needed
    let departmentId = department;
    if (typeof department === 'string' && !department.startsWith('uuid')) {
      // If it's a department name, get the ID first
      const departments = await getAllDepartments();
      const dept = departments.find((d: { id: string; name: string }) => d.name === department);
      if (!dept) {
        throw new Error(`Department ${department} not found`);
      }
      departmentId = dept.id;
    }

    // Fetch categories for the specific department
    const response = await api.get(`/api/departments/${departmentId}/categories`);
    
    if (!response.data?.success) {
      throw new Error('Failed to fetch categories');
    }

    return response.data.message;
  } catch (error) {
    console.error(`Error fetching categories for department ${department}:`, error);
    throw new Error(`Failed to fetch categories for department ${department}`);
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
    console.log(`Fetching category with ID: ${id}`);
    const response = await api.get(`/api/categories/id/${id}`);
    console.log("Category by ID response:", response.data);
    
    // Handle different response formats
    let category = null;
    
    // Format: { success, statusCode, message: {...category data} }
    if (response.data?.success && response.data?.message && typeof response.data.message === 'object') {
      console.log("Found category in response.data.message");
      category = response.data.message;
    }
    // Format: { success, statusCode, data: {...category data} }
    else if (response.data?.success && response.data?.data && typeof response.data.data === 'object') {
      console.log("Found category in response.data.data");
      category = response.data.data;
    }
    // Format: {...category data} (direct object)
    else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("Found category directly in response.data");
      category = response.data;
    }
    
    if (!category || typeof category === 'string' || !('id' in category)) {
      console.error("Invalid category data format:", category);
      throw new Error("Failed to fetch category");
    }
    
    return category as Category;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw new Error("Failed to fetch category");
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
export const createCategory = async (categoryData: Category): Promise<Category> => {
  try {
    const response = await api.post('/api/categories', categoryData);
    console.log("Create category response:", response.data);
    
    // Handle different response formats
    let category = null;
    
    // Format: { success, statusCode, message: {...category data} }
    if (response.data?.success && response.data?.message && typeof response.data.message === 'object') {
      console.log("Found created category in response.data.message");
      category = response.data.message;
    }
    // Format: { success, statusCode, data: {...category data} }
    else if (response.data?.success && response.data?.data && typeof response.data.data === 'object') {
      console.log("Found created category in response.data.data");
      category = response.data.data;
    }
    // Format: {...category data} (direct object)
    else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("Found created category directly in response.data");
      category = response.data;
    }
    
    if (!category || typeof category === 'string' || !('id' in category)) {
      console.error("Invalid created category data format:", category);
      throw new Error("Failed to create category");
    }
    
    return category as Category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error("Failed to create category");
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