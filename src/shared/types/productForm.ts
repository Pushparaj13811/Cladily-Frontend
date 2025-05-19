import { Department, ProductColor, WeightUnit } from './index';

/**
 * Interface for dimensions used in the product form
 */
export interface ProductDimensions {
  length: number | string;
  width: number | string;
  height: number | string;
}

/**
 * Interface for product form state
 */
export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  cost: string;
  sku: string;
  barcode: string;
  weight: string;
  weightUnit: WeightUnit | string;
  dimensions: ProductDimensions;
  status: string;
  taxable: boolean;
  taxCode: string;
  featuredImageUrl: string;
  searchKeywords: string;
  departmentId?: string; // Department ID from the backend
  categoryId: string | null; // Single category ID
  categoryIds: string[]; // For multi-select categories if needed
  colors: ProductColor[];
  tags: string[];
  images: { url: string; altText: string; position: number }[];
  hasVariants: boolean;
  variants: {
    id?: string;
    name: string;
    sku?: string;
    barcode?: string;
    price: string;
    compareAtPrice: string;
    position: number;
    options: Record<string, string>;
    imageUrl?: string;
    inventoryQuantity: number;
    backorder: boolean;
    requiresShipping: boolean;
  }[];
  variantOptions: {
    name: string;
    values: string[];
  }[];
}

/**
 * Props for the BasicInfoTab component
 */
export interface BasicInfoTabProps {
  product: ProductFormState;
  errors: Record<string, string>;
  baseSlug: string;
  department: Department;
  departmentId: string;
  availableDepartments: { id: string; name: string }[];
  availableCategories: { id: string; name: string; department?: Department }[];
  isFetchingDepartments: boolean;
  isFetchingCategories?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string | null) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleDepartmentChange: (value: Department) => void;
  handleDepartmentIdChange: (value: string) => void;
  handleBaseSlugChange: (value: string) => void;
  handleMultiSelectChange: (name: string, values: string[]) => void;
}

/**
 * Props for the ContentTab component
 */
export interface ContentTabProps {
  product: ProductFormState;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Interface for product image with file support
 */
export interface ProductImage {
  url: string;
  altText: string;
  position: number;
  file?: File;
}

/**
 * Props for the ImagesTab component
 */
export interface ImagesTabProps {
  images: ProductImage[];
  onAddImage: (image: { url: string; altText: string; file?: File }) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (images: ProductImage[]) => void;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

/**
 * Props for the useProductForm hook
 */
export interface UseProductFormProps {
  productId?: string;
} 