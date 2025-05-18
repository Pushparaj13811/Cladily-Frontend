import { useState, useEffect } from 'react';
import { Category, Department } from '@shared/types';
import { 
  getCategoryById, 
  getAllCategories,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@features/dashboard';
import { useToast } from '@app/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Helper function to generate slug
export const slugify = (text: string): string => {
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

export interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  department: Department;
  parentId: string | null;
  isActive: boolean;
  isVisible: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  imageUrl: string;
  iconUrl: string;
  position: number;
}

export interface ParentCategoryFormState {
  name: string;
  slug: string;
  description: string;
  department: Department;
  isActive: boolean;
  isVisible: boolean;
}

export interface UseCategoryFormProps {
  categoryId?: string;
}

export const useCategoryForm = ({ categoryId }: UseCategoryFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(categoryId);
  
  // Category form state
  const [categoryType, setCategoryType] = useState<'parent' | 'sub'>('parent');
  const [category, setCategory] = useState<CategoryFormState>({
    name: '',
    slug: '',
    description: '',
    department: Department.Menswear,
    parentId: null,
    isActive: true,
    isVisible: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    imageUrl: '',
    iconUrl: '',
    position: 0
  });
  
  // UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Parent category dialog state
  const [parentCategoryDialogOpen, setParentCategoryDialogOpen] = useState(false);
  const [newParentCategory, setNewParentCategory] = useState<ParentCategoryFormState>({
    name: '',
    slug: '',
    description: '',
    department: Department.Menswear,
    isActive: true,
    isVisible: true,
  });
  const [creatingParent, setCreatingParent] = useState(false);
  
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
        const filteredCategories = isEditMode && categoryId 
          ? categories.filter(cat => cat.id !== categoryId && (!cat.path?.includes(`/${categoryId}/`)))
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
    
    // Only fetch parent categories once when the component mounts
    if (!loadingParentCategories && parentCategories.length === 0) {
      fetchParentCategories();
    }
  }, [categoryId, isEditMode, toast, loadingParentCategories, parentCategories.length]);
  
  // Load category data if in edit mode
  useEffect(() => {
    if (isEditMode && categoryId) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const fetchedCategory = await getCategoryById(categoryId);
          
          // Determine if this is a parent or sub category
          setCategoryType(fetchedCategory.parentId ? 'sub' : 'parent');
          
          setCategory({
            name: fetchedCategory.name,
            slug: fetchedCategory.slug,
            description: fetchedCategory.description || '',
            department: fetchedCategory.department || Department.Menswear,
            parentId: fetchedCategory.parentId || null,
            isActive: fetchedCategory.isActive,
            isVisible: fetchedCategory.isVisible,
            metaTitle: fetchedCategory.metaTitle || '',
            metaDescription: fetchedCategory.metaDescription || '',
            metaKeywords: fetchedCategory.metaKeywords || '',
            imageUrl: fetchedCategory.imageUrl || '',
            iconUrl: fetchedCategory.iconUrl || '',
            position: fetchedCategory.position || 0
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
  }, [categoryId, isEditMode, navigate, toast]);
  
  // Update department when parent category changes for subcategories
  useEffect(() => {
    if (categoryType === 'sub' && category.parentId) {
      const parentCategory = parentCategories.find(cat => cat.id === category.parentId);
      if (parentCategory) {
        setCategory(prev => ({ 
          ...prev, 
          department: parentCategory.department || Department.Menswear 
        }));
      }
    }
  }, [category.parentId, categoryType, parentCategories]);
  
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
  
  // Handle category type change
  const handleCategoryTypeChange = (value: 'parent' | 'sub') => {
    setCategoryType(value);
    
    // If changing to parent category, clear parentId
    if (value === 'parent') {
      setCategory(prev => ({ ...prev, parentId: null }));
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
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!category.name.trim()) newErrors.name = 'Category name is required';
    if (!category.slug.trim()) newErrors.slug = 'Slug is required';
    
    // Validate parent ID for subcategories
    if (categoryType === 'sub' && !category.parentId) {
      newErrors.parentId = 'A parent category is required for subcategories';
    }
    
    // Slug format validation
    if (category.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Switch to the tab containing the first error
      if (newErrors.name || newErrors.slug || newErrors.description || newErrors.parentId) {
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
      if (isEditMode && categoryId) {
        await updateCategory(categoryId, category);
        
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
    if (!categoryId) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteCategory(categoryId);
      
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
  
  // Reset new parent category form
  const resetNewParentForm = () => {
    setNewParentCategory({
      name: '',
      slug: '',
      description: '',
      department: Department.Menswear,
      isActive: true,
      isVisible: true,
    });
  };
  
  // Generate slug for parent category
  const handleParentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewParentCategory(prev => ({ 
      ...prev, 
      name: value,
      slug: slugify(value)
    }));
  };
  
  // Handle create parent category
  const handleCreateParentCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!newParentCategory.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }
    
    setCreatingParent(true);
    
    try {
      // Create the parent category
      const createdParent = await createCategory(newParentCategory);
      
      // Add to parent categories list
      setParentCategories(prev => [...prev, createdParent]);
      
      // Set as the parent in the current form and use the parent's department or fallback to Menswear
      setCategory(prev => ({ 
        ...prev, 
        parentId: createdParent.id, 
        department: createdParent.department || Department.Menswear 
      }));
      
      // Close dialog and reset form
      setParentCategoryDialogOpen(false);
      resetNewParentForm();
      
      toast({
        title: 'Success',
        description: `Parent category "${createdParent.name}" has been created`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create parent category',
        variant: 'destructive',
      });
    } finally {
      setCreatingParent(false);
    }
  };

  return {
    // State
    category,
    categoryType,
    isLoading,
    isSubmitting,
    activeTab,
    errors,
    deleteDialogOpen,
    parentCategoryDialogOpen,
    newParentCategory,
    creatingParent,
    parentCategories,
    loadingParentCategories,
    isEditMode,
    
    // State setters
    setCategory,
    setCategoryType,
    setActiveTab,
    setDeleteDialogOpen,
    setParentCategoryDialogOpen,
    setNewParentCategory,
    
    // Event handlers
    handleChange,
    handleCategoryTypeChange,
    handleNumberChange,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit,
    handleDelete,
    handleParentNameChange,
    handleCreateParentCategory,
    
    // Utility functions
    validateForm,
    resetNewParentForm,
  };
};

export default useCategoryForm; 