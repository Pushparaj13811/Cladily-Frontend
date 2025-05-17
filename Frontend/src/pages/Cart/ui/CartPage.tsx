import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useCart } from '@features/cart';
import { formatCurrency } from '@shared/utils/format';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice, itemCount } = useCart();

  // Format price helper function
  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
              </h2>
            </div>
            
            <ul className="divide-y">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="p-4 flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 h-24 bg-secondary rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${item.id}`} 
                      className="text-lg font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    
                    {(item.size || item.color) && (
                      <div className="mt-1 flex gap-2 text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    )}
                    
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center text-sm text-destructive hover:underline"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping estimate</span>
                <span>{totalPrice > 100 ? 'Free' : formatPrice(10)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax estimate</span>
                <span>{formatPrice(totalPrice * 0.1)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                <span>Order total</span>
                <span>
                  {formatPrice(
                    totalPrice + 
                    (totalPrice > 100 ? 0 : 10) + 
                    (totalPrice * 0.1)
                  )}
                </span>
              </div>
            </div>
            
            <Button className="w-full mt-6">
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center">
              <Link 
                to="/products" 
                className="text-sm text-muted-foreground hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 