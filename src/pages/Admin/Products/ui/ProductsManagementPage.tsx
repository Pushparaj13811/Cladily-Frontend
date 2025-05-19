import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, Home, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { Badge } from '@app/components/ui/badge';
import { getAllProducts, deleteProduct } from '@features/dashboard/productAPI';
import { Product } from '@shared/types';
import { useToast } from '@app/hooks/use-toast';
import {
  Card,
  CardContent,
} from '@app/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@app/components/ui/pagination";

// Add a type to handle backend product type
type ExtendedProduct = Product & {
  featuredImageUrl?: string;
  status?: string;
};

// Define product status type
type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'OUT_OF_STOCK' | 'ALL';

// Products per page for pagination
const ITEMS_PER_PAGE = 10;

const ProductsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Calculate total products by status
  const getProductCountsByStatus = () => {
    const counts = {
      ALL: products.length,
      ACTIVE: products.filter(p => (p as ExtendedProduct).status === 'ACTIVE' || p.inStock).length,
      DRAFT: products.filter(p => (p as ExtendedProduct).status === 'DRAFT').length,
      OUT_OF_STOCK: products.filter(p => (p as ExtendedProduct).status === 'OUT_OF_STOCK' || !p.inStock).length,
      ARCHIVED: products.filter(p => (p as ExtendedProduct).status === 'ARCHIVED').length,
    };
    return counts;
  };

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await getAllProducts();

        // Validate and normalize received products
        const validProducts = fetchedProducts
          .filter(product =>
            product &&
            product.id !== undefined &&
            product.name
          )
          .map(product => {
            const extProduct = product as ExtendedProduct;

            // Determine status based on backend data
            let status = extProduct.status || 'DRAFT';
            if (!product.inStock && status !== 'ARCHIVED') {
              status = 'OUT_OF_STOCK';
            } else if (product.inStock && !status) {
              status = 'ACTIVE';
            }

            return {
              ...product,
              price: typeof product.price === 'number'
                ? String(product.price)
                : (product.price || '0'),
              originalPrice: typeof product.originalPrice === 'number'
                ? String(product.originalPrice)
                : product.originalPrice,
              category: product.category || 'Uncategorized',
              subcategory: product.subcategory || '',
              image: product.image || extProduct.featuredImageUrl || '',
              inStock: product.inStock !== undefined
                ? product.inStock
                : extProduct.status !== 'OUT_OF_STOCK',
              department: product.department || 'Menswear',
              material: product.material || 'N/A',
              care: Array.isArray(product.care) ? product.care : [],
              features: Array.isArray(product.features) ? product.features : [],
              sizes: Array.isArray(product.sizes) ? product.sizes : [],
              colors: Array.isArray(product.colors) ? product.colors : [],
              deliveryInfo: product.deliveryInfo || 'Standard shipping',
              rating: typeof product.rating === 'number' ? product.rating : 0,
              ratingCount: typeof product.ratingCount === 'number' ? product.ratingCount : 0,
              discount: product.discount || null,
              images: Array.isArray(product.images) ? product.images : [],
              status: status
            };
          });

        setProducts(validProducts);

        if (validProducts.length === 0) {
          toast({
            title: 'No products found',
            description: 'Try creating your first product',
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error loading products',
          description: 'There was a problem loading the products. Please try again.',
          variant: 'destructive',
        });

        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on search and status
  useEffect(() => {
    let filtered = [...products];

    // Apply status filter if not ALL
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(product =>
        (product as ExtendedProduct).status === selectedStatus
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'price') {
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
      } else {
        aValue = a.category?.toLowerCase() || '';
        bValue = b.category?.toLowerCase() || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)));

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, searchQuery, selectedStatus, sortField, sortDirection]);

  // Update displayed products based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  // Handle sorting toggle
  const handleSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (product: { id: number; name: string }) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id.toString());

      // Update state to remove the deleted product
      setProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete.id)
      );

      // Show success message
      toast({
        title: 'Product deleted',
        description: `"${productToDelete.name}" has been permanently removed.`,
      });

      // Close the dialog
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting product',
        description: 'There was a problem deleting the product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format price in consistent way
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : 'N/A';
  };
 const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border border-green-200 rounded-full">Active</Badge>
      case 'DRAFT':
        return <Badge variant="outline" className="text-amber-600 border-amber-400 rounded-full">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-full">Archived</Badge>
      case 'OUT_OF_STOCK':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border border-red-200 rounded-full">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Determine if we need ellipsis after first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're always shown

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Determine if we need ellipsis before last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const productCounts = getProductCountsByStatus();

  return (
    <div className="p-6 w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate('/admin/dashboard')}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <span className="mx-2">/</span>
          <span className="text-foreground">Products</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product listings and inventory
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => navigate('/admin/products/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6">
        <div className="flex border-b overflow-auto">
          <Button
            variant={selectedStatus === 'ALL' ? 'default' : 'ghost'}
            className={`rounded-none border-b-2 ${selectedStatus === 'ALL' ? 'border-primary' : 'border-transparent'} px-4`}
            onClick={() => setSelectedStatus('ALL')}
          >
            All Orders
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{productCounts.ALL}</Badge>
          </Button>
          <Button
            variant={selectedStatus === 'ACTIVE' ? 'default' : 'ghost'}
            className={`rounded-none border-b-2 ${selectedStatus === 'ACTIVE' ? 'border-primary' : 'border-transparent'} px-4`}
            onClick={() => setSelectedStatus('ACTIVE')}
          >
            Active
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{productCounts.ACTIVE}</Badge>
          </Button>
          <Button
            variant={selectedStatus === 'DRAFT' ? 'default' : 'ghost'}
            className={`rounded-none border-b-2 ${selectedStatus === 'DRAFT' ? 'border-primary' : 'border-transparent'} px-4`}
            onClick={() => setSelectedStatus('DRAFT')}
          >
            Drafts
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{productCounts.DRAFT}</Badge>
          </Button>
          <Button
            variant={selectedStatus === 'OUT_OF_STOCK' ? 'default' : 'ghost'}
            className={`rounded-none border-b-2 ${selectedStatus === 'OUT_OF_STOCK' ? 'border-primary' : 'border-transparent'} px-4`}
            onClick={() => setSelectedStatus('OUT_OF_STOCK')}
          >
            Out of Stock
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{productCounts.OUT_OF_STOCK}</Badge>
          </Button>
          <Button
            variant={selectedStatus === 'ARCHIVED' ? 'default' : 'ghost'}
            className={`rounded-none border-b-2 ${selectedStatus === 'ARCHIVED' ? 'border-primary' : 'border-transparent'} px-4`}
            onClick={() => setSelectedStatus('ARCHIVED')}
          >
            Archived
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{productCounts.ARCHIVED}</Badge>
          </Button>
        </div>
      </div>

      {/* Search, sort and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                <span className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort by: {sortField}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('price')}>
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('category')}>
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading products...</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No products found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              )}
              {!searchQuery && selectedStatus !== 'ALL' && (
                <p className="text-sm text-muted-foreground mt-1">
                  No products with status "{selectedStatus.toLowerCase()}"
                </p>
              )}
              {!searchQuery && selectedStatus === 'ALL' && products.length === 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/admin/products/new')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first product
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[30px] pl-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[280px]">
                    <button
                      className="flex items-center hover:text-primary"
                      onClick={() => handleSort('name')}
                    >
                      Product
                      {sortField === 'name' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center hover:text-primary"
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortField === 'category' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center hover:text-primary"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortField === 'price' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProducts.map((product) => (
                  <TableRow key={product.id} className="border-t border-gray-200">
                    <TableCell className="pl-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200" />
                          )}
                        </div>
                        <span className="truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge((product as ExtendedProduct).status || '')}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => confirmDelete({ id: product.id!, name: product.name })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" /> </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The product "{productToDelete?.name}" will be
              permanently removed from your inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagementPage; 