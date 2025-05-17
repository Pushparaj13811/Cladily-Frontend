import { Route } from 'react-router-dom';
import { HomePage } from '@pages/Home';
import { ProductsPage } from '@pages/Products';
import { ProductDetailPage } from '@pages/ProductDetail';
import { CartPage } from '@pages/Cart';
import { CheckoutPage } from '@pages/Checkout';
import { ThankYouPage } from '@pages/ThankYou';

/**
 * MainRoutes - Component containing all public main routes
 */
export const MainRoutes = () => {
  return (
    <>
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
    </>
  );
}; 