import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageCheck, Truck, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useToast } from '@app/hooks/use-toast';
import { formatCurrency } from '@shared/utils/format';
import { Badge } from '@app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';

// Mock order data
const MOCK_ORDERS = [
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
    tax: 20000,
    shipping: 0,
    items: [
      { id: 'P1001', name: 'Classic White T-shirt', price: 199900, quantity: 1, size: 'M', color: 'White' },
      { id: 'P1002', name: 'Blue Jeans', price: 100000, quantity: 1, size: '32', color: 'Dark Blue' },
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
    notes: '',
    timeline: [
      { status: 'order_placed', timestamp: '2023-11-25T09:24:00', note: 'Order placed by customer' },
      { status: 'payment_confirmed', timestamp: '2023-11-25T09:30:00', note: 'Payment confirmed' },
    ],
  },
  // More orders...
];

// Status options
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Status badge mapping for visual representation
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; label: string }> = {
    pending: { variant: 'outline', label: 'Pending' },
    processing: { variant: 'secondary', label: 'Processing' },
    shipped: { variant: 'default', label: 'Shipped' },
    delivered: { variant: 'default', label: 'Delivered' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },
  };

  const statusInfo = statusMap[status] || { variant: 'outline', label: 'Unknown' };
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  );
};

// Status icon mapping
const getStatusIcon = (status: string) => {
  const icons = {
    pending: <Clock className="h-5 w-5 text-muted-foreground" />,
    processing: <PackageCheck className="h-5 w-5 text-blue-500" />,
    shipped: <Truck className="h-5 w-5 text-indigo-500" />,
    delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
    cancelled: <XCircle className="h-5 w-5 text-red-500" />,
  } as Record<string, React.ReactNode>;

  return icons[status] || <Clock className="h-5 w-5 text-muted-foreground" />;
};

// Payment method formatting
const formatPaymentMethod = (method: string) => {
  const methodMap: Record<string, string> = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    upi: 'UPI',
    net_banking: 'Net Banking',
    cash_on_delivery: 'Cash on Delivery',
  };

  return methodMap[method] || method;
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [order, setOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const foundOrder = MOCK_ORDERS.find(order => order.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Handle status update
  const handleStatusUpdate = (newStatus: string) => {
    setUpdatingStatus(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...order.timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Order status updated to ${newStatus}`,
          },
        ],
      };
      
      setOrder(updatedOrder);
      setUpdatingStatus(false);
      
      toast({
        title: 'Order status updated',
        description: `Order #${order.id} status has been updated to ${newStatus}`,
      });
    }, 800);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/admin/orders')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            Order {order.id}
            <span className="ml-4">{getStatusBadge(order.status)}</span>
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer and Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
              <CardDescription>
                Change the status of this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-64">
                  <Select
                    value={order.status}
                    onValueChange={handleStatusUpdate}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {updatingStatus ? 'Updating...' : `Last updated: ${formatDate(order.updatedAt)}`}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                {order.timeline.map((event, index) => (
                  <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-card rounded-full -left-3 ring-8 ring-background">
                      {event.status.includes('payment') ? (
                        <Calendar className="w-3 h-3" />
                      ) : (
                        getStatusIcon(event.status.split('_')[0])
                      )}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold">
                      {event.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </h3>
                    <time className="block mb-2 text-sm font-normal text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </time>
                    {event.note && (
                      <p className="text-base font-normal">
                        {event.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.size && `Size: ${item.size}`}
                            {item.color && item.size && ' / '}
                            {item.color && `Color: ${item.color}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end">
              <div className="space-y-1 text-sm w-48">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{order.user.name}</h3>
                  <p className="text-sm">{order.user.email}</p>
                  {order.user.phone && (
                    <p className="text-sm">{order.user.phone}</p>
                  )}
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/customers/${order.user.id}`)}
                  >
                    View Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span>{formatPaymentMethod(order.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="pt-2 text-sm">{order.shippingAddress.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.billingAddress.fullName}</p>
                <p>{order.billingAddress.street}</p>
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 