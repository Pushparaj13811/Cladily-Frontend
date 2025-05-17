import { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { Separator } from "@app/components/ui/separator";
import { Checkbox } from "@app/components/ui/checkbox";
import { PRODUCTS } from "@shared/constants";
import { ProductCard } from "@shared/components";
import { X } from "lucide-react";

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const products = [...PRODUCTS.FEATURED, ...PRODUCTS.RELATED];

  const toggleDepartment = (department: string) => {
    if (selectedDepartments.includes(department)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== department));
    } else {
      setSelectedDepartments([...selectedDepartments, department]);
    }
  };

  // Extract unique departments
  const departments = Array.from(new Set(products.map(product => 
    product.category || "Uncategorized"
  )));

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by department if any selected
    if (selectedDepartments.length > 0 && 
        !selectedDepartments.includes(product.category || "Uncategorized")) {
      return false;
    }
    
    // Filter by price range
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    if (priceRange === "under200" && price >= 200) {
      return false;
    } else if (priceRange === "200to400" && (price < 200 || price > 400)) {
      return false;
    } else if (priceRange === "over400" && price <= 400) {
      return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setPriceRange("all");
    setSelectedDepartments([]);
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with count and sorting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Men's Collection</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
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

      {/* Active filters */}
      {(selectedDepartments.length > 0 || priceRange !== "all" || searchQuery) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Active filters:</span>
            
            {selectedDepartments.map(dept => (
              <Button 
                key={dept} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-8 rounded-full"
                onClick={() => toggleDepartment(dept)}
              >
                {dept}
                <X className="h-3 w-3" />
              </Button>
            ))}
            
            {priceRange !== "all" && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-8 rounded-full"
                onClick={() => setPriceRange("all")}
              >
                {priceRange === "under200" ? "Under $200" : 
                 priceRange === "200to400" ? "$200 - $400" : "Over $400"}
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {searchQuery && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-8 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                "{searchQuery}"
                <X className="h-3 w-3" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-2 text-muted-foreground"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="space-y-6 bg-muted/20 p-4 rounded-lg">
          <div>
            <h3 className="font-medium mb-3">Search</h3>
            <Input 
              type="search"
              placeholder="Search products..." 
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dept-${dept}`}
                    checked={selectedDepartments.includes(dept)}
                    onCheckedChange={() => toggleDepartment(dept)}
                  />
                  <label htmlFor={`dept-${dept}`} className="text-sm">{dept}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  department={product.category || "Uncategorized"}
                  price={product.price}
                  originalPrice={product.originalPrice ? product.originalPrice : undefined}
                  discount={product.discount ? product.discount : undefined}
                  image={product.image}
                  isNew={!product.discount}
                  rating={product.rating}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products match your filters.</p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="min-w-[150px]"
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