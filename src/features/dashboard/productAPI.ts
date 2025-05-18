import api from '../../app/lib/api';
import { Product, CreateProductDto, UpdateProductDto } from '@shared/types';

// API endpoints
const API_URL = '/api/products';

/**
 * Fetch all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get(API_URL);
    let data;
    
    // Check response.data.data first (common pattern)
    if (response?.data?.data) {
      data = response.data.data;
    } else if (response?.data) {
      data = response.data;
    } else {
      data = response;
    }
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // Check if products are in a nested property
      if ('products' in data && Array.isArray(data.products)) {
        return data.products;
      }
      // If data is an object with product-like properties, wrap in array
      if ('id' in data && 'name' in data) {
        return [data as Product];
      }
    }
    
    // If we can't find products, return empty array
    console.warn('Unexpected API response format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param id Product ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    
    // Handle different response formats
    if (response?.data?.data) {
      return response.data.data;
    } else if (response?.data) {
      return response.data;
    } 
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 * @param productData Product data
 */
export const createProduct = async (productData: CreateProductDto): Promise<Product> => {
  try {
    const response = await api.post(API_URL, productData);
    
    // Handle different response formats
    if (response?.data?.data) {
      return response.data.data;
    } else if (response?.data) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param id Product ID
 * @param productData Updated product data
 */
export const updateProduct = async (id: string, productData: UpdateProductDto): Promise<Product> => {
  try {
    const response = await api.put(`${API_URL}/${id}`, productData);
    
    // Handle different response formats
    if (response?.data?.data) {
      return response.data.data;
    } else if (response?.data) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product
 * @param id Product ID
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`);
    return;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}; 