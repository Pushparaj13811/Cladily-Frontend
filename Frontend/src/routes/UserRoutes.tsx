import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { UserRoute } from '@app/components/ProtectedRoute';
import { 
  UserDashboardPage,
  WishlistPage,
  OrdersPage,
  ProfilePage
} from '@pages/Account';

/**
 * UserRoutes - Component containing all user account related routes
 * All routes are protected and require user authentication
 */
export const UserRoutes = () => {
  return (
    <Fragment>
      {/* User Account Pages - Protected Routes */}
      <Route 
        path="/account" 
        element={
          <UserRoute>
            <UserDashboardPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/profile" 
        element={
          <UserRoute>
            <ProfilePage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/orders" 
        element={
          <UserRoute>
            <OrdersPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/wishlist" 
        element={
          <UserRoute>
            <WishlistPage />
          </UserRoute>
        } 
      />
    </Fragment>
  );
}; 