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
  brandId: string | null;
  categoryId: string | null; // Single category ID
  categoryIds: string[]; // For multi-select categories if needed
  colors: ProductColor[];
  tags: string[];
  images: { url: string; altText: string; position: number }[];
}

/**
 * Props for the BasicInfoTab component
 */
export interface BasicInfoTabProps {
  product: ProductFormState;
  errors: Record<string, string>;
  baseSlug: string;
  department: Department;
  availableBrands: { id: string; name: string }[];
  availableCategories: { id: string; name: string; department?: Department }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string | null) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleDepartmentChange: (value: Department) => void;
  handleBaseSlugChange: (value: string) => void;
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
 * Props for the ImagesTab component
 */
export interface ImagesTabProps {
  product: ProductFormState;
  errors: Record<string, string>;
  handleAddImage: (image: { url: string; altText: string }) => void;
  handleRemoveImage: (index: number) => void;
  handleReorderImages: (images: { url: string; altText: string; position: number }[]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Props for the useProductForm hook
 */
export interface UseProductFormProps {
  productId?: string;
} 