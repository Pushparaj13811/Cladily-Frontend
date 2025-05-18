/**
 * Type definitions for cart functionality
 */

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

/**
 * Cart context interface for cart management
 */
export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

/**
 * Props for the CartProvider component
 */
export interface CartProviderProps {
  children: React.ReactNode;
} 