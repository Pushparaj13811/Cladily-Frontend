import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useCart } from '@features/cart';
import { toast } from '@shared/utils';
import { ProductCardProps } from '@shared/types';

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  department,
  price,
  originalPrice,
  discount,
  image,
  isNew,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: String(id),
      name,
      price: parseFloat(price.replace(/[^0-9.]/g, '')),
      quantity: 1,
      image,
    });

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </Link>
        
        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 rounded-full shadow-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </div>
        
        {/* Discount badge */}
        {discount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
            {discount}
          </div>
        )}
        
        {/* New badge */}
        {isNew && !discount && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded">
            NEW
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="mt-2">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium">
              <Link to={`/products/${id}`}>
                {name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{department}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">{price}</p>
            {originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{originalPrice}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 