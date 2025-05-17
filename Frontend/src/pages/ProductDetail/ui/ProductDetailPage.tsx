import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "@shared/constants";
import { Button } from "@app/components/ui/button";
import { Separator } from "@app/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs";
import { Check, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { cn } from "@app/lib/utils";
import { useCart } from "@features/cart";
import { toast } from "@shared/utils";
import { ProductCard } from "@shared/components/ProductCard";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  
  // Find the product by ID from either FEATURED or RELATED arrays
  const product = PRODUCTS.FEATURED.find(p => p.id === productId) || 
                 PRODUCTS.RELATED.find(p => p.id === productId) || 
                 PRODUCTS.FEATURED[0]; // Default to first product if not found
  
  const [mainImage, setMainImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Get related products excluding current product
  const relatedProducts = PRODUCTS.RELATED.filter(p => p.id !== productId).slice(0, 4);

  // Use product sizes or default to common sizes
  const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Helper function to convert price string to number
  const convertPriceToNumber = (priceString: string): number => {
    return parseFloat(priceString.replace(/[^0-9.]/g, ''));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const itemToAdd = {
      id: String(product.id), // Convert to string to match the CartItem type
      name: product.name,
      price: convertPriceToNumber(product.price), // Convert price to number
      size: selectedSize,
      quantity,
      image: product.image,
    };

    addItem(itemToAdd);
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-muted overflow-hidden rounded-lg aspect-square">
            <img
              src={mainImage}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images && product.images.map((img, i) => (
              <div
                key={i}
                className={cn(
                  "cursor-pointer rounded-md overflow-hidden border-2 aspect-square",
                  mainImage === img
                    ? "border-primary"
                    : "border-transparent"
                )}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`${product.name} - View ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{product.department}</p>
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.ratingCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                {product.discount}
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={selectedSize === size ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            className="w-full flex items-center justify-center space-x-2"
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Add to Cart</span>
          </Button>

          {/* Delivery Info */}
          <div className="mt-6 bg-muted/50 p-4 rounded-md">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">In Stock & Ready to Ship</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.deliveryInfo || "Free standard delivery on orders over $100"}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                {product.material && (
                  <div>
                    <h4 className="font-medium">Material</h4>
                    <p className="text-sm text-muted-foreground mt-1">{product.material}</p>
                  </div>
                )}
                {product.care && (
                  <div>
                    <h4 className="font-medium">Care</h4>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5">
                      {product.care.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.features && (
                  <div>
                    <h4 className="font-medium">Features</h4>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5">
                      {product.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-4">
                <p>
                  We offer the following shipping options for orders within the continental United States:
                </p>
                <div>
                  <h4 className="font-medium">Standard Shipping (3-5 business days)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free for orders over $100, otherwise $10
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Express Shipping (2-3 business days)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free for orders over $250, otherwise $25
                  </p>
                </div>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium">International Shipping</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    For international orders, shipping costs and delivery times will vary based on location.
                    Please see checkout for specific shipping costs and estimated delivery times.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              name={relatedProduct.name}
              department={relatedProduct.department || ""}
              price={relatedProduct.price}
              originalPrice={relatedProduct.originalPrice || undefined}
              discount={relatedProduct.discount || undefined}
              image={relatedProduct.image}
              isNew={false}
              rating={relatedProduct.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 