import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAuth } from '@app/hooks/useAppRedux';
import { getUserProfile } from '@features/auth/authSlice';

// Define roles enum for type safety
export enum UserRole {
  USER = 'user',
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectPath?: string;
}

/**
 * ProtectedRoute component - Controls access to routes based on user roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = '/login',
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, token } = useAuth();

  useEffect(() => {
    // If authenticated but no user data, fetch the user profile
    if (isAuthenticated && token && !user) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, token, user, dispatch]);

  // Helper function to check if user has allowed role
  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role?.toLowerCase();
    
    console.log("ProtectedRoute - User role:", user.role);
    console.log("ProtectedRoute - Allowed roles:", roles);
    
    // Check if any allowed role matches the user's role
    return roles.some(role => {
      const allowedRole = role.toString().toLowerCase();
      const hasAccess = userRole === allowedRole || 
        // Special case: 'customer' role should have the same access as 'user'
        (userRole === 'customer' && allowedRole === 'user');
      
      console.log(`Checking ${userRole} against ${allowedRole}: ${hasAccess}`);
      return hasAccess;
    });
  };

  // Show loading state if auth is still being verified
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user isn't authenticated or doesn't have the required role, redirect
  if (!isAuthenticated || !hasRole(allowedRoles)) {
    // Save the attempted URL for redirecting after login
    const returnTo = encodeURIComponent(location.pathname + location.search);
    
    return <Navigate to={`${redirectPath}?returnTo=${returnTo}`} replace />;
  }

  // Render the protected children
  return <>{children}</>;
};

/**
 * AdminRoute - Specialized protected route for admin-only access
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} redirectPath="/">
      {children}
    </ProtectedRoute>
  );
};

/**
 * UserRoute - Specialized protected route for authenticated users
 */
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN]} redirectPath="/login">
      {children}
    </ProtectedRoute>
  );
}; 