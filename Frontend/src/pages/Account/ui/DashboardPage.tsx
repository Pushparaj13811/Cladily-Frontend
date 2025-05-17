import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@app/providers/auth-provider';

interface AccountCardProps {
  title: string;
  description: string;
  path: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ title, description, path }) => {
  return (
    <Link 
      to={path}
      className="block p-6 border border-gray-200 rounded-sm hover:border-gray-400 transition-colors"
    >
      <h3 className="text-base font-medium uppercase mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

const accountSections = [
  {
    title: 'ACCESS BRONZE',
    description: 'Explore your loyalty rewards and track your progress',
    path: '/account/membership'
  },
  {
    title: 'ORDERS AND RETURNS',
    description: 'Track your orders or arrange a return',
    path: '/account/orders'
  },
  {
    title: 'CREDITS AND REFUNDS',
    description: 'Check your credits and refunds, all in one place',
    path: '/account/credits'
  },
  {
    title: 'DETAILS AND SECURITY',
    description: 'Manage your sign in and password details',
    path: '/account/details'
  },
  {
    title: 'ADDRESS BOOK',
    description: 'View your saved billing and delivery address',
    path: '/account/addresses'
  },
  {
    title: 'SHOPPING PREFERENCES',
    description: 'Set your shopping and currency settings',
    path: '/account/shopping-preferences'
  },
  {
    title: 'COMMUNICATION PREFERENCES',
    description: 'Manage your language and communication settings',
    path: '/account/communication-preferences'
  },
  {
    title: 'REFER A FRIEND',
    description: 'Get a discount for you and your friends',
    path: '/account/referral'
  },
  {
    title: 'CONNECTED SERVICES',
    description: 'Manage your linked apps and services',
    path: '/account/services'
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const firstName = (user?.name || 'User').split(' ')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal mb-10">Welcome to your account, {firstName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountSections.map((section) => (
          <AccountCard
            key={section.path}
            title={section.title}
            description={section.description}
            path={section.path}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 