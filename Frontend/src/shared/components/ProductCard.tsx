import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useCart } from '@features/cart';
import { toast } from '@shared/utils';
import { ProductCardProps } from '@shared/types';
import { cn } from '@app/lib/utils';

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  department,
  price,
  originalPrice,
  discount,
  image,
  isNew,
  rating,
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist.`,
    });
  };

  return (
    <div className="group relative h-full flex flex-col">
      {/* Card with subtle shadow and rounded border */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border/40 bg-background transition-all duration-300 hover:shadow-md hover:border-border">
        {/* Image container with zoom effect on hover */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Link to={`/products/${id}`} className="block h-full w-full">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          
          {/* Quick action buttons with improved styling */}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-9 w-9 rounded-full shadow-md bg-white/90 hover:bg-white text-foreground hover:scale-110 transition-transform"
              onClick={handleWishlist}
            >
              <Heart className="h-[18px] w-[18px]" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-9 w-9 rounded-full shadow-md bg-white/90 hover:bg-white text-foreground hover:scale-110 transition-transform"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
          
          {/* Improved badges with subtle animations */}
          {discount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2.5 py-1 text-xs font-bold rounded-md shadow-sm transform transition-transform duration-300 group-hover:scale-105">
              {discount}
            </div>
          )}
          
          {isNew && !discount && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold rounded-md shadow-sm transform transition-transform duration-300 group-hover:scale-105">
              NEW
            </div>
          )}

          {/* Quick add to cart overlay on hover */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="secondary"
              className="bg-white text-foreground hover:bg-white/90 font-medium px-4 py-2 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Product info with improved typography and spacing */}
        <div className="p-3">
          <div className="space-y-1.5">
            <Link to={`/products/${id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="font-medium line-clamp-1 text-sm">{name}</h3>
            </Link>
            
            <p className="text-sm text-muted-foreground line-clamp-1">{department}</p>
            
            {/* Rating display if available */}
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">{rating}</span>
              </div>
            )}
            
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-semibold text-foreground">{price}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>
              )}
              {discount && (
                <span className="text-xs font-medium text-red-600">{discount}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 