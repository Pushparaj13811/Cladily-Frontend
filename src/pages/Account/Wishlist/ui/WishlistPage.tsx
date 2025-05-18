import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { useCart } from '@features/cart';
import { formatCurrency } from '@shared/utils/format';
import { useToast } from '@app/hooks/use-toast';

// Mock wishlist data
const MOCK_WISHLIST_ITEMS = [
  {
    id: '1',
    name: 'Slim Fit Cotton Shirt',
    price: 2499,
    image: 'https://placehold.co/300x400',
    category: 'Shirts',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['White', 'Blue', 'Black'],
  },
  {
    id: '2',
    name: 'Premium Wool Blend Trousers',
    price: 3499,
    image: 'https://placehold.co/300x400',
    category: 'Trousers',
    availableSizes: ['30', '32', '34', '36'],
    availableColors: ['Navy', 'Grey', 'Black'],
  },
  {
    id: '3',
    name: 'Classic Leather Jacket',
    price: 7999,
    image: 'https://placehold.co/300x400',
    category: 'Outerwear',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Brown', 'Black'],
  },
];

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST_ITEMS);

  // Remove item from wishlist
  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    toast({
      title: 'Item removed',
      description: 'Item was removed from your wishlist',
    });
  };

  // Add item to cart
  const handleAddToCart = (item: typeof MOCK_WISHLIST_ITEMS[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast({
      title: 'Item added to cart',
      description: `${item.name} has been added to your cart`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="text-sm text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Items added to your wishlist will appear here
          </p>
          <Button onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border rounded-lg"
            >
              <div className="md:col-span-1">
                <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {item.category}
                </p>
                <div className="text-lg font-medium mb-2">
                  {formatCurrency(item.price)}
                </div>
                
                <div className="mt-auto">
                  <div className="text-sm text-muted-foreground mb-1">
                    Available Sizes: {item.availableSizes.join(', ')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Colors: {item.availableColors.join(', ')}
                  </div>
                </div>
              </div>
              <div className="md:col-span-1 flex flex-col justify-center gap-2">
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="w-full text-destructive border-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 