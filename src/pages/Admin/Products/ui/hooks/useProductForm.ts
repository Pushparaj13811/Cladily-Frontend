import { useState, useEffect } from 'react';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductColor, 
  Department,
  WeightUnit,
  ProductFormState
} from '@shared/types';
import { 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '@features/dashboard/productAPI';
import { getCategoriesByDepartment } from '@features/dashboard/categoryAPI';
import { useToast } from '@app/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Update the ProductImages interface to include optional file property
interface ProductImage {
  url: string;
  altText: string;
  position: number;
  file?: File;
}

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

// Helper function to generate department-based slug
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

// Interface for helper props
export interface UseProductFormProps {
  productId?: string;
}

export const useProductForm = ({ productId }: UseProductFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(productId);
  
  // Product form state
  const [product, setProduct] = useState<ProductFormState>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    cost: '',
    sku: '',
    barcode: '',
    weight: '',
    weightUnit: WeightUnit.KILOGRAMS,
    dimensions: { length: '', width: '', height: '' },
    status: 'DRAFT',
    taxable: true,
    taxCode: '',
    featuredImageUrl: '',
    searchKeywords: '',
    brandId: null,
    categoryId: null,
    categoryIds: [],
    colors: [],
    tags: [],
    images: [],
    hasVariants: false,
    variants: [],
    variantOptions: []
  });
  
  // Track base slug separately (without department prefix)
  const [baseSlug, setBaseSlug] = useState('');
  const [department, setDepartment] = useState<Department>(Department.Menswear);
  
  // Track uploaded image files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Available options
  const [availableBrands] = useState<{ id: string; name: string }[]>([
    { id: 'brand1', name: 'Nike' },
    { id: 'brand2', name: 'Adidas' },
    { id: 'brand3', name: 'Puma' },
    { id: 'brand4', name: 'Under Armour' }
  ]);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; department: Department }[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  
  // Load available categories based on selected department
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        
        // Fetch categories for the selected department
        const categoriesData = await getCategoriesByDepartment(department);
        
        // Transform the data for use in the form
        const formattedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          department: category.department as Department || Department.Menswear
        }));
        
        setAvailableCategories(formattedCategories);
        
        // Clear the selected category if it doesn't belong to the new department
        if (product.categoryId) {
          const categoryStillExists = formattedCategories.some(cat => cat.id === product.categoryId);
          if (!categoryStillExists) {
            setProduct(prev => ({
              ...prev,
              categoryId: null
            }));
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsFetchingCategories(false);
      }
    };
    
    fetchCategories();
  }, [department, toast]); // Dependency on department ensures categories are updated when department changes
  
  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const fetchedProduct = await getProductById(productId);
          
          // Extract department from slug or first category
          let productDepartment = Department.Menswear;
          if (fetchedProduct.slug && fetchedProduct.slug.includes('/')) {
            const deptSlug = fetchedProduct.slug.split('/')[0];
            if (deptSlug === 'womenswear') productDepartment = Department.Womenswear;
            else if (deptSlug === 'kidswear') productDepartment = Department.Kidswear;
          }
          setDepartment(productDepartment);
          
          // Extract base slug
          const extractedBaseSlug = extractBaseSlug(fetchedProduct.slug || '');
          setBaseSlug(extractedBaseSlug);
          
          // Convert API product to form state
          setProduct({
            name: fetchedProduct.name,
            slug: fetchedProduct.slug || '',
            description: fetchedProduct.description || '',
            shortDescription: fetchedProduct.shortDescription || '',
            price: fetchedProduct.price?.toString() || '',
            compareAtPrice: fetchedProduct.originalPrice?.toString() || '',
            cost: '',
            sku: fetchedProduct.sku || '',
            barcode: fetchedProduct.barcode || '',
            weight: '',
            weightUnit: WeightUnit.KILOGRAMS,
            dimensions: { length: '', width: '', height: '' },
            status: 'ACTIVE',
            taxable: true,
            taxCode: '',
            featuredImageUrl: fetchedProduct.image || '',
            searchKeywords: '',
            brandId: null,
            categoryId: fetchedProduct.category || null,
            categoryIds: [],
            colors: fetchedProduct.colors || [],
            tags: [],
            images: fetchedProduct.images?.map((url, index) => ({ 
              url, 
              altText: fetchedProduct.name, 
              position: index 
            })) || [],
            hasVariants: false,
            variants: [],
            variantOptions: []
          });
          
          setIsLoading(false);
        } catch (error: unknown) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to load product data',
            variant: 'destructive',
          });
          setIsLoading(false);
          navigate('/admin/products');
        }
      };
      
      fetchProduct();
    }
  }, [productId, isEditMode, navigate, toast]);
  
  // Update slug when department or base slug changes
  useEffect(() => {
    if (department && baseSlug) {
      const fullSlug = generateFullSlug(department, baseSlug);
      setProduct(prev => ({ ...prev, slug: fullSlug }));
    }
  }, [department, baseSlug]);
  
  // Handle text field changes
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
    
    // Auto-generate slug when name changes
    if (name === 'name' && (!baseSlug || baseSlug === slugify(product.name))) {
      setBaseSlug(slugify(value));
    }
  };
  
  // Handle department change
  const handleDepartmentChange = (value: Department) => {
    setDepartment(value);
    
    // The category will be reset in the useEffect that fetches categories by department
  };
  
  // Set baseSlug with validation
  const handleBaseSlugChange = (value: string) => {
    // Sanitize the slug input to allow only lowercase letters, numbers, and hyphens
    const sanitizedSlug = value.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')  // Remove all chars except lowercase letters, numbers and hyphens
      .replace(/--+/g, '-')        // Replace multiple hyphens with single hyphen
      .replace(/^-+/, '')          // Remove hyphens from start
      .replace(/-+$/, '');         // Remove hyphens from end
    
    setBaseSlug(sanitizedSlug);
  };
  
  // Handle number field changes
  const handleNumberChange = (name: string, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setProduct(prev => ({ ...prev, [name]: numericValue }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select field changes
  const handleSelectChange = (name: string, value: string | null) => {
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
  
  // Handle multi-select changes
  const handleMultiSelectChange = (name: string, values: string[]) => {
    setProduct(prev => ({ ...prev, [name]: values }));
    
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
    setProduct(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle color adding
  const handleAddColor = (color: ProductColor) => {
    setProduct(prev => ({
      ...prev,
      colors: [...prev.colors, color]
    }));
  };
  
  // Handle color removing
  const handleRemoveColor = (index: number) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };
  
  // Handle image adding with file
  const handleAddImage = (image: { url: string; altText: string; file?: File }) => {
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, { ...image, position: prev.images.length }]
    }));
  };
  
  // Handle image removing
  const handleRemoveImage = (index: number) => {
    const image = product.images[index];
    
    // If it's an existing image (not just a local preview),
    // add the URL to the list of images to delete on save
    if (image.url && !image.url.startsWith('blob:')) {
      setImagesToDelete(prev => [...prev, image.url]);
    }
    
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Handle image reordering
  const handleReorderImages = (images: ProductImage[]) => {
    setProduct(prev => ({
      ...prev,
      images
    }));
  };
  
  // Handle dimensions change
  const handleDimensionsChange = (dimension: 'length' | 'width' | 'height', value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setProduct(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: numericValue
      }
    }));
  };
  
  // Handle variant toggle
  const handleVariantToggle = (hasVariants: boolean) => {
    setProduct(prev => ({
      ...prev,
      hasVariants
    }));
  };

  // Handle adding a variant option (like Size or Color)
  const handleAddVariantOption = (option: { name: string; values: string[] }) => {
    setProduct(prev => ({
      ...prev,
      variantOptions: [...prev.variantOptions, option]
    }));
  };

  // Handle updating a variant option
  const handleUpdateVariantOption = (index: number, option: { name: string; values: string[] }) => {
    setProduct(prev => {
      const updatedOptions = [...prev.variantOptions];
      updatedOptions[index] = option;
      return {
        ...prev,
        variantOptions: updatedOptions
      };
    });
  };

  // Handle removing a variant option
  const handleRemoveVariantOption = (index: number) => {
    setProduct(prev => ({
      ...prev,
      variantOptions: prev.variantOptions.filter((_, i) => i !== index)
    }));
  };

  // Generate variants from options
  const handleGenerateVariants = () => {
    // Generate combinations of options
    const generateCombinations = (options: { name: string; values: string[] }[]) => {
      if (options.length === 0) return [];

      // Start with the first option's values
      let combinations = options[0].values.map(value => ({ 
        [options[0].name]: value 
      }));

      // For each additional option, multiply the combinations
      for (let i = 1; i < options.length; i++) {
        const option = options[i];
        const newCombinations: Record<string, string>[] = [];

        // For each existing combination
        combinations.forEach(combo => {
          // Add each value of the current option
          option.values.forEach(value => {
            newCombinations.push({
              ...combo,
              [option.name]: value
            });
          });
        });

        combinations = newCombinations;
      }

      return combinations;
    };

    const combinations = generateCombinations(product.variantOptions);
    
    // Create variants from combinations
    const newVariants = combinations.map((combo, index) => {
      // Create a name based on the options
      const name = Object.values(combo).join(' / ');

      return {
        name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: `${product.sku || ''}-${index + 1}`.replace(/^-/, ''),
        position: index,
        options: combo,
        inventoryQuantity: 0,
        backorder: false,
        requiresShipping: true
      };
    });

    // Update product with new variants
    setProduct(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  // Handle updating a variant
  const handleUpdateVariant = (index: number, variant: {
    name: string;
    price: string;
    compareAtPrice: string;
    sku?: string;
    barcode?: string;
    position: number;
    options: Record<string, string>;
    imageUrl?: string;
    inventoryQuantity: number;
    backorder: boolean;
    requiresShipping: boolean;
  }) => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = variant;
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  // Handle removing a variant
  const handleRemoveVariant = (index: number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.slug.trim()) newErrors.slug = 'Slug is required';
    if (!product.price.trim() || isNaN(Number(product.price))) newErrors.price = 'Valid price is required';
    
    // Slug format validation with department support
    if (product.slug) {
      const slugParts = product.slug.split('/');
      
      // Check if each part follows the slug rules
      const isValidSlug = slugParts.every(part => 
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part)
      );
      
      if (!isValidSlug) {
        newErrors.slug = 'Each part of the slug can only contain lowercase letters, numbers, and hyphens';
      }
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Switch to the tab containing the first error
      if (newErrors.name || newErrors.slug || newErrors.price || newErrors.sku) {
        setActiveTab('basic');
      } else if (newErrors.description || newErrors.shortDescription) {
        setActiveTab('content');
      } else if (Object.keys(newErrors).some(key => ['weight', 'dimensions'].includes(key))) {
        setActiveTab('shipping');
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create API-compatible data object
      const productData: CreateProductDto = {
        name: product.name,
        price: product.price,
        originalPrice: product.compareAtPrice || null,
        image: product.featuredImageUrl || product.images[0]?.url || '',
        discount: null, // Calculate this if needed
        department: department.toString(),
        description: product.description,
        material: '', // Add this to your form if needed
        care: [], // Add this to your form if needed
        features: [], // Add this to your form if needed
        sizes: [], // Add this to your form if needed
        colors: product.colors,
        category: product.categoryId || product.categoryIds[0] || '',
        categoryIds: product.categoryIds,
        subcategory: '', // Set this if you have subcategories
        deliveryInfo: '',
        inStock: true,
        images: product.images.map(img => img.url),
        hasVariants: product.hasVariants,
        variants: product.hasVariants ? product.variants : undefined
      };
      
      console.log("Submitting product data to API:", productData);
      
      // Extract files from product.images
      const imageFiles = uploadedFiles.filter(file => {
        // Only include files that are still referenced in the product.images array
        return product.images.some(img => {
          // Check if any image has this file attached
          if ('file' in img && img.file) {
            return Object.is(img.file, file);
          }
          return false;
        });
      });
      
      if (isEditMode && productId) {
        await updateProduct(
          productId, 
          productData as UpdateProductDto, 
          imageFiles,
          imagesToDelete
        );
        
        toast({
          title: 'Product updated',
          description: `${product.name} has been updated successfully.`,
        });
        
        navigate('/admin/products');
      } else {
        await createProduct(productData, imageFiles);
        
        toast({
          title: 'Product created',
          description: `${product.name} has been created successfully.`,
        });
        
        navigate('/admin/products');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : (isEditMode ? 'Failed to update product' : 'Failed to create product');
      
      // Check if it's a slug already exists error
      if (errorMessage.includes('slug already exists')) {
        // Set a more specific error message for slug conflict
        toast({
          title: 'Duplicate Slug',
          description: 'A product with this slug already exists. Please modify the slug to make it unique.',
          variant: 'destructive',
        });
        
        // Suggest alternative slug with random suffix
        const randomSuffix = Math.floor(Math.random() * 1000);
        const newBaseSlug = `${baseSlug}-${randomSuffix}`;
        setBaseSlug(newBaseSlug);
        
        // Set error for the slug field to highlight it
        setErrors({
          ...errors,
          slug: 'A product with this slug already exists'
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
  
  // Handle product deletion
  const handleDelete = async () => {
    if (!productId) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteProduct(productId);
      
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully.',
      });
      
      setDeleteDialogOpen(false);
      navigate('/admin/products');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // State
    product,
    isLoading,
    isSubmitting,
    activeTab,
    errors,
    deleteDialogOpen,
    isEditMode,
    baseSlug,
    department,
    availableBrands,
    availableCategories,
    isFetchingCategories,
    uploadedFiles,
    
    // State setters
    setProduct,
    setActiveTab,
    setDeleteDialogOpen,
    setBaseSlug,
    setDepartment,
    setUploadedFiles,
    
    // Event handlers
    handleChange,
    handleNumberChange,
    handleSelectChange,
    handleMultiSelectChange,
    handleSwitchChange,
    handleDepartmentChange,
    handleBaseSlugChange,
    handleAddColor,
    handleRemoveColor,
    handleAddImage,
    handleRemoveImage,
    handleReorderImages,
    handleDimensionsChange,
    handleSubmit,
    handleDelete,
    
    // Variant handlers
    handleVariantToggle,
    handleAddVariantOption,
    handleUpdateVariantOption,
    handleRemoveVariantOption,
    handleGenerateVariants,
    handleUpdateVariant,
    handleRemoveVariant,
    
    // Utility functions
    validateForm,
    slugify,
    generateFullSlug,
    extractBaseSlug,
  };
};

export default useProductForm; 