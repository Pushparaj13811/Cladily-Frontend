import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@app/providers/theme-provider';
import { Navbar } from '@widgets/Navbar';
import { Footer } from '@widgets/Footer';
import { CartProvider } from '@features/cart';
import { Toaster } from '@app/components/ui/toaster';
import { AuthProvider } from '@app/providers/auth-provider';
import { PageTransition } from '@app/components/ui/motion';
import { AppRoutes } from './routes';

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <main className="container mx-auto px-4 py-8" key={location.pathname}>
        <AppRoutes />
      </main>
    </PageTransition>
  );
};

/**
 * App - Root component of the application
 * Contains providers, layout components, and routing
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground antialiased">
              <Navbar />
              <AnimatedRoutes />
              <Footer />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
