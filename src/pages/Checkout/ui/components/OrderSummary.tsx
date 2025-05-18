import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '@shared/types';
import { formatCurrency } from '@shared/utils/format';
import { Separator } from '@app/components/ui/separator';
import { Button } from '@app/components/ui/button';
import { ChevronRight } from 'lucide-react';

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isEditable?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  isEditable = true
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          {isEditable && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart" className="flex items-center gap-1 text-sm">
                Edit Cart <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="mt-4 space-y-4">
          {items.length > 0 ? (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="py-3 flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ', '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">Your cart is empty</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 