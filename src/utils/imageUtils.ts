import { Product, ProductVariant } from '@shared/types';

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}

interface CloudinaryImage {
  public_id: string;
  url?: string;
}

/**
 * Generate a Cloudinary URL from a public_id
 * @param {string} publicId - Cloudinary public_id
 * @param {CloudinaryOptions} options - Optional transformation parameters
 * @returns {string} - Generated Cloudinary URL
 */
export const generateCloudinaryUrl = (publicId: string, options: CloudinaryOptions = {}) => {
  if (!publicId) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.error('Cloudinary cloud name not configured');
    return '';
  }

  // Map parameter names to Cloudinary's single-letter prefixes
  const paramMap: Record<string, string> = {
    width: 'w',
    height: 'h',
    crop: 'c',
    quality: 'q',
    format: 'f',
    fetch_format: 'f'
  };

  // Build transformation string with proper format
  const transformations = Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const param = paramMap[key] || key;
      return `${param}_${value}`;
    })
    .join(',');

  const transformedImage = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  console.log("Transformed image:", transformedImage);

  return transformedImage;
};

/**
 * Extract public ID from a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Extracted public ID or null
 */
export const extractPublicId = (url: string): string | null => {
  if (!url) return null;

  const matches = url.match(/\/v\d+\/([^/]+)\./);
  return matches ? matches[1] : null;
};

/**
 * Transform product data to include generated image URLs
 * @param {Product} product - Product data from API
 * @returns {Product} - Transformed product with generated image URLs
 */
export const transformProductImages = (product: Product): Product => {
  if (!product) return product;

  const transformedProduct = { ...product };

  // Transform featured image
  if (product.featuredImageUrl) {
    const publicId = extractPublicId(product.featuredImageUrl);
    if (publicId) {
      transformedProduct.featuredImageUrl = generateCloudinaryUrl(publicId, {
        width: 800,
        height: 800,
        crop: 'fill'
      });
    }
  }

  // Transform product images array
  if (Array.isArray(product.images)) {
    transformedProduct.images = product.images.map((image: string | CloudinaryImage) => {
      if (typeof image === 'string') {
        // If it's already a URL, return as is
        return image;
      }
      // If it's an object with public_id, generate URL
      return generateCloudinaryUrl(image.public_id, {
        width: 800,
        height: 800,
        crop: 'fill'
      });
    });
  }

  // Transform variant images if they exist
  if (Array.isArray(product.variants)) {
    transformedProduct.variants = product.variants.map((variant: ProductVariant) => {
      if (variant.imageUrl) {
        const publicId = extractPublicId(variant.imageUrl);
        if (publicId) {
          return {
            ...variant,
            imageUrl: generateCloudinaryUrl(publicId, {
              width: 400,
              height: 400,
              crop: 'fill'
            })
          };
        }
      }
      return variant;
    });
  }

  return transformedProduct;
};

/**
 * Transform an array of products to include generated image URLs
 * @param {Product[]} products - Array of product data from API
 * @returns {Product[]} - Transformed products with generated image URLs
 */
export const transformProductsImages = (products: Product[]): Product[] => {
  if (!Array.isArray(products)) return [];
  return products.map(product => transformProductImages(product));
}; 