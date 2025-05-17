/**
 * User profile types for the account section
 */

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserCredit {
  availableCredit: number;
  availableRefunds: number;
  pendingCredit: number;
  totalCredit: number;
}

export interface ShoppingPreference {
  id?: string;
  name?: string;
  department: string;
  isSelected: boolean;
}

export interface FavoriteBrand {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface CommunicationPreference {
  id: string;
  type: 'style_updates' | 'exclusive_invitations' | 'editorial_roundup' | 'stock_alerts';
  title: string;
  description: string;
  isSelected: boolean;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  trackingNumber?: string;
}

export interface LanguageOption {
  id: string;
  name: string;
  code: string;
} 