import { createApiInstance } from '../../app/lib/apiUtils';

// Create API client for auth requests
const api = createApiInstance();

export const fetchUserDebugInfo = async () => {
  const response = await api.get('/api/auth/debug');
  return response.data.data;
};

export const testAdminAccess = async () => {
  const response = await api.get('/api/auth/admin-test');
  return response.data.data;
}; 