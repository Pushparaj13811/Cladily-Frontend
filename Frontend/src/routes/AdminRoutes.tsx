import  { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from '@app/components/ProtectedRoute';
import { AdminDashboardPage } from '@pages/Account';

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
      <Route 
        path="/admin/products" 
        element={
          <AdminRoute>
            <div>Admin Products Management</div>
          </AdminRoute>
        } 
      />
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