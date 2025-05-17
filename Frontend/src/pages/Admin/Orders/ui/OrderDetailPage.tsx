import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Check, X, Truck, Clock, AlertTriangle, Calendar, Package, Mail, Phone, Home, CreditCard } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { formatCurrency } from '@shared/utils/format';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Textarea } from '@app/components/ui/textarea';
import { Badge } from '@app/components/ui/badge';
import { PRODUCTS } from '@shared/constants/products';
import { Order } from '@shared/types/order';

// Mock orders based on product data
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    user: {
      id: 'USR-101',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+91 98765 43210',
    },
    status: 'pending',
    total: 299900,
    subtotal: 279900,
    tax: 10000,
    shipping: 10000,
    items: [
      { 
        id: PRODUCTS.FEATURED[0].id.toString(), 
        name: PRODUCTS.FEATURED[0].name, 
        price: parseInt(PRODUCTS.FEATURED[0].price.replace('₹', '')), 
        quantity: 1,
        size: 'M',
        color: 'Black',
      },
      { 
        id: PRODUCTS.FEATURED[1].id.toString(), 
        name: PRODUCTS.FEATURED[1].name, 
        price: parseInt(PRODUCTS.FEATURED[1].price.replace('₹', '')), 
        quantity: 1 
      },
    ],
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2023-11-25T09:24:00',
    updatedAt: '2023-11-25T09:30:00',
    shippingAddress: {
      fullName: 'John Smith',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+91 98765 43210',
    },
    billingAddress: {
      fullName: 'John Smith',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    trackingNumber: '',
    carrier: '',
    notes: 'Customer requested gift wrapping.',
    timeline: [
      {
        status: 'order_placed',
        timestamp: '2023-11-25T09:24:00',
        note: 'Order placed by customer.',
      },
      {
        status: 'payment_received',
        timestamp: '2023-11-25T09:25:00',
        note: 'Payment received via Credit Card.',
      },
    ],
  },
  {
    id: 'ORD-1003',
    user: {
      id: 'USR-103',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 87654 32109',
    },
    status: 'shipped',
    total: 799900,
    subtotal: 749900,
    tax: 30000,
    shipping: 20000,
    items: [
      { 
        id: PRODUCTS.RELATED[0].id.toString(), 
        name: PRODUCTS.RELATED[0].name, 
        price: parseInt(PRODUCTS.RELATED[0].price.replace('₹', '')), 
        quantity: 1,
        size: 'L',
        color: 'Black',
      },
      { 
        id: PRODUCTS.RELATED[1].id.toString(), 
        name: PRODUCTS.RELATED[1].name, 
        price: parseInt(PRODUCTS.RELATED[1].price.replace('₹', '')), 
        quantity: 2,
        size: 'M',
        color: 'White',
      },
    ],
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2023-11-23T11:12:00',
    updatedAt: '2023-11-24T10:30:00',
    shippingAddress: {
      fullName: 'Rahul Sharma',
      street: '789 Lake Road',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
      phone: '+91 87654 32109',
    },
    billingAddress: {
      fullName: 'Rahul Sharma',
      street: '789 Lake Road',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
    trackingNumber: 'TRK12345678IN',
    carrier: 'BlueDart',
    notes: 'Express shipping requested.',
    timeline: [
      {
        status: 'order_placed',
        timestamp: '2023-11-23T11:12:00',
        note: 'Order placed by customer.',
      },
      {
        status: 'payment_received',
        timestamp: '2023-11-23T11:15:00',
        note: 'Payment received via Credit Card.',
      },
      {
        status: 'processing',
        timestamp: '2023-11-23T14:30:00',
        note: 'Order is being processed.',
      },
      {
        status: 'shipped',
        timestamp: '2023-11-24T10:30:00',
        note: 'Order has been shipped via BlueDart. Tracking number: TRK12345678IN',
      },
    ],
  },
];

// Status icon mapping
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    pending: <Clock className="h-5 w-5 text-amber-500" />,
    processing: <Package className="h-5 w-5 text-blue-500" />,
    shipped: <Truck className="h-5 w-5 text-indigo-500" />,
    delivered: <Check className="h-5 w-5 text-green-500" />,
    cancelled: <X className="h-5 w-5 text-red-500" />,
  };

  return iconMap[status] || <AlertTriangle className="h-5 w-5 text-gray-500" />;
};

