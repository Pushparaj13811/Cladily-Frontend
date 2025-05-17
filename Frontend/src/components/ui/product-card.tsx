import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  images: string[];
  availableSizes?: string[];
}

export function ProductCard({
  id,
  brand,
  name,
  price,
  originalPrice,
  discount,
  currency = "INR",
  images,
  availableSizes,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const showNextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(originalPrice)
    : null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-muted/20">
        <Link to={`/products/${id}`}>
          {images.map((image, index) => (
            <motion.img
              key={image}
              src={image}
              alt={`${brand} ${name}`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                transition: { duration: 0.5 }
              }}
            />
          ))}
        </Link>

        {/* Hover to change image */}
        {images.length > 1 && (
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            onClick={showNextImage}
            aria-hidden="true"
          />
        )}

        {/* Wishlist button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>

        {/* Discount tag */}
        {discount && (
          <div className="absolute bottom-2 left-2 bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <Link to={`/products/${id}`} className="block">
          <h3 className="font-medium text-sm">{brand}</h3>
          <p className="text-muted-foreground text-sm line-clamp-1">{name}</p>
        </Link>
        
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Available Sizes */}
        {availableSizes && availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {availableSizes.map((size) => (
              <Link
                to={`/products/${id}?size=${size}`}
                key={size}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {size}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 