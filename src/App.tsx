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
              <Navbar />
              <AnimatedRoutes />
              <Footer />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
