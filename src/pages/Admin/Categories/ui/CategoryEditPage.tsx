import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label';
import { useToast } from '@app/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';
import { Switch } from '@app/components/ui/switch';
import { 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getAllCategories 
} from '@features/dashboard';
import { Category } from '@shared/types';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);
  
  // Category form state
  const [category, setCategory] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: null as string | null,
    isActive: true,
    isVisible: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    imageUrl: '',
    iconUrl: '',
    sortOrder: 0
  });
  
  // UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Available parent categories
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loadingParentCategories, setLoadingParentCategories] = useState(false);
  
  // Load available parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setLoadingParentCategories(true);
        const categories = await getAllCategories();
        
        // When editing, filter out the current category and its children
        const filteredCategories = isEditMode && id 
          ? categories.filter(cat => cat.id !== id && (!cat.path?.includes(`/${id}/`)))
          : categories;
          
        setParentCategories(filteredCategories);
      } catch (error) {
        console.error('Failed to load parent categories:', error);
        toast({
          title: 'Warning',
          description: 'Failed to load parent categories. You can still continue.',
          variant: 'default',
        });
      } finally {
        setLoadingParentCategories(false);
      }
    };
    
    fetchParentCategories();
  }, [id, isEditMode, toast]);
  
  // Load category data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const fetchedCategory = await getCategoryById(id);
          
          setCategory({
            name: fetchedCategory.name,
            slug: fetchedCategory.slug,
            description: fetchedCategory.description || '',
            parentId: fetchedCategory.parentId || null,
            isActive: fetchedCategory.isActive,
            isVisible: fetchedCategory.isVisible,
            metaTitle: fetchedCategory.metaTitle || '',
            metaDescription: fetchedCategory.metaDescription || '',
            metaKeywords: fetchedCategory.metaKeywords || '',
            imageUrl: fetchedCategory.imageUrl || '',
            iconUrl: fetchedCategory.iconUrl || '',
            sortOrder: fetchedCategory.sortOrder || 0
          });
          setIsLoading(false);
        } catch (error: unknown) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to load category data',
            variant: 'destructive',
          });
          setIsLoading(false);
          navigate('/admin/categories');
        }
      };
      
      fetchCategory();
    }
  }, [id, isEditMode, navigate, toast]);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Auto-generate slug when name changes
    if (name === 'name' && (!category.slug || category.slug === slugify(category.name))) {
      setCategory(prev => ({ ...prev, slug: slugify(value) }));
    }
  };
  
  // Handle number field changes
  const handleNumberChange = (name: string, value: string) => {
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setCategory(prev => ({ ...prev, [name]: numericValue }));
    }
  };
  
  // Handle select field changes
  const handleSelectChange = (name: string, value: string | null) => {
    setCategory(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle switch field changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setCategory(prev => ({ ...prev, [name]: checked }));
  };
  
  // Helper function to generate slug
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')       // Trim - from start of text
      .replace(/-+$/, '');      // Trim - from end of text
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!category.name.trim()) newErrors.name = 'Category name is required';
    if (!category.slug.trim()) newErrors.slug = 'Slug is required';
    
    // Slug format validation
    if (category.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Switch to the tab containing the first error
      if (newErrors.name || newErrors.slug || newErrors.description) {
        setActiveTab('basic');
      } else if (newErrors.imageUrl || newErrors.iconUrl) {
        setActiveTab('media');
      } else if (newErrors.metaTitle || newErrors.metaDescription || newErrors.metaKeywords) {
        setActiveTab('seo');
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        await updateCategory(id, category);
        
        toast({
          title: 'Category updated',
          description: `${category.name} has been updated successfully.`,
        });
      } else {
        await createCategory(category);
        
        toast({
          title: 'Category created',
          description: `${category.name} has been created successfully.`,
        });
      }
      
      navigate('/admin/categories');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : (isEditMode ? 'Failed to update category' : 'Failed to create category'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle category deletion
  const handleDelete = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteCategory(id);
      
      toast({
        title: 'Category deleted',
        description: 'The category has been deleted successfully.',
      });
      
      setDeleteDialogOpen(false);
      navigate('/admin/categories');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/admin/categories')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Update the category information below' 
              : 'Fill in the category information below'
            }
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading category data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="media">Media & Display</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential details about your category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Category Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. T-shirts"
                      value={category.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <span className="mr-2 text-muted-foreground">/products/category/</span>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="e.g. t-shirts"
                        value={category.slug}
                        onChange={handleChange}
                        className={errors.slug ? 'border-red-500' : ''}
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-xs text-red-500">{errors.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      The slug is used in the URL of the category page. It should contain only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentId">Parent Category</Label>
                    <Select
                      value={category.parentId || ''}
                      onValueChange={(value) => handleSelectChange('parentId', value === '' ? null : value)}
                    >
                      <SelectTrigger id="parentId">
                        <SelectValue placeholder="No parent (top level category)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No parent (top level category)</SelectItem>
                        {loadingParentCategories ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Loading categories...</span>
                          </div>
                        ) : (
                          parentCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select a parent category if this is a subcategory. Leave empty for a top-level category.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief description of the category..."
                      value={category.description}
                      onChange={handleChange}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      A short description of the category for SEO and display purposes.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      min="0"
                      value={category.sortOrder}
                      onChange={(e) => handleNumberChange('sortOrder', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Categories with higher numbers appear first. Default is 0.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isActive" 
                        checked={category.isActive} 
                        onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                      />
                      <Label htmlFor="isActive">Category is active</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isVisible" 
                        checked={category.isVisible} 
                        onCheckedChange={(checked) => handleSwitchChange('isVisible', checked)}
                      />
                      <Label htmlFor="isVisible">Category is visible in navigation</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Media & Display Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media & Display</CardTitle>
                  <CardDescription>
                    Category images and display settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Category Banner Image</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={category.imageUrl}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL of a banner image for this category. Recommended size: 1200x300px.
                    </p>
                    {category.imageUrl && (
                      <div className="mt-2">
                        <p className="text-xs mb-1">Preview:</p>
                        <div className="h-32 w-full rounded-md overflow-hidden border">
                          <img 
                            src={category.imageUrl} 
                            alt="Category banner" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x300?text=Image+Not+Found';
                            }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="iconUrl">Category Icon</Label>
                    <Input
                      id="iconUrl"
                      name="iconUrl"
                      placeholder="https://example.com/icon.svg"
                      value={category.iconUrl}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL of an icon for this category. Recommended size: 64x64px.
                    </p>
                    {category.iconUrl && (
                      <div className="mt-2">
                        <p className="text-xs mb-1">Preview:</p>
                        <div className="h-16 w-16 rounded-md overflow-hidden border p-2">
                          <img 
                            src={category.iconUrl} 
                            alt="Category icon" 
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Icon';
                            }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* SEO Settings Tab */}
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Search Engine Optimization information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      placeholder="e.g. Men's T-shirts | Store Name"
                      value={category.metaTitle}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      The title that appears in search engine results. If left empty, the category name will be used.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      placeholder="Brief description for search engine results..."
                      value={category.metaDescription}
                      onChange={handleChange}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      A concise description that appears in search engine results. Recommended: 150-160 characters.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      name="metaKeywords"
                      placeholder="e.g. t-shirts, men's clothing, casual wear"
                      value={category.metaKeywords}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated keywords relevant to this category.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/categories')}
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
                  : isEditMode ? 'Update Category' : 'Create Category'
                }
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will also delete all subcategories and remove category associations from products.
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

export default CategoryEditPage; 