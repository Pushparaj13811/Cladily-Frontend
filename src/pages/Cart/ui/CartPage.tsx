import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useCart } from '@features/cart';
import { formatCurrency } from '@shared/utils/format';
import { motion } from 'framer-motion';
import { FadeIn, SlideUp, StaggerContainer } from '@app/components/ui/motion';
import { CartItem as CartItemType } from '@shared/types/cart';

interface MotionItemProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const MotionItem: React.FC<MotionItemProps> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {children}
  </motion.div>
);

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  formatPrice: (price: number) => string;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem, formatPrice }) => (
  <motion.li 
    key={`${item.id}-${item.size}-${item.color}`} 
    className="p-4 flex items-start gap-4"
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
  >
    <div className="flex-shrink-0 w-24 h-24 bg-secondary rounded-md overflow-hidden">
      <motion.img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
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
          <motion.button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Decrease quantity"
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <span className="px-3">{item.quantity}</span>
          <motion.button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Increase quantity"
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        
        <motion.button
          onClick={() => removeItem(item.id)}
          className="flex items-center text-sm text-destructive hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </motion.button>
      </div>
    </div>
    
    <div className="font-medium">
      {formatPrice(item.price * item.quantity)}
    </div>
  </motion.li>
);

const EmptyCartMessage = () => (
  <FadeIn>
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
      </motion.div>
      <MotionItem delay={0.2}>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      </MotionItem>
      <MotionItem delay={0.3}>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
      </MotionItem>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </motion.div>
    </div>
  </FadeIn>
);

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice, itemCount } = useCart();

  // Format price helper function
  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  if (items.length === 0) {
    return <EmptyCartMessage />;
  }

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const taxAmount = totalPrice * 0.1;
  const orderTotal = totalPrice + shippingCost + taxAmount;

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Shopping Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SlideUp>
            <div className="rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </h2>
              </div>
              
              <StaggerContainer>
                <ul className="divide-y">
                  {items.map((item) => (
                    <CartItem 
                      key={`${item.id}-${item.size}-${item.color}`}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      formatPrice={formatPrice}
                    />
                  ))}
                </ul>
              </StaggerContainer>
            </div>
          </SlideUp>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            className="rounded-lg border p-4 sticky top-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <MotionItem delay={0.3} className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </MotionItem>
              <MotionItem delay={0.4} className="flex justify-between">
                <span>Shipping estimate</span>
                <span>{totalPrice > 100 ? 'Free' : formatPrice(10)}</span>
              </MotionItem>
              <MotionItem delay={0.5} className="flex justify-between">
                <span>Tax estimate</span>
                <span>{formatPrice(taxAmount)}</span>
              </MotionItem>
              <MotionItem delay={0.6} className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                <span>Order total</span>
                <span>{formatPrice(orderTotal)}</span>
              </MotionItem>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild className="w-full mt-6">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </motion.div>
            
            <MotionItem delay={0.8} className="mt-4 text-center">
              <Link 
                to="/products" 
                className="text-sm text-muted-foreground hover:underline"
              >
                Continue Shopping
              </Link>
            </MotionItem>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage; 