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

// Helper function to generate full slug with department prefix
export const generateFullSlug = (department: Department | string, baseSlug: string): string => {
  const deptSlug = slugify(department.toString());
  const cleanBaseSlug = slugify(baseSlug);
  return `${deptSlug}/${cleanBaseSlug}`;
};

// Helper to extract base slug (without department)
export const extractBaseSlug = (fullSlug: string): string => {
  if (fullSlug && fullSlug.includes('/')) {
    const parts = fullSlug.split('/');
    return parts[parts.length - 1];
  }
  return fullSlug;
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
  
  // Track base slug separately (without department prefix)
  const [baseSlug, setBaseSlug] = useState('');
  
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
          
          // Extract base slug from full slug
          const extractedBaseSlug = extractBaseSlug(fetchedCategory.slug);
          setBaseSlug(extractedBaseSlug);
          
          setCategory({
            name: fetchedCategory.name,
            slug: fetchedCategory.slug, // Keep the original full slug
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
  
  // Update slug when department or base slug changes
  useEffect(() => {
    if (category.department && baseSlug) {
      const fullSlug = generateFullSlug(category.department, baseSlug);
      setCategory(prev => ({ ...prev, slug: fullSlug }));
    }
  }, [category.department, baseSlug]);
  
  // Update department when parent category changes for subcategories
  useEffect(() => {
    if (categoryType === 'sub' && category.parentId) {
      const parentCategory = parentCategories.find(cat => cat.id === category.parentId);
      if (parentCategory) {
        setCategory(prev => ({ 
          ...prev, 
          department: parentCategory.department || Department.Menswear 
        }));
        
        // Don't update the slug here as the department effect will handle it
      }
    }
  }, [category.parentId, categoryType, parentCategories]);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle slug separately to maintain department prefix
    if (name === 'slug') {
      // If user edits the full slug, extract base slug
      if (value.includes('/')) {
        const parts = value.split('/');
        setBaseSlug(parts[parts.length - 1]);
      } else {
        // If no slash, assume user is editing just base part
        setBaseSlug(value);
      }
    } else {
      setCategory(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Auto-generate slug when name changes
    if (name === 'name' && (!baseSlug || baseSlug === slugify(category.name))) {
      setBaseSlug(slugify(value));
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
      // Create API-compatible data object
      const apiCategoryData = {
        ...category,
        // Ensure department is sent as a string value
        department: category.department?.toString() || 'Menswear'
      };
      
      console.log("Submitting category data to API:", apiCategoryData);
      
      if (isEditMode && categoryId) {
        await updateCategory(categoryId, apiCategoryData);
        
        toast({
          title: 'Category updated',
          description: `${category.name} has been updated successfully.`,
        });
        
        navigate('/admin/categories');
      } else {
        await createCategory(apiCategoryData);
        
        toast({
          title: 'Category created',
          description: `${category.name} has been created successfully.`,
        });
        
        navigate('/admin/categories');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : (isEditMode ? 'Failed to update category' : 'Failed to create category');
      
      // Check if it's a slug already exists error
      if (errorMessage.includes('slug already exists')) {
        // Set a more specific error message for slug conflict
        toast({
          title: 'Duplicate Slug',
          description: 'A category with this slug already exists. Please modify the slug to make it unique.',
          variant: 'destructive',
        });
        
        // Suggest alternative slug with random suffix
        const randomSuffix = Math.floor(Math.random() * 1000);
        const newBaseSlug = `${baseSlug}-${randomSuffix}`;
        setBaseSlug(newBaseSlug);
        
        // Set error for the slug field to highlight it
        setErrors({
          ...errors,
          slug: 'A category with this slug already exists'
        });
        
        // Make sure we're on the basic tab to show the error
        setActiveTab('basic');
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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
    const newBaseSlug = slugify(value);
    
    setNewParentCategory(prev => ({ 
      ...prev, 
      name: value,
    }));
    
    // Update full slug with department prefix
    const fullSlug = generateFullSlug(newParentCategory.department, newBaseSlug);
    setNewParentCategory(prev => ({
      ...prev,
      slug: fullSlug
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
      // Create API-compatible data object - ensure department is a string
      const apiParentData = {
        ...newParentCategory,
        department: newParentCategory.department?.toString() || 'Menswear' 
      };
      
      console.log("Submitting parent category to API:", apiParentData);
      
      // Create the parent category
      const createdParent = await createCategory(apiParentData);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create parent category';
      
      // Check if it's a slug already exists error
      if (errorMessage.includes('slug already exists')) {
        // Set a more helpful error message
        toast({
          title: 'Slug Already Used',
          description: 'A category with this slug already exists. Please modify the name or slug to create a unique category.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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
    baseSlug,
    
    // State setters
    setCategory,
    setCategoryType,
    setActiveTab,
    setDeleteDialogOpen,
    setParentCategoryDialogOpen,
    setNewParentCategory,
    setBaseSlug,
    
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
    slugify,
    generateFullSlug,
    extractBaseSlug,
  };
};

export default useCategoryForm; 