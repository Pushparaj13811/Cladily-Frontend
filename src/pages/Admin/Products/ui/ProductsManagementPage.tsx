import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowUp, ArrowDown, Filter, SlidersHorizontal } from 'lucide-react';
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
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteProduct(productToDelete.id.toString());
      
      // Update local state
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      
      toast({
        title: 'Product deleted',
        description: `${productToDelete.name} has been deleted successfully.`,
      });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Render product status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
      case 'DRAFT':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-slate-500 hover:bg-slate-600">Archived</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of visible pages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust start if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 3);
    }
    
    // Show ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Product counts by status
  const productCounts = getProductCountsByStatus();
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory and listings
          </p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCounts.ALL}</div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-emerald-600">{productCounts.ACTIVE}</div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">{((productCounts.ACTIVE / Math.max(1, productCounts.ALL)) * 100).toFixed(0)}%</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-red-600">{productCounts.OUT_OF_STOCK}</div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{((productCounts.OUT_OF_STOCK / Math.max(1, productCounts.ALL)) * 100).toFixed(0)}%</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-amber-600">{productCounts.DRAFT}</div>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{((productCounts.DRAFT / Math.max(1, productCounts.ALL)) * 100).toFixed(0)}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters section */}
      <Card className="border shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as ProductStatus)}
              >
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center bg-white" onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSortField('name');
                setSortDirection('asc');
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Products table */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Product Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-2 h-4 w-4" /> : 
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-2 h-4 w-4" /> : 
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-2 h-4 w-4" /> : 
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 h-[300px]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-sm text-muted-foreground">Loading products...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : displayedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 h-[200px]">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground mb-2">
                        {searchQuery || selectedStatus !== 'ALL' 
                          ? 'No products match your filters' 
                          : 'No products found'}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/products/new')}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      {product.image ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden border">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground border">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category || 'Uncategorized'}</TableCell>
                    <TableCell className="text-right">
                      {typeof product.price === 'string' && !isNaN(parseFloat(product.price))
                        ? `$${parseFloat(product.price).toFixed(2)}`
                        : typeof product.price === 'number'
                          ? `$${(product.price as number).toFixed(2)}`
                          : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${product.inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'No Stock'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge((product as ExtendedProduct).status || 'DRAFT')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}`)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50" 
                            onClick={() => confirmDelete({ id: product.id, name: product.name })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of{' '}
              <span className="font-medium">{filteredProducts.length}</span> products
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {generatePaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product 
              <span className="font-medium"> {productToDelete?.name}</span>?
              This action cannot be undone.
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
              onClick={handleDelete}
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