import { User } from './order';

/**
 * Represents a customer in the admin view with additional properties beyond basic user data
 */
export interface Customer extends User {
  status: 'active' | 'inactive';
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

/**
 * Customer status options
 */
export type CustomerStatus = 'active' | 'inactive'; 