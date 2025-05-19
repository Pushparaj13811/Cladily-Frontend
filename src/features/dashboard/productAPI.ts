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
    // console.log("Raw API response:", response.data);
    
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
    console.log(`Fetching product with ID: ${id}`);
    const response = await api.get(`${API_URL}/${id}`);
    console.log("Product by ID raw response:", response.data);
    
    // Handle different response formats
    let product = null;
    
    // Format: { success, statusCode, message: {...product data} }
    if (response.data?.success && response.data?.message) {
      if (typeof response.data.message === 'object' && response.data.message !== null) {
        console.log("Found product in response.data.message (object)");
        product = response.data.message;
      } else if (typeof response.data.message === 'string' && response.data.data && typeof response.data.data === 'object') {
        // If message is a string but data contains our object
        console.log("Found product in response.data.data (message is string)");
        product = response.data.data;
      }
    }
    // Format: { success, statusCode, data: {...product data} }
    else if (response.data?.success && response.data?.data && typeof response.data.data === 'object') {
      console.log("Found product in response.data.data");
      product = response.data.data;
    }
    // Format: {...product data} (direct object)
    else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("Found product directly in response.data");
      product = response.data;
    }
    
    console.log("Parsed product data:", product);
    
    if (!product) {
      console.error("Could not find product data in response:", response.data);
      throw new Error("Invalid product data format received from API");
    }
    
    if (typeof product === 'string') {
      console.error("Product data is a string, expected object:", product);
      throw new Error("Invalid product data format: received string instead of object");
    }
    
    if (!('id' in product)) {
      console.error("Product data does not have an ID property:", product);
      throw new Error("Invalid product data format: missing ID property");
    }
    
    // Check if images array is present
    if (!product.images) {
      console.warn("Product has no images array, initializing empty array");
      product.images = [];
    }
    
    return product as Product;
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
      
      // Handle different response formats
      let updatedProduct = null;
      
      if (response.data?.success && response.data?.message && typeof response.data.message === 'object') {
        updatedProduct = response.data.message;
      } else if (response.data?.success && response.data?.data && typeof response.data.data === 'object') {
        updatedProduct = response.data.data;
      } else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
        updatedProduct = response.data;
      }
      
      if (!updatedProduct || typeof updatedProduct === 'string' || !('id' in updatedProduct)) {
        throw new Error("Invalid product data format received from API");
      }
      
      return updatedProduct as Product;
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

/**
 * Fetch products by department ID
 * @param departmentId Department ID
 * @param options Options for filtering and pagination
 */
export const getProductsByDepartment = async (
  departmentId: string,
  options: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.status) queryParams.append('status', options.status);
    if (options.category) queryParams.append('category', options.category);
    if (options.search) queryParams.append('search', options.search);
    if (options.minPrice) queryParams.append('minPrice', options.minPrice.toString());
    if (options.maxPrice) queryParams.append('maxPrice', options.maxPrice.toString());
    if (options.sortBy) queryParams.append('sortBy', options.sortBy);
    if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
    
    const url = `/api/departments/${departmentId}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log(`Fetching products by department: ${url}`);
    
    const response = await api.get(url);
    console.log("Department products response:", response.data);
    
    // Handle different response formats
    let result = { products: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    
    if (response.data?.success && response.data?.message) {
      result = response.data.message;
    } else if (response.data) {
      result = response.data;
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching products for department ${departmentId}:`, error);
    throw error;
  }
};