// Order and related interfaces for the e-commerce application

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  fullName?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  fullName?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  user: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  items: OrderItem[];
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cash_on_delivery';
  paymentStatus?: 'paid' | 'pending' | 'refunded' | 'failed';
  createdAt: string;
  updatedAt?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  timeline?: TimelineEvent[];
} 