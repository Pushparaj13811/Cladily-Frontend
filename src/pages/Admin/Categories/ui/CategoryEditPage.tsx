import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ImagePlus,
  Home,
  Tag
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { useToast } from '@app/hooks/use-toast';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { Switch } from '@app/components/ui/switch';
import { Badge } from '@app/components/ui/badge';
import { 
  createCategory, 
  getCategoryById, 
  updateCategory, 
  deleteCategory,
  getCategoryHierarchy 
} from '@features/dashboard';
import { Category } from '@shared/types';

// Helper functions for category hierarchy
interface CategoryWithDepth extends Category {
  depth?: number;
  children?: CategoryWithDepth[];
}

const filterCategoryHierarchy = (categories: CategoryWithDepth[], currentId: string): CategoryWithDepth[] => {
  return categories
    .filter(category => category.id !== currentId)
    .map(category => ({
      ...category,
      children: category.children 
        ? filterCategoryHierarchy(category.children, currentId)
        : undefined
    }));
};

const flattenCategories = (categories: CategoryWithDepth[], depth = 0, result: CategoryWithDepth[] = []): CategoryWithDepth[] => {
  categories.forEach(category => {
    result.push({ ...category, depth });
    if (category.children && category.children.length > 0) {
      flattenCategories(category.children, depth + 1, result);
    }
  });
  return result;
};

const CategoryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNewCategory = id === 'new';
  const { toast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    metaTitle: '',
    metaDescription: '',
    position: 0,
    isVisible: true,
    imageUrl: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<CategoryWithDepth[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showParentCategoryDialog, setShowParentCategoryDialog] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentSlug, setNewParentSlug] = useState('');
  const [isCreatingParent, setIsCreatingParent] = useState(false);

  // Fetch category if editing
  useEffect(() => {
    const loadData = async () => {
      // Don't attempt to fetch data if we're creating a new category
      if (isNewCategory) {
        setIsLoading(false);
        return;
      }
      
      // Make sure id is valid before making API call
      if (!id || id === 'undefined') {
        setError('Invalid category ID');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const categoryData = await getCategoryById(id);
        setCategory(categoryData);
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setError('Failed to load category');
        toast({
          title: 'Error',
          description: 'Failed to load category details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Prevent fetch if in new category mode
    if (!isNewCategory) {
      loadData();
    }
  }, [id, isNewCategory, toast]);

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        // Don't try to fetch if we have an error state already
        if (error) return;
        
        const categories = await getCategoryHierarchy();
        
        // Make sure we received valid data
        if (!categories || !Array.isArray(categories)) {
          console.error('Invalid categories data received');
          return;
        }
        
        // Filter out the current category and its children (to prevent circular references)
        const filtered = isNewCategory 
          ? categories 
          : filterCategoryHierarchy(categories, id as string);
        
        setParentCategories(flattenCategories(filtered));
      } catch (error) {
        console.error('Failed to fetch parent categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load parent categories',
          variant: 'destructive',
        });
      }
    };

    fetchParentCategories();
  }, [id, isNewCategory, toast, error]);

  // Fix bug with category loading
  useEffect(() => {
    // Only check ID validity for edit mode, not for new categories
    if (!isNewCategory && (!id || id === 'undefined')) {
      setError('Invalid category ID');
      return;
    }
    
    // For new category, always clear any error
    if (isNewCategory) {
      setError(null);
      setIsLoading(false);
    }

    // This helps prevent potential issues with navigation
    return () => {
      // Cleanup
      setIsLoading(false);
      setError(null);
    };
  }, [id, isNewCategory]);

  // Fix potential issues with handling clicks
  const safeNavigate = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Force a reload if navigation fails
      window.location.href = path;
    }
  };

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCategory((prev) => ({ ...prev, [name]: checked }));
  };

  // Improve form submission to handle errors better
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsSaving(true);
      
      if (isNewCategory) {
        await createCategory(category as Category);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      } else {
        await updateCategory(id as string, category);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      }
      
      safeNavigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Improve delete handling
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCategory(id as string);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      safeNavigate('/admin/categories');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCreateParentCategory = async () => {
    if (!newParentName) return;
    
    try {
      setIsCreatingParent(true);
      
      const newParent = await createCategory({
        name: newParentName,
        slug: newParentSlug || newParentName.toLowerCase().replace(/\s+/g, '-'),
        isVisible: true,
      } as Category);
      
      // Add to parent options
      setParentCategories((prev) => [...prev, newParent]);
      
      // Select as parent
      setCategory((prev) => ({ ...prev, parentId: newParent.id }));
      
      // Close dialog and reset
      setShowParentCategoryDialog(false);
      setNewParentName('');
      setNewParentSlug('');
      
      toast({
        title: 'Success',
        description: 'Parent category created successfully',
      });
    } catch (error) {
      console.error('Failed to create parent category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create parent category',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingParent(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading category details...</span>
        </div>
      </div>
    );
  }

  if (error && !isNewCategory) {
    return (
      <div className="p-6 w-full">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Category</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                safeNavigate('/admin/categories');
              }}
            >
              Back to Categories
            </Button>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={(e) => {
            e.preventDefault();
            safeNavigate('/admin/dashboard');
          }}
        >
          <Home className="h-4 w-4 mr-1" />
          Home
        </Button>
        <span className="mx-2">/</span>
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={(e) => {
            e.preventDefault();
            safeNavigate('/admin/categories');
          }}
        >
          <Tag className="h-4 w-4 mr-1" />
          Categories
        </Button>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{isNewCategory ? 'Create Category' : category.name}</span>
      </div>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNewCategory ? 'Create New Category' : `Edit Category: ${category.name}`}
          </h1>
          <p className="text-muted-foreground">
            {isNewCategory ? 'Add a new category to your catalog' : 'Update category details and properties'}
          </p>
        </div>
        <div className="flex gap-3">
          {!isNewCategory && (
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button 
            type="submit"
            form="category-form"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Category
              </>
            )}
          </Button>
      </div>
      </header>

      {/* Form */}
      <form id="category-form" onSubmit={handleSubmit}>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-muted mb-2">
            <TabsTrigger 
              value="basic"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Media Settings
            </TabsTrigger>
            <TabsTrigger 
              value="seo"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              SEO Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General information about the category</CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                    <Label htmlFor="name">Category Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={category.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Electronics"
                      required
              />
            </div>
            <div className="space-y-2">
                    <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                <Input
                  id="slug"
                  name="slug"
                  value={category.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. electronics"
                      required
                />
              <p className="text-xs text-muted-foreground">
                      Used in the URL: /category/<span className="font-medium">{category.slug || 'your-slug'}</span>
              </p>
                  </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                    value={category.description || ''}
                    onChange={handleInputChange}
                    placeholder="Add a description for this category"
                rows={4}
              />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentId">Parent Category</Label>
                    <div className="flex gap-2">
                      <Select
                        value={category.parentId || '_none'}
                        onValueChange={(value) => handleSelectChange('parentId', value === '_none' ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="None (Top Level)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">None (Top Level)</SelectItem>
                          {parentCategories.map((parent) => (
                            <SelectItem key={parent.id} value={parent.id}>
                              {parent.depth && Array(parent.depth).fill('— ').join('')}
                              {parent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => setShowParentCategoryDialog(true)}
                      >
                        Add New
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      type="number"
                      min="0"
                      value={category.position || 0}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Categories are displayed in ascending order by position
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={category.isVisible ?? true}
                    onCheckedChange={(checked) => handleSwitchChange('isVisible', checked)}
                  />
                  <Label htmlFor="isVisible">
                    {category.isVisible ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Visible</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>
                    )}
                  </Label>
                  <span className="text-sm text-muted-foreground ml-2">
                    {category.isVisible
                      ? 'Category is visible on the storefront'
                      : 'Category is hidden from the storefront'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media Settings</CardTitle>
                <CardDescription>Upload and manage category images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Category Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={category.imageUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline" className="shrink-0" type="button">
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>

                {category.imageUrl && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-md p-4 flex justify-center">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="max-h-48 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your category for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={category.metaTitle || ''}
                    onChange={handleInputChange}
                    placeholder="Meta title for SEO"
                  />
                  <p className="text-xs text-muted-foreground">
                    If empty, the category name will be used
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={category.metaDescription || ''}
                    onChange={handleInputChange}
                    placeholder="Meta description for search results"
                    rows={3}
              />
              <p className="text-xs text-muted-foreground">
                    Recommended length: 150-160 characters
              </p>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </form>

      {!isNewCategory && (
        <Card className="mt-8 border-red-100">
          <CardHeader className="border-b border-red-100">
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
            <CardDescription>
              Actions in this section can't be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete this category</h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete a category, it cannot be recovered.
                  {category.childrenCount && category.childrenCount > 0 && (
                    <span className="block text-red-600 mt-1">
                      Warning: This will also delete {category.childrenCount} subcategories!
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this category?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The category "{category.name}" will be
              permanently removed from your catalog.
              {category.childrenCount && category.childrenCount > 0 && (
                <div className="mt-2 p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                  Warning: This category has {category.childrenCount} subcategories that will also be deleted.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Parent Category Dialog */}
      <Dialog open={showParentCategoryDialog} onOpenChange={setShowParentCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Parent Category</DialogTitle>
            <DialogDescription>
              Add a new parent category for quick selection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newParentName">Category Name</Label>
              <Input
                id="newParentName"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                placeholder="e.g. Electronics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newParentSlug">Slug (Optional)</Label>
              <Input
                id="newParentSlug"
                value={newParentSlug}
                onChange={(e) => setNewParentSlug(e.target.value)}
                placeholder="e.g. electronics"
              />
              <p className="text-xs text-muted-foreground">
                If left empty, a slug will be generated from the name
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowParentCategoryDialog(false)}
              disabled={isCreatingParent}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateParentCategory}
              disabled={!newParentName || isCreatingParent}
            >
              {isCreatingParent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Select'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryEditPage; 