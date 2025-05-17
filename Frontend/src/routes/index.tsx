import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HomePage } from '@pages/Home';
import { ProductsPage } from '@pages/Products';
import { ProductDetailPage } from '@pages/ProductDetail';
import { CartPage } from '@pages/Cart';
import { CheckoutPage } from '@pages/Checkout';
import { ThankYouPage } from '@pages/ThankYou';
import { 
  LoginPage, 
  SignupPage, 
  ForgotPasswordPage, 
  ResetPasswordPage 
} from '@pages/Auth';
import { UserRoute, AdminRoute } from '@app/components/ProtectedRoute';
import { 
  WishlistPage,
  OrdersPage,
  ProfilePage,
} from '@pages/Account';
import { useAuth } from '@app/providers/auth-provider';
import { AdminDashboardPage } from '@pages/Admin/Dashboard';

// Admin pages imports
import ProductsManagementPage from '@pages/Admin/Products/ui/ProductsManagementPage';
import ProductEditPage from '@pages/Admin/Products/ui/ProductEditPage';
import CategoriesManagementPage from '@pages/Admin/Categories/ui/CategoriesManagementPage';
import CategoryEditPage from '@pages/Admin/Categories/ui/CategoryEditPage';
import OrdersManagementPage from '@pages/Admin/Orders/ui/OrdersManagementPage';
import OrderDetailPage from '@pages/Admin/Orders/ui/OrderDetailPage';

// Account page imports
import CreditsPage from '@pages/Account/Credits/ui/CreditsPage';
import DetailsPage from '@pages/Account/Details/ui/DetailsPage';
import AddressBookPage from '@pages/Account/AddressBook/ui/AddressBookPage';
import ShoppingPreferencesPage from '@pages/Account/ShoppingPreferences/ui/ShoppingPreferencesPage';
import CommunicationPreferencesPage from '@pages/Account/Communication/ui/CommunicationPreferencesPage';

/**
 * AnonymousRoute - Component to prevent authenticated users from accessing pages like login
 * Redirects to account page if user is already authenticated
 */
const AnonymousRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }
  
  return <>{children}</>;
};

/**
 * AppRoutes - Main component containing all application routes
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      
      {/* Category Pages */}
      <Route path="/menswear" element={<ProductsPage />} />
      <Route path="/menswear/:category" element={<ProductsPage />} />
      <Route path="/womenswear" element={<ProductsPage />} />
      <Route path="/womenswear/:category" element={<ProductsPage />} />
      <Route path="/kidswear" element={<ProductsPage />} />
      <Route path="/kidswear/:category" element={<ProductsPage />} />

      {/* Auth Pages - Only accessible if not logged in */}
      <Route 
        path="/login" 
        element={
          <AnonymousRoute>
            <LoginPage />
          </AnonymousRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <AnonymousRoute>
            <SignupPage />
          </AnonymousRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <AnonymousRoute>
            <ForgotPasswordPage />
          </AnonymousRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <AnonymousRoute>
            <ResetPasswordPage />
          </AnonymousRoute>
        } 
      />
      
      {/* User Account Pages - Protected Routes */}
      <Route 
        path="/account" 
        element={
          <UserRoute>
            <Outlet />
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
      <Route 
        path="/account/credits" 
        element={
          <UserRoute>
            <CreditsPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/details" 
        element={
          <UserRoute>
            <DetailsPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/addresses" 
        element={
          <UserRoute>
            <AddressBookPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/shopping-preferences" 
        element={
          <UserRoute>
            <ShoppingPreferencesPage />
          </UserRoute>
        } 
      />
      <Route 
        path="/account/communication-preferences" 
        element={
          <UserRoute>
            <CommunicationPreferencesPage />
          </UserRoute>
        } 
      />
      
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
        path="/admin/dashboard" 
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
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <OrdersManagementPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders/:id" 
        element={
          <AdminRoute>
            <OrderDetailPage />
          </AdminRoute>
        } 
      />
    </Routes>
  );
}; 