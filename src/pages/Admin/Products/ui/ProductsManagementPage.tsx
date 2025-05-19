import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowUpDown} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';

// Add a type to handle backend product type
type ExtendedProduct = Product & {
  featuredImageUrl?: string;
  status?: string;
};

type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'OUT_OF_STOCK';

const ProductsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<ProductStatus | 'ALL'>('ALL');
  
  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await getAllProducts();
        console.log('Fetched products:', fetchedProducts);
        
        // Validate and normalize received products
        const validProducts = fetchedProducts
          .filter(product => 
            product && 
            product.id !== undefined && 
            product.name
          )
          .map(product => {
            const extProduct = product as ExtendedProduct;
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
              status: extProduct.status || 'DRAFT'
            };
          });
        
        setProducts(validProducts);
        setFilteredProducts(validProducts);
        
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
  
  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Apply status filter
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
        product.subcategory.toLowerCase().includes(query)
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
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, sortField, sortDirection, selectedStatus]);
  
  // Handle sorting
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
      
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      
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
        return <Badge className="bg-green-500">Active</Badge>;
      case 'DRAFT':
        return <Badge className="bg-yellow-500">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-gray-500">Archived</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      ALL: products.length,
      ACTIVE: products.filter(p => (p as ExtendedProduct).status === 'ACTIVE').length,
      DRAFT: products.filter(p => (p as ExtendedProduct).status === 'DRAFT').length,
      ARCHIVED: products.filter(p => (p as ExtendedProduct).status === 'ARCHIVED').length,
      OUT_OF_STOCK: products.filter(p => (p as ExtendedProduct).status === 'OUT_OF_STOCK').length,
    };
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="grid gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Overview</CardTitle>
            <CardDescription>Quick overview of your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-4 bg-background rounded-lg border">
                <span className="text-2xl font-bold">{statusCounts.ALL}</span>
                <span className="text-sm text-muted-foreground">Total Products</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-lg border">
                <span className="text-2xl font-bold text-green-500">{statusCounts.ACTIVE}</span>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-lg border">
                <span className="text-2xl font-bold text-yellow-500">{statusCounts.DRAFT}</span>
                <span className="text-sm text-muted-foreground">Drafts</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-lg border">
                <span className="text-2xl font-bold text-red-500">{statusCounts.OUT_OF_STOCK}</span>
                <span className="text-sm text-muted-foreground">Out of Stock</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-lg border">
                <span className="text-2xl font-bold text-gray-500">{statusCounts.ARCHIVED}</span>
                <span className="text-sm text-muted-foreground">Archived</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as ProductStatus | 'ALL')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Products</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Drafts</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProductStatus | 'ALL')}>
        <TabsList className="mb-4">
          <TabsTrigger value="ALL" className="relative">
            All Products
            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
              {statusCounts.ALL}
            </span>
          </TabsTrigger>
          <TabsTrigger value="ACTIVE" className="relative">
            Active
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {statusCounts.ACTIVE}
            </span>
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="relative">
            Drafts
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              {statusCounts.DRAFT}
            </span>
          </TabsTrigger>
          <TabsTrigger value="OUT_OF_STOCK" className="relative">
            Out of Stock
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {statusCounts.OUT_OF_STOCK}
            </span>
          </TabsTrigger>
          <TabsTrigger value="ARCHIVED" className="relative">
            Archived
            <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {statusCounts.ARCHIVED}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      Category
                      {sortField === 'category' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      {searchQuery ? 'No products match your search' : 'No products found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <div className="h-12 w-12 rounded-md overflow-hidden">
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
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category || 'Uncategorized'}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {typeof product.price === 'string' && !isNaN(parseFloat(product.price))
                          ? `$${parseFloat(product.price).toFixed(2)}`
                          : typeof product.price === 'number'
                            ? `$${(product.price as number).toFixed(2)}`
                            : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge((product as ExtendedProduct).status || 'DRAFT')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}`)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
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
        </TabsContent>
      </Tabs>
      
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