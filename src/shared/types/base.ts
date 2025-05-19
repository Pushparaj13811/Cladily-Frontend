/**
 * Base entity interface for common fields across all entities
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
} 