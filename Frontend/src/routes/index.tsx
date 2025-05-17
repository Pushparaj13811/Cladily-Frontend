import { Routes } from 'react-router-dom';
import { MainRoutes } from './MainRoutes';
import { AuthRoutes } from './AuthRoutes';
import { UserRoutes } from './UserRoutes';
import { AdminRoutes } from './AdminRoutes';

/**
 * AppRoutes - Main component that combines all route groups
 */
export const AppRoutes = () => {
  return (
    <Routes>
      <MainRoutes />
      <AuthRoutes />
      <UserRoutes />
      <AdminRoutes />
    </Routes>
  );
}; 