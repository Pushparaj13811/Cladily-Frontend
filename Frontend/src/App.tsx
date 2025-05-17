import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@app/providers/theme-provider';
import { Navbar } from '@widgets/Navbar';
import { Footer } from '@widgets/Footer';
import { HomePage } from '@pages/Home';
import { ProductsPage } from '@pages/Products';
import { ProductDetailPage } from '@pages/ProductDetail';
import { 
  LoginPage, 
  SignupPage, 
  ForgotPasswordPage, 
  ResetPasswordPage 
} from '@pages/Auth';
import { CartPage } from '@pages/Cart';
import { CartProvider } from '@features/cart';
import { Toaster } from '@app/components/ui/toaster';
import { CheckoutPage } from '@pages/Checkout';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground antialiased">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* Auth Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Category Pages */}
                <Route path="/menswear" element={<ProductsPage />} />
                <Route path="/menswear/:category" element={<ProductsPage />} />
                <Route path="/womenswear" element={<ProductsPage />} />
                <Route path="/womenswear/:category" element={<ProductsPage />} />
                <Route path="/kidswear" element={<ProductsPage />} />
                <Route path="/kidswear/:category" element={<ProductsPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
