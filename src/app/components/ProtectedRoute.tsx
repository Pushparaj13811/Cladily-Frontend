import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@app/providers/auth-provider';

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
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const location = useLocation();

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
    <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]} redirectPath="/login">
      {children}
    </ProtectedRoute>
  );
}; 