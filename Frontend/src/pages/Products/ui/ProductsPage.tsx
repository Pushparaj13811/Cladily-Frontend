import { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { Separator } from "@app/components/ui/separator";
import { Checkbox } from "@app/components/ui/checkbox";
import { PRODUCTS} from "@shared/constants";
import { ProductCard } from "@shared/components";

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const products = [...PRODUCTS.FEATURED, ...PRODUCTS.RELATED];

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Extract unique brands
  const brands = Array.from(new Set(products.map(product => product.brand)));

  // Filter products
  const filteredProducts = products.filter(product => {
    // Filter by brand if any selected
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    // Filter by price range
    if (priceRange === "under200" && parseFloat(product.price.replace("$", "")) >= 200) {
      return false;
    } else if (priceRange === "200to400" && (parseFloat(product.price.replace("$", "")) < 200 || parseFloat(product.price.replace("$", "")) > 400)) {
      return false;
    } else if (priceRange === "over400" && parseFloat(product.price.replace("$", "")) <= 400) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Men's Collection</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="lowest">Price: Low to High</SelectItem>
              <SelectItem value="highest">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Search</h3>
            <Input 
              type="search"
              placeholder="Search products..." 
              className="w-full"
            />
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="price-all" 
                  name="price-range" 
                  value="all"
                  checked={priceRange === "all"}
                  onChange={() => setPriceRange("all")}
                  className="h-4 w-4 rounded-full"
                />
                <label htmlFor="price-all" className="text-sm">All</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="price-under-200" 
                  name="price-range" 
                  value="under200"
                  checked={priceRange === "under200"}
                  onChange={() => setPriceRange("under200")}
                  className="h-4 w-4 rounded-full"
                />
                <label htmlFor="price-under-200" className="text-sm">Under $200</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="price-200-400" 
                  name="price-range" 
                  value="200to400"
                  checked={priceRange === "200to400"}
                  onChange={() => setPriceRange("200to400")}
                  className="h-4 w-4 rounded-full"
                />
                <label htmlFor="price-200-400" className="text-sm">$200 - $400</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="price-over-400" 
                  name="price-range" 
                  value="over400"
                  checked={priceRange === "over400"}
                  onChange={() => setPriceRange("over400")}
                  className="h-4 w-4 rounded-full"
                />
                <label htmlFor="price-over-400" className="text-sm">Over $400</label>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Brands</h3>
            <div className="space-y-2">
              {brands.map(brand => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  originalPrice={product.originalPrice ? product.originalPrice : undefined}
                  discount={product.discount ? product.discount : undefined}
                  image={product.image}
                  isNew={!product.discount}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No products match your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setPriceRange("all");
                    setSelectedBrands([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 