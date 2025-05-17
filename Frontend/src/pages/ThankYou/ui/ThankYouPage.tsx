import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@shared/utils/format';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total } = location.state || { orderId: 'UNKNOWN', total: 0 };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-xl mb-2">Your order #{orderId} has been placed successfully.</p>
        <p className="text-lg mb-6">Total: {formatCurrency(total)}</p>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-8 text-left">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="flex items-center text-muted-foreground mb-2">
            <Package className="h-5 w-5 mr-2" />
            <span>Your order confirmation has been sent to your email.</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Package className="h-5 w-5 mr-2" />
            <span>Your items will be shipped within 2-3 business days.</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => navigate('/account/orders')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View Orders
          </Button>
        </div>
        
        <p className="text-muted-foreground text-sm">
          If you have any questions about your order, please email{' '}
          <Link to="mailto:support@cladily.com" className="text-primary hover:text-primary/90">
            support@cladily.com
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage; 