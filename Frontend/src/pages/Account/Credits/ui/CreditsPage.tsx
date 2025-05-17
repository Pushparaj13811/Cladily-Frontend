import React from 'react';
import AccountLayout from '../../ui/AccountLayout';
import { MOCK_USER_CREDIT } from '@shared/constants/account';
import { formatCurrency } from '@shared/utils/format';

const CreditsPage: React.FC = () => {
  const { availableCredit, availableRefunds, pendingCredit, totalCredit } = MOCK_USER_CREDIT;

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Credits and Refunds</h2>

        <div className="mb-8">
          <h3 className="text-3xl font-medium mb-4">{formatCurrency(totalCredit)}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Available credit:</span>
              <span>{formatCurrency(availableCredit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Available refunds:</span>
              <span>{formatCurrency(availableRefunds)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending credit:</span>
              <span>{formatCurrency(pendingCredit)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-xl font-medium mb-4">Nothing to see here, yet</h3>
          <p className="text-gray-600">Your available credits and refunds will show here</p>
        </div>
      </div>
    </AccountLayout>
  );
};

export default CreditsPage; 