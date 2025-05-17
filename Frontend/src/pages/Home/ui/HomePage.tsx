import { Button } from "@app/components/ui/button";
import { Card, CardContent } from "@app/components/ui/card";
import { Heart } from "lucide-react";
import { PRODUCTS, UI } from "@shared/constants";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-8">
        <h2 className="text-3xl font-medium text-center">{UI.HOME.CATEGORIES_TITLE}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.CATEGORY_IMAGES.map((category) => (
            <Link 
              key={category.title} 
              to={category.link}
              className="relative block overflow-hidden group"
            >
              <div className="h-[400px] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold tracking-wider">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">{PRODUCTS.SALE_BANNER.title}</h2>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link to={PRODUCTS.SALE_BANNER.hrefWomen}>{PRODUCTS.SALE_BANNER.ctaWomen}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={PRODUCTS.SALE_BANNER.hrefMen}>{PRODUCTS.SALE_BANNER.ctaMen}</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.FEATURED.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full aspect-[3/4]"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                {product.discount && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.discount}
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium">{product.brand}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="bg-muted rounded-lg p-8 text-center space-y-4">
          <h2 className="text-2xl font-medium">{UI.NEWSLETTER.TITLE}</h2>
          <p className="text-muted-foreground">{UI.NEWSLETTER.DESCRIPTION}</p>
          <div className="flex max-w-md mx-auto space-x-2">
            <div className="flex-1">
              <input 
                type="email" 
                placeholder={UI.NEWSLETTER.PLACEHOLDER}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <Button>{UI.NEWSLETTER.BUTTON}</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {UI.NEWSLETTER.CONSENT_TEXT}
          </p>
        </div>
      </section>
    </div>
  );
} 