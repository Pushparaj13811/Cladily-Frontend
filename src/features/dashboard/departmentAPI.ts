import api from '@app/lib/api';
import { AxiosResponse } from 'axios';

// API endpoints
const API_URL = '/api/departments';

// Department type definition
export interface Department {
    id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Helper function to extract data from API response
 */
const extractData = <T>(response: AxiosResponse): T => {
    if (response?.data?.data) {
        return response.data.data;
    } else if (response?.data?.message) {
        return response.data.message;
    } else if (response?.data) {
        return response.data;
    }

    throw new Error('Invalid response format');
};

/**
 * Fetch all departments
 */
export const getAllDepartments = async (): Promise<Department[]> => {
    try {
        const response = await api.get(API_URL);
        // console.log("Raw departments API response:", response.data);

        // Handle different response formats
        let departments: Department[] = [];

        if (response.data?.success && response.data?.message) {
            departments = response.data.message;
        } else if (response.data?.data) {
            departments = response.data.data;
        } else if (Array.isArray(response.data)) {
            departments = response.data;
        }

        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

/**
 * Fetch a single department by ID
 * @param id Department ID
 */
export const getDepartmentById = async (id: string): Promise<Department> => {
    try {
        const response = await api.get(`${API_URL}/${id}`);
        return extractData<Department>(response);
    } catch (error) {
        console.error(`Error fetching department ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new department
 */
export const createDepartment = async (departmentData: { name: string; description?: string }): Promise<Department> => {
    try {
        const response = await api.post(API_URL, departmentData);
        return extractData<Department>(response);
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

/**
 * Update an existing department
 */
export const updateDepartment = async (id: string, departmentData: { name?: string; description?: string }): Promise<Department> => {
    try {
        const response = await api.put(`${API_URL}/${id}`, departmentData);
        return extractData<Department>(response);
    } catch (error) {
        console.error(`Error updating department ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a department
 * @param id Department ID
 */
export const deleteDepartment = async (id: string): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return;
    } catch (error) {
        console.error(`Error deleting department ${id}:`, error);
        throw error;
    }
}; 