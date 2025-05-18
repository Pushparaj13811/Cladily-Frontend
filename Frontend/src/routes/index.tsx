import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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
import { useAuth, UserRole } from '@app/providers/auth-provider';
import { AdminDashboardPage } from '@pages/Admin/Dashboard';
import DashboardPage from '@pages/Account/ui/DashboardPage';
import { PageTransition } from '@app/components/ui/motion';

// Admin pages imports
import ProductsManagementPage from '@pages/Admin/Products/ui/ProductsManagementPage';
import ProductEditPage from '@pages/Admin/Products/ui/ProductEditPage';
import CategoriesManagementPage from '@pages/Admin/Categories/ui/CategoriesManagementPage';
import CategoryEditPage from '@pages/Admin/Categories/ui/CategoryEditPage';
import OrdersManagementPage from '@pages/Admin/Orders/ui/OrdersManagementPage';
import OrderDetailPage from '@pages/Admin/Orders/ui/OrderDetailPage';
import DiscountsManagementPage from '@pages/Admin/Discounts/ui/DiscountsManagementPage';
import DiscountEditPage from '@pages/Admin/Discounts/ui/DiscountEditPage';
import CouponsManagementPage from '@pages/Admin/Coupons/ui/CouponsManagementPage';
import CouponEditPage from '@pages/Admin/Coupons/ui/CouponEditPage';
import DiscountCreatePage from '@pages/Admin/Discounts/ui/DiscountCreatePage';

// Account page imports
import CreditsPage from '@pages/Account/Credits/ui/CreditsPage';
import DetailsPage from '@pages/Account/Details/ui/DetailsPage';
import AddressBookPage from '@pages/Account/AddressBook/ui/AddressBookPage';
import ShoppingPreferencesPage from '@pages/Account/ShoppingPreferences/ui/ShoppingPreferencesPage';
import CommunicationPreferencesPage from '@pages/Account/Communication/ui/CommunicationPreferencesPage';

/**
 * AnonymousRoute - Component that redirects to account page if user is already authenticated
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
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === UserRole.ADMIN;
  
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        {/* Main Pages - Redirect admin users to admin dashboard */}
        <Route path="/" element={
          isAdmin ? <Navigate to="/admin" replace /> : <HomePage />
        } />
        
        {/* Shopping pages - Only for non-admin users */}
        <Route path="/products" element={
          isAdmin ? <Navigate to="/admin/products" replace /> : <ProductsPage />
        } />
        <Route path="/products/:id" element={
          isAdmin ? <Navigate to="/admin/products" replace /> : <ProductDetailPage />
        } />
        <Route path="/cart" element={
          isAdmin ? <Navigate to="/admin" replace /> : <CartPage />
        } />
        <Route path="/checkout" element={
          isAdmin ? <Navigate to="/admin" replace /> : <CheckoutPage />
        } />
        <Route path="/thank-you" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ThankYouPage />
        } />
        
        {/* Category Pages - Only for non-admin users */}
        <Route path="/menswear" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />
        <Route path="/menswear/:category" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />
        <Route path="/womenswear" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />
        <Route path="/womenswear/:category" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />
        <Route path="/kidswear" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />
        <Route path="/kidswear/:category" element={
          isAdmin ? <Navigate to="/admin" replace /> : <ProductsPage />
        } />

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
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="credits" element={<CreditsPage />} />
          <Route path="details" element={<DetailsPage />} />
          <Route path="addresses" element={<AddressBookPage />} />
          <Route path="shopping-preferences" element={<ShoppingPreferencesPage />} />
          <Route path="communication-preferences" element={<CommunicationPreferencesPage />} />
        </Route>
        
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
        
        {/* New discount and coupon management routes */}
        <Route 
          path="/admin/discounts" 
          element={
            <AdminRoute>
              <DiscountsManagementPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/discounts/new" 
          element={
            <AdminRoute>
              <DiscountCreatePage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/discounts/:id" 
          element={
            <AdminRoute>
              <DiscountEditPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/coupons" 
          element={
            <AdminRoute>
              <CouponsManagementPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/coupons/new" 
          element={
            <AdminRoute>
              <CouponEditPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/coupons/:id" 
          element={
            <AdminRoute>
              <CouponEditPage />
            </AdminRoute>
          } 
        />
      </Routes>
    </PageTransition>
  );
}; 