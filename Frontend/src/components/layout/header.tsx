import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { User, Heart, ShoppingBag, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Primary Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/womenswear"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Womenswear
            </NavLink>
            <NavLink
              to="/menswear"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Menswear
            </NavLink>
            <NavLink
              to="/kidswear"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Kidswear
            </NavLink>
          </nav>

          {/* Logo */}
          <Link to="/" className="text-2xl font-heading font-bold tracking-tight">
            CLADILY
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-transparent"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-4"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-md border border-input px-10 py-2 bg-background"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border"
          >
            <nav className="container mx-auto p-4 flex flex-col space-y-4">
              <NavLink
                to="/womenswear"
                className={({ isActive }) =>
                  cn(
                    "py-2 text-base font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Womenswear
              </NavLink>
              <NavLink
                to="/menswear"
                className={({ isActive }) =>
                  cn(
                    "py-2 text-base font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Menswear
              </NavLink>
              <NavLink
                to="/kidswear"
                className={({ isActive }) =>
                  cn(
                    "py-2 text-base font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Kidswear
              </NavLink>
              
              {/* Additional mobile navigation items */}
              <NavLink
                to="/sale"
                className={({ isActive }) =>
                  cn(
                    "py-2 text-base font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Sale
              </NavLink>
              <NavLink
                to="/new-in"
                className={({ isActive }) =>
                  cn(
                    "py-2 text-base font-medium",
                    isActive ? "text-primary" : "text-foreground"
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                New In
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Navigation - Desktop */}
      <div className="hidden lg:block border-t border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-6">
            <NavLink
              to="/sale"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Sale
            </NavLink>
            <NavLink
              to="/new-in"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              New In
            </NavLink>
            <NavLink
              to="/vacation"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Vacation
            </NavLink>
            <NavLink
              to="/brands"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Brands
            </NavLink>
            <NavLink
              to="/clothing"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Clothing
            </NavLink>
            <NavLink
              to="/shoes"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Shoes
            </NavLink>
            <NavLink
              to="/bags"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Bags
            </NavLink>
            <NavLink
              to="/accessories"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Accessories
            </NavLink>
            <NavLink
              to="/watches"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Watches
            </NavLink>
            <NavLink
              to="/homeware"
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Homeware
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 