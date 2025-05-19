import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
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

// Add a type to handle backend product type
type ExtendedProduct = Product & {
  featuredImageUrl?: string;
  status?: string;
};

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
            // Ensure product has required fields
            product && 
            product.id !== undefined && 
            product.name
          )
          .map(product => {
            // Cast to extended product type to handle backend fields
            const extProduct = product as ExtendedProduct;
            return {
              ...product,
              // Ensure price is a string (some APIs return it as a number)
              price: typeof product.price === 'number' 
                ? String(product.price) 
                : (product.price || '0'),
              // Ensure originalPrice is a string or null
              originalPrice: typeof product.originalPrice === 'number'
                ? String(product.originalPrice)
                : product.originalPrice,
              // Ensure category exists
              category: product.category || 'Uncategorized',
              // Ensure subcategory exists
              subcategory: product.subcategory || '',
              // Ensure image exists
              image: product.image || extProduct.featuredImageUrl || '',
              // Ensure inStock flag exists
              inStock: product.inStock !== undefined 
                ? product.inStock 
                : extProduct.status !== 'OUT_OF_STOCK',
              // Ensure department exists
              department: product.department || 'Menswear',
              // Set other required fields with defaults if missing
              material: product.material || 'N/A',
              care: Array.isArray(product.care) ? product.care : [],
              features: Array.isArray(product.features) ? product.features : [],
              sizes: Array.isArray(product.sizes) ? product.sizes : [],
              colors: Array.isArray(product.colors) ? product.colors : [],
              deliveryInfo: product.deliveryInfo || 'Standard shipping',
              rating: typeof product.rating === 'number' ? product.rating : 0,
              ratingCount: typeof product.ratingCount === 'number' ? product.ratingCount : 0,
              discount: product.discount || null,
              images: Array.isArray(product.images) ? product.images : []
            };
          });
        
        console.log('Valid products after normalization:', validProducts.length);
        
        // Set products state with normalized data
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
        
        // Set empty arrays in case of error
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.subcategory.toLowerCase().includes(query)
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
  // Handle sorting
  const handleSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    
    // Sort the products
    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue, bValue;
      
      if (field === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (field === 'price') {
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
    
    setFilteredProducts(sorted);
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
  const renderStatusBadge = (inStock: boolean) => {
    if (inStock) {
      return <Badge className="bg-green-500">In Stock</Badge>;
    } else {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };
  
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
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
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
                            // Replace broken image with a placeholder
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
                  <TableCell>{renderStatusBadge(product.inStock)}</TableCell>
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