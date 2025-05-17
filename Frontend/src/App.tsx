import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@app/providers/theme-provider';
import { Navbar } from '@widgets/Navbar';
import { Footer } from '@widgets/Footer';
import { CartProvider } from '@features/cart';
import { Toaster } from '@app/components/ui/toaster';
import { AuthProvider } from '@app/providers/auth-provider';
import { AppRoutes } from './routes';

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
              <main className="container mx-auto px-4 py-8">
                <AppRoutes />
              </main>
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
