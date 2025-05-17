import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCOUNT_NAVIGATION } from '@shared/constants/account';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const location = useLocation();
  
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
};

export default AccountLayout; 