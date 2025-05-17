import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search 
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { formatCurrency } from '@shared/utils/format';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@app/components/ui/select';

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD123456',
    date: '2023-11-15',
    status: 'delivered',
    total: 8497,
    items: [
      {
        id: '1',
        name: 'Slim Fit Cotton Shirt',
        price: 2499,
        quantity: 1,
        image: 'https://placehold.co/300x400',
      },
      {
        id: '3',
        name: 'Classic Leather Jacket',
        price: 5998,
        quantity: 1,
        image: 'https://placehold.co/300x400',
      },
    ],
    trackingInfo: {
      carrier: 'FastShip',
      trackingNumber: 'FS98765432'
    },
    deliveryAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    }
  },
  {
    id: 'ORD789012',
    date: '2023-10-28',
    status: 'processing',
    total: 3499,
    items: [
      {
        id: '2',
        name: 'Premium Wool Blend Trousers',
        price: 3499,
        quantity: 1,
        image: 'https://placehold.co/300x400',
      }
    ],
    trackingInfo: null,
    deliveryAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    }
  },
  {
    id: 'ORD345678',
    date: '2023-09-05',
    status: 'cancelled',
    total: 7999,
    items: [
      {
        id: '3',
        name: 'Classic Leather Jacket',
        price: 7999,
        quantity: 1,
        image: 'https://placehold.co/300x400',
      }
    ],
    trackingInfo: null,
    deliveryAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    }
  }
];

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'processing':
      return <Truck className="h-5 w-5 text-blue-500" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

// Helper function to format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Orders list */}
      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet
          </p>
          <Button onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg overflow-hidden"
            >
              {/* Order header */}
              <div className="bg-muted p-4 flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{order.id}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize text-sm">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => navigate(`/account/orders/${order.id}`)}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Order items */}
              <div className="p-4">
                <h3 className="font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden border">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order actions */}
              {order.status === 'delivered' && (
                <div className="px-4 pb-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    Buy Again
                  </Button>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 