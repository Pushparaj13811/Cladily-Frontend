import  { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from '@app/components/ProtectedRoute';
import { AdminDashboardPage } from '@pages/Admin/Dashboard';
import { ProductsManagementPage, ProductEditPage } from '@pages/Admin/Products';
import CategoryEditPage from '@pages/Admin/Categories/ui/CategoryEditPage';
import CategoriesManagementPage from '@pages/Admin/Categories/ui/CategoriesManagementPage';

/**
 * AdminRoutes - Component containing all admin related routes
 * All routes are protected and require admin authentication
 */
export const AdminRoutes = () => {
  return (
    <Fragment>
      {/* Admin Pages - Protected Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } 
      />
      
      {/* Product routes */}
      <Route 
        path="/admin/products" 
        element={
          <AdminRoute>
            <ProductsManagementPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/products/new" 
        element={
          <AdminRoute>
            <ProductEditPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/products/:id" 
        element={
          <AdminRoute>
            <ProductEditPage />
          </AdminRoute>
        } 
      />
      
      {/* Category routes */}
      <Route 
        path="/admin/categories" 
        element={
          <AdminRoute>
            <CategoriesManagementPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/categories/new" 
        element={
          <AdminRoute>
            <CategoryEditPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/categories/:id" 
        element={
          <AdminRoute>
            <CategoryEditPage />
          </AdminRoute>
        } 
      />
      
      {/* Other admin routes */}
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <div>Admin Orders Management</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/customers" 
        element={
          <AdminRoute>
            <div>Admin Customers Management</div>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminRoute>
            <div>Admin Settings</div>
          </AdminRoute>
        } 
      />
    </Fragment>
  );
}; 