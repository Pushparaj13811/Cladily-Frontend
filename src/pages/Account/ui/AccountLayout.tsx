import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCOUNT_NAVIGATION } from '@shared/constants/account';
import { motion } from 'framer-motion';
import AnimatedPage from '@app/components/ui/animated-page';
import { StaggerContainer } from '@app/components/ui/motion';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  
  // Store previous location in sessionStorage to persist across renders
  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath') || '';
    const currentPath = location.pathname;
    
    // Check if coming from a non-account page
    if (previousPath && previousPath.startsWith('/account') && currentPath.startsWith('/account')) {
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
    
    // Store current path for next navigation
    return () => {
      sessionStorage.setItem('previousPath', currentPath);
    };
  }, [location.pathname]);
  
  const navItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  // If coming from another account page, don't animate
  if (!shouldAnimate) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-2xl font-medium mb-8">MY ACCOUNT</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav>
              <ul className="space-y-6">
                {ACCOUNT_NAVIGATION.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`text-sm ${location.pathname === item.path ? 'font-bold' : 'text-gray-700 hover:underline'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // First render or coming from a non-account page
  return (
    <AnimatedPage animationType="fade">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.h1 
          className="text-2xl font-medium mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          MY ACCOUNT
        </motion.h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <StaggerContainer>
              <ul className="space-y-6">
                {ACCOUNT_NAVIGATION.map((item, index) => (
                  <motion.li 
                    key={item.path}
                    variants={navItemVariants}
                    custom={index}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link 
                      to={item.path} 
                      className={`text-sm ${location.pathname === item.path ? 'font-bold' : 'text-gray-700 hover:underline'}`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </StaggerContainer>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AccountLayout; 