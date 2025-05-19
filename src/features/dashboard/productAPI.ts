import api from '../../app/lib/api';
import { Product, CreateProductDto, UpdateProductDto } from '@shared/types';
import { AxiosResponse } from 'axios';

// API endpoints
const API_URL = '/api/products';

/**
 * Helper function to extract data from API response
 */
const extractData = <T>(response: AxiosResponse): T => {
  // Handle different response formats
  if (response?.data?.data) {
    return response.data.data;
  } else if (response?.data) {
    return response.data;
  }
  
  throw new Error('Invalid response format');
};

/**
 * Fetch all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get(API_URL);
    console.log("Raw API response:", response.data);
    
    // Check for different response formats in a consistent way
    let products: Product[] = [];
    
    // Format: { success, statusCode, message: { products: [...], pagination: {...} } }
    if (response.data?.success && response.data?.message?.products) {
      console.log("Found products in response.data.message.products");
      products = response.data.message.products;
    }
    // Format: { success, statusCode, message, data: { products: [...], pagination: {...} } }
    else if (response.data?.success && response.data?.data?.products) {
      console.log("Found products in response.data.data.products");
      products = response.data.data.products;
    }
    // Format: { success, statusCode, message, data: [...] }
    else if (response.data?.success && Array.isArray(response.data.data)) {
      console.log("Found products in response.data.data (array)");
      products = response.data.data;
    }
    // Format: { products: [...], pagination: {...} }
    else if (response.data?.products && Array.isArray(response.data.products)) {
      console.log("Found products in response.data.products");
      products = response.data.products;
    }
    // Format: [...] (direct array)
    else if (Array.isArray(response.data)) {
      console.log("Found products as direct array");
      products = response.data;
    }
    // Last resort: check if response.data is a valid Product object
    else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("Found single product in response.data");
      products = [response.data as Product];
    }
    
    if (products.length > 0) {
      console.log(`Successfully parsed ${products.length} products`);
      return products;
    }
    
    console.error("Unexpected API response format, couldn't find products:", response.data);
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
    return extractData<Product>(response);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData: CreateProductDto, imageFiles?: File[]): Promise<Product> => {
  try {
    // Log the data being sent to help diagnose issues
    console.log('Creating product with data:', JSON.stringify(productData, null, 2));
    console.log('Image files:', imageFiles?.length || 0);
    
    // Check if we have image files to upload
    if (imageFiles && imageFiles.length > 0) {
      // Use FormData to send files
      const formData = new FormData();
      
      // Make sure numeric values are properly formatted
      const preparedData = { ...productData };
      
      // Convert price to number if it's a string
      if (typeof preparedData.price === 'string') {
        const numericPrice = parseFloat(preparedData.price);
        if (!isNaN(numericPrice)) {
          preparedData.price = numericPrice as unknown as string;
        }
      }
      
      // Add product data as JSON
      formData.append('productData', JSON.stringify(preparedData));
      
      // Add individual fields for maximum compatibility
      Object.keys(preparedData).forEach(key => {
        const value = preparedData[key as keyof typeof preparedData];
        
        // Skip null/undefined values and the complete productData object
        if (value === null || value === undefined) return;
        
        // For arrays and objects, stringify them
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          // For primitive values, convert to string
          formData.append(key, String(value));
        }
      });
      
      // Add image files
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      console.log('Sending multipart form data with images');
      const response = await api.post(`${API_URL}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product creation response:', response.data);
      return extractData<Product>(response);
    } else {
      // Standard JSON request if no files
      console.log('Sending JSON data directly');
      const response = await api.post(`${API_URL}/`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Product creation response:', response.data);
      return extractData<Product>(response);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  productId: string, 
  productData: UpdateProductDto,
  imageFiles?: File[],
  deleteImageIds?: string[]
): Promise<Product> => {
  try {
    // Check if we have image files to upload or images to delete
    if ((imageFiles && imageFiles.length > 0) || (deleteImageIds && deleteImageIds.length > 0)) {
      // Use FormData to send files
      const formData = new FormData();
      
      // Add product data as JSON
      formData.append('productData', JSON.stringify(productData));
      
      // Add image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Add image IDs to delete
      if (deleteImageIds && deleteImageIds.length > 0) {
        formData.append('deleteImageIds', JSON.stringify(deleteImageIds));
      }
      
      const response = await api.put(`${API_URL}/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return extractData<Product>(response);
    } else {
      // Standard JSON request if no files
      const response = await api.put(`${API_URL}/${productId}`, productData);
      return extractData<Product>(response);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
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