/**
 * Export all types from the types module
 */
export * from './auth';
export * from './cart';
export * from './product';
export * from './toast';
export * from './ui';
export * from './checkout'; 
export * from './store';
export * from './footer';
export * from './category';
export * from './base';
export * from './productForm';

// Export admin types using namespace to avoid ambiguities with checkout
import * as AdminTypes from './admin';
export { AdminTypes };

// Re-export important enums for easy access
export { Department } from './category';
export { WeightUnit } from './product';