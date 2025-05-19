import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@app/providers/theme-provider';
import { Navbar } from '@widgets/Navbar';
import { Footer } from '@widgets/Footer';
import { CartProvider } from '@features/cart';
import { Toaster } from '@app/components/ui/toaster';
import { PageTransition } from '@app/components/ui/motion';
import { ReduxProvider } from '@app/providers/ReduxProvider';
import { AppRoutes } from './routes';

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // If it's an admin route, don't wrap with container
  if (isAdminRoute) {
    return (
      <PageTransition>
        <AppRoutes />
      </PageTransition>
    );
  }
  
  // For regular routes, use the container layout
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
    <ReduxProvider>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground antialiased">
              <AppLayout />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

/**
 * AppLayout - Layout that conditionally renders nav and footer
 */
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return <AnimatedRoutes />;
  }
  
  return (
    <>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </>
  );
};

export default App;
