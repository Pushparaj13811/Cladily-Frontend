import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ImagePlus } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label';
import { useToast } from '@app/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';

// Mock categories data
const CATEGORIES = [
  { id: 'cat1', name: 'T-shirts' },
  { id: 'cat2', name: 'Jeans' },
  { id: 'cat3', name: 'Sweatshirts' },
  { id: 'cat4', name: 'Outerwear' },
  { id: 'cat5', name: 'Accessories' },
  { id: 'cat6', name: 'Shorts' },
];

// Mock product data for edit mode
const MOCK_PRODUCT = {
  id: 'P1001',
  name: 'Classic White T-shirt',
  sku: 'TS-WHT-001',
  category: 'T-shirts',
  price: 1999,
  stock: 120,
  status: 'active',
  description: 'Premium quality cotton t-shirt with classic fit.',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['White', 'Black', 'Gray'],
  createdAt: '2023-06-15',
  updatedAt: '2023-10-05',
  image: 'https://placehold.co/400x400',
  images: [
    'https://placehold.co/400x400/eee/ccc',
    'https://placehold.co/400x400/ddd/aaa',
    'https://placehold.co/400x400/ccc/999',
  ],
  featured: false,
  discount: 0,
  specifications: {
    material: 'Cotton',
    fit: 'Regular',
    care: 'Machine wash cold',
    origin: 'India',
  },
};

const ProductEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);
  
  // Product form state
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'draft',
    description: '',
    featured: false,
    discount: '0',
    image: '',
    material: '',
    fit: '',
    care: '',
    origin: '',
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Fetch product data - in a real app, this would be an API call
      // For now, we'll use mock data
      const fetchedProduct = MOCK_PRODUCT;
      
      setProduct({
        name: fetchedProduct.name,
        sku: fetchedProduct.sku,
        category: fetchedProduct.category,
        price: String(fetchedProduct.price),
        stock: String(fetchedProduct.stock),
        status: fetchedProduct.status,
        description: fetchedProduct.description,
        featured: fetchedProduct.featured,
        discount: String(fetchedProduct.discount),
        image: fetchedProduct.image,
        material: fetchedProduct.specifications.material,
        fit: fetchedProduct.specifications.fit,
        care: fetchedProduct.specifications.care,
        origin: fetchedProduct.specifications.origin,
      });
    }
  }, [id, isEditMode]);
  
  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setProduct(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: checked }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.sku.trim()) newErrors.sku = 'SKU is required';
    if (!product.category) newErrors.category = 'Category is required';
    
    // Price validation
    if (!product.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(product.price)) || Number(product.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    // Stock validation
    if (!product.stock) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(Number(product.stock)) || Number(product.stock) < 0) {
      newErrors.stock = 'Stock must be a valid positive number';
    }
    
    // Discount validation
    if (product.discount && (isNaN(Number(product.discount)) || Number(product.discount) < 0 || Number(product.discount) > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Switch to the tab that contains the first error
      const errorFields = Object.keys(errors);
      if (errorFields.includes('name') || errorFields.includes('sku') || 
          errorFields.includes('category') || errorFields.includes('price') || 
          errorFields.includes('stock') || errorFields.includes('status')) {
        setActiveTab('basic');
      } else if (errorFields.includes('description') || errorFields.includes('featured') || 
                errorFields.includes('discount')) {
        setActiveTab('details');
      } else if (errorFields.includes('material') || errorFields.includes('fit') || 
                errorFields.includes('care') || errorFields.includes('origin')) {
        setActiveTab('specifications');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to save the product
      console.log('Saving product:', product);
      
      toast({
        title: isEditMode ? 'Product updated' : 'Product created',
        description: `${product.name} has been ${isEditMode ? 'updated' : 'created'} successfully.`,
      });
      
      setIsSubmitting(false);
      navigate('/admin/products');
    }, 1000);
  };
  
  // Handle product deletion
  const handleDelete = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to delete the product
      console.log('Deleting product:', id);
      
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully.',
      });
      
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      navigate('/admin/products');
    }, 1000);
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Update the product information below' 
              : 'Fill in the product information below'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Image upload */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload the main product image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  {product.image ? (
                    <div className="relative mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name || 'Product image'} 
                        className="w-full h-64 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        type="button"
                        onClick={() => setProduct(prev => ({ ...prev, image: '' }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-md p-12 mb-4 text-center">
                      <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop or click to upload
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      // In a real app, this would open a file dialog
                      setProduct(prev => ({ 
                        ...prev, 
                        image: prev.image 
                          ? '' 
                          : 'https://placehold.co/400x400' 
                      }));
                    }}
                  >
                    {product.image ? 'Remove Image' : 'Upload Image'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Product details */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Essential product details and inventory information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. Classic White T-shirt"
                          value={product.name}
                          onChange={handleChange}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sku"
                          name="sku"
                          placeholder="e.g. TS-WHT-001"
                          value={product.sku}
                          onChange={handleChange}
                          className={errors.sku ? 'border-red-500' : ''}
                        />
                        {errors.sku && (
                          <p className="text-xs text-red-500">{errors.sku}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={product.category}
                          onValueChange={(value) => handleSelectChange(value, 'category')}
                        >
                          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-xs text-red-500">{errors.category}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">
                            Price (in paisa) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="e.g. 1999"
                            value={product.price}
                            onChange={handleChange}
                            className={errors.price ? 'border-red-500' : ''}
                          />
                          {errors.price && (
                            <p className="text-xs text-red-500">{errors.price}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Enter price in paisa (e.g. 1999 for ₹19.99)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stock">
                            Stock <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="stock"
                            name="stock"
                            type="number"
                            placeholder="e.g. 100"
                            value={product.stock}
                            onChange={handleChange}
                            className={errors.stock ? 'border-red-500' : ''}
                          />
                          {errors.stock && (
                            <p className="text-xs text-red-500">{errors.stock}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">
                          Status <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={product.status}
                          onValueChange={(value) => handleSelectChange(value, 'status')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            <SelectItem value="low_stock">Low Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Additional information about the product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed product description..."
                        value={product.description}
                        onChange={handleChange}
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={product.featured}
                            onChange={handleCheckboxChange}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="featured">Featured Product</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Featured products appear on the homepage
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          placeholder="e.g. 10"
                          value={product.discount}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          className={errors.discount ? 'border-red-500' : ''}
                        />
                        {errors.discount && (
                          <p className="text-xs text-red-500">{errors.discount}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Specifications</CardTitle>
                    <CardDescription>
                      Technical details and specifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Input
                          id="material"
                          name="material"
                          placeholder="e.g. Cotton, Polyester"
                          value={product.material}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fit">Fit</Label>
                        <Input
                          id="fit"
                          name="fit"
                          placeholder="e.g. Regular, Slim"
                          value={product.fit}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="care">Care Instructions</Label>
                        <Input
                          id="care"
                          name="care"
                          placeholder="e.g. Machine wash cold"
                          value={product.care}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="origin">Country of Origin</Label>
                        <Input
                          id="origin"
                          name="origin"
                          placeholder="e.g. India"
                          value={product.origin}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-2">
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting 
                ? isEditMode ? 'Updating...' : 'Creating...' 
                : isEditMode ? 'Update Product' : 'Create Product'
              }
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductEditPage; 