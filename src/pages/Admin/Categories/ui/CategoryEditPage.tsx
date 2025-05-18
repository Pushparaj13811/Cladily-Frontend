import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
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

// Mock category data for edit mode
const MOCK_CATEGORY = {
  id: 'cat1',
  name: 'T-shirts',
  slug: 't-shirts',
  description: 'Casual and comfortable t-shirts for everyday wear',
  productsCount: 24,
  createdAt: '2023-05-10',
  updatedAt: '2023-09-20',
};

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
  });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load category data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Fetch category data - in a real app, this would be an API call
      // For now, we'll use mock data
      const fetchedCategory = MOCK_CATEGORY;
      
      setCategory({
        name: fetchedCategory.name,
        slug: fetchedCategory.slug,
        description: fetchedCategory.description,
      });
    }
  }, [id, isEditMode]);
  
  // Handle field changes
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
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to save the category
      console.log('Saving category:', category);
      
      toast({
        title: isEditMode ? 'Category updated' : 'Category created',
        description: `${category.name} has been ${isEditMode ? 'updated' : 'created'} successfully.`,
      });
      
      setIsSubmitting(false);
      navigate('/admin/categories');
    }, 1000);
  };
  
  // Handle category deletion
  const handleDelete = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to delete the category
      console.log('Deleting category:', id);
      
      toast({
        title: 'Category deleted',
        description: 'The category has been deleted successfully.',
      });
      
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      navigate('/admin/categories');
    }, 1000);
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

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Basic information about the product category
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
          </CardContent>
        </Card>

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will not delete the products in this category, but they will no longer be associated with this category.
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