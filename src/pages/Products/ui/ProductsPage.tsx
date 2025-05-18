import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { Separator } from "@app/components/ui/separator";
import { Checkbox } from "@app/components/ui/checkbox";
import { PRODUCTS } from "@shared/constants";
import { ProductCard } from "@shared/components";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer } from "@app/components/ui/motion";

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const products = [...PRODUCTS.FEATURED, ...PRODUCTS.RELATED];
  const location = useLocation();
  const params = useParams();
  const [debugMode, setDebugMode] = useState(true);

  // Extract department from URL path
  const getCurrentDepartment = () => {
    const path = location.pathname.toLowerCase();

    // if (path.includes('menswear')) return 'Menswear';
    // if (path.includes('womenswear')) return 'Womenswear';
    // if (path.includes('kidswear')) return 'Kidswear';
    if (path === '/womenswear' || path.startsWith('/womenswear/')) {
      return 'Womenswear';
    }

    if (path === '/menswear' || path.startsWith('/menswear/')) {
      return 'Menswear';
    }

    if (path === '/kidswear' || path.startsWith('/kidswear/')) {
      return 'Kidswear';
    }
    return '';
  };

  // Get subcategory from URL parameters if available
  const getCurrentSubcategory = () => {
    if (params.category) {
      return params.category.charAt(0).toUpperCase() + params.category.slice(1);
    }
    return '';
  };

  const currentDepartment = getCurrentDepartment();
  const currentSubcategory = getCurrentSubcategory();

  // Log department info on load
  useEffect(() => {
    if (currentDepartment) {
      console.log("Current URL Department:", currentDepartment);

      // Check how many products match each department
      const deptCounts: Record<string, number> = {};
      products.forEach(p => {
        const dept = p.department || "Uncategorized";
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });

      console.log("Department product counts:", deptCounts);

      // Count products that SHOULD match current department
      const matchingProducts = products.filter(p => p.department === currentDepartment);
      console.log(`Products with department "${currentDepartment}":`, matchingProducts.length);

      if (matchingProducts.length === 0) {
        console.warn("NO PRODUCTS FOUND for department:", currentDepartment);
        console.log("Available departments:", [...new Set(products.map(p => p.department))]);
      }
    }
  }, [currentDepartment, products]);

  // Update selected departments when URL changes
  useEffect(() => {
    if (currentDepartment) {
      setSelectedDepartments([currentDepartment]);
    } else {
      setSelectedDepartments([]);
    }
  }, [currentDepartment]);

  const toggleDepartment = (department: string) => {
    if (selectedDepartments.includes(department)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== department));
    } else {
      setSelectedDepartments([...selectedDepartments, department]);
    }
  };

  // Extract unique departments
  const departments = Array.from(new Set(products.map(product =>
    product.department || "Uncategorized"
  )));

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by URL department if any
    if (currentDepartment && product.department !== currentDepartment) {
      return false;
    }

    // Filter by URL subcategory if any
    if (currentSubcategory && product.subcategory !== currentSubcategory) {
      return false;
    }

    // Filter by manually selected departments if any (and not filtered by URL)
    if (!currentDepartment && selectedDepartments.length > 0 &&
      !selectedDepartments.includes(product.department || "Uncategorized")) {
      return false;
    }

    // Filter by price range
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    if (priceRange === "under200" && price >= 20000) {
      return false;
    } else if (priceRange === "200to400" && (price < 20000 || price > 40000)) {
      return false;
    } else if (priceRange === "over400" && price <= 40000) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setPriceRange("all");
    setSelectedDepartments([]);
    setSearchQuery("");
  };

  // Get page title based on current department/subcategory
  const getPageTitle = () => {
    if (currentSubcategory && currentDepartment) {
      return `${currentDepartment} - ${currentSubcategory}`;
    } else if (currentDepartment) {
      return `${currentDepartment}`;
    } else {
      return "All Products";
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with count and sorting */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
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
      </motion.div>

      {/* Debug panel */}
      {debugMode && currentDepartment && (
        <div className="mb-4 p-3 border border-dashed border-amber-300 bg-amber-50 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Debug Information</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={() => setDebugMode(false)}
            >
              Close
            </Button>
          </div>

          <div className="text-sm space-y-1">
            <p><strong>Current URL:</strong> {location.pathname}</p>
            <p><strong>Detected Department:</strong> "{currentDepartment}"</p>
            <p><strong>Filtered Products:</strong> {filteredProducts.length}</p>
            <p><strong>Products by Department:</strong></p>
            <div className="ml-4 mt-1 space-y-1">
              {departments.map(dept => {
                const count = products.filter(p => p.department === dept).length;
                return (
                  <div key={dept} className={`${dept === currentDepartment ? 'font-medium' : ''}`}>
                    {dept}: {count} product(s)
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active filters */}
      {((!currentDepartment && selectedDepartments.length > 0) || priceRange !== "all" || searchQuery) && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Active filters:</span>

            {!currentDepartment && selectedDepartments.map(dept => (
              <motion.div
                key={dept}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 h-8 rounded-full"
                  onClick={() => toggleDepartment(dept)}
                >
                  {dept}
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}

            {priceRange !== "all" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 h-8 rounded-full"
                  onClick={() => setPriceRange("all")}
                >
                  {priceRange === "under200" ? "Under ₹20,000" :
                    priceRange === "200to400" ? "₹20,000 - ₹40,000" : "Over ₹40,000"}
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}

            {searchQuery && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 h-8 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  "{searchQuery}"
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-muted-foreground"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <motion.div 
          className="space-y-6 bg-muted/20 p-4 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
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

          {/* Price Range */}
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
                <label htmlFor="price-under-200" className="text-sm">Under ₹20,000</label>
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
                <label htmlFor="price-200-400" className="text-sm">₹20,000 - ₹40,000</label>
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
                <label htmlFor="price-over-400" className="text-sm">Over ₹40,000</label>
              </div>
            </div>
          </div>

          {!currentDepartment && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Departments</h3>
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
            </>
          )}

          {/* Add debug toggle */}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Debug Mode</span>
            <Checkbox
              id="debug-mode"
              checked={debugMode}
              onCheckedChange={(checked) => setDebugMode(checked === true)}
            />
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <StaggerContainer>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      department={product.department || "Uncategorized"}
                      price={product.price}
                      originalPrice={product.originalPrice ? product.originalPrice : undefined}
                      discount={product.discount ? product.discount : undefined}
                      image={product.image}
                      isNew={!product.discount}
                      rating={product.rating}
                    />
                  </motion.div>
                ))}
              </div>
            </StaggerContainer>
          ) : (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-muted-foreground mb-4">No products match your filters.</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="min-w-[150px]"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 