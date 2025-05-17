/**
 * Status badge variant mapping for orders, products, and other entities
 */
export interface StatusBadgeInfo {
  variant: 'default' | 'outline' | 'secondary' | 'destructive';
  label: string;
}

/**
 * Payment method options for orders
 */
export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cash_on_delivery';

/**
 * Status options for orders
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Status options for payment
 */
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

/**
 * Status options for products
 */
export type ProductStatus = 'active' | 'draft' | 'out_of_stock' | 'low_stock';

/**
 * Timeline event types
 */
export type TimelineEventType = 
  | 'order_placed' 
  | 'payment_received' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

/**
 * Carrier options for shipping
 */
export type ShippingCarrier = 'BlueDart' | 'DTDC' | 'FedEx' | 'Delhivery'; 