// Event icon mapping
const getEventIcon = (status: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    order_placed: <Package className="h-4 w-4 text-blue-500" />,
    payment_received: <CreditCard className="h-4 w-4 text-green-500" />,
    processing: <Package className="h-4 w-4 text-amber-500" />,
    shipped: <Truck className="h-4 w-4 text-indigo-500" />,
    delivered: <Check className="h-4 w-4 text-green-500" />,
    cancelled: <X className="h-4 w-4 text-red-500" />,
  };

  return iconMap[status] || <Calendar className="h-4 w-4 text-gray-500" />;
};

// Format timestamp to readable format
const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Find the order with the matching ID
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  
  // States for editing
  const [orderStatus, setOrderStatus] = useState<string>(order?.status || '');
  const [trackingNumber, setTrackingNumber] = useState<string>(order?.trackingNumber || '');
  const [carrier, setCarrier] = useState<string>(order?.carrier || '');
  const [orderNotes, setOrderNotes] = useState<string>(order?.notes || '');
  
  // If order doesn't exist, show a message
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Order Not Found</h2>
          <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Handle status update
  const handleStatusUpdate = () => {
    // In a real application, this would make an API call
    console.log(`Updating order ${order.id} status to ${orderStatus}`);
    
    if (orderStatus === 'shipped' && (!trackingNumber || !carrier)) {
      alert('Please provide tracking number and carrier for shipped orders.');
      return;
    }
    
    // For demo purposes, just log the changes
    console.log({
      orderId: order.id,
      status: orderStatus,
      trackingNumber,
      carrier,
      notes: orderNotes,
    });
    
    // Show success message (would be a toast in a real app)
    alert('Order updated successfully!');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with back button, title, and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold mt-2">Order {order.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {getStatusIcon(order.status)}
              <span className="ml-2 text-muted-foreground capitalize">{order.status}</span>
            </div>
            <span className="text-muted-foreground mx-2">•</span>
            <div className="text-muted-foreground">
              <Calendar className="inline h-4 w-4 mr-1" />
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Order
          </Button>
          <Button variant="default" size="sm" onClick={handleStatusUpdate}>
            <Check className="mr-2 h-4 w-4" />
            Update Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Customer & Shipping */}
        <div className="md:col-span-1 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{order.user.name}</h4>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {order.user.email}
                  </div>
                  {order.user.phone && (
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.user.phone}
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Shipping Address
                  </h4>
                  <address className="text-sm text-muted-foreground mt-1 not-italic">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                    {order.shippingAddress.phone && (
                      <>
                        <br />
                        {order.shippingAddress.phone}
                      </>
                    )}
                  </address>
                </div>
                
                {order.billingAddress && (
                  <div>
                    <h4 className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing Address
                    </h4>
                    <address className="text-sm text-muted-foreground mt-1 not-italic">
                      {order.billingAddress.fullName}<br />
                      {order.billingAddress.street}<br />
                      {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}<br />
                      {order.billingAddress.country}
                    </address>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Order Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={orderStatus}
                    onValueChange={setOrderStatus}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(orderStatus === 'shipped' || orderStatus === 'delivered') && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Tracking Number</label>
                      <input
                        type="text"
                        className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Carrier</label>
                      <Select
                        value={carrier}
                        onValueChange={setCarrier}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BlueDart">BlueDart</SelectItem>
                          <SelectItem value="DTDC">DTDC</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="Delhivery">Delhivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    className="mt-1"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add notes about this order"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right columns - Order Details & Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} • Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          {item.name}
                          {(item.size || item.color) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && `Color: ${item.color}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(order.tax || 0)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shipping || 0)}</span>
                </div>
                <div className="flex justify-between py-2 font-medium border-t mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <div className="font-medium capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <div>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {getEventIcon(event.status)}
                        </div>
                        {index < order.timeline!.length - 1 && (
                          <div className="h-full w-px bg-muted"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-medium capitalize">
                          {event.status.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatTimestamp(event.timestamp)}
                        </div>
                        <p className="text-sm mt-2">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 