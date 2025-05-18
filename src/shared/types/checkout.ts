/**
 * Type definitions for checkout process
 */

export interface AddressDetails {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface PaymentMethod {
  type: 'card' | 'upi' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  upiId?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export enum CheckoutStep {
  Shipping = 'shipping',
  Payment = 'payment',
  Review = 'review',
}

export interface Order {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    color?: string;
  }[];
  shippingAddress: AddressDetails;
  billingAddress: AddressDetails;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  summary: OrderSummary;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  dateCreated: string;
} 