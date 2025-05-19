import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Home, ShoppingBag, CalendarIcon, CreditCard } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Badge } from '@app/components/ui/badge';
import { formatCurrency } from '@shared/utils/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
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
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { PRODUCTS } from '@shared/constants/products';
import { Order } from '@shared/types/order';
import { PaymentMethod, OrderStatus } from '@shared/types/admin';

// Generate orders based on product data
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    user: {
      id: 'USR-101',
      name: 'John Smith',
      email: 'john.smith@example.com',
    },
    status: 'pending',
    total: 299900,
    items: [
      { 
        id: PRODUCTS.FEATURED[0].id.toString(), 
        name: PRODUCTS.FEATURED[0].name, 
        price: parseInt(PRODUCTS.FEATURED[0].price.replace('₹', '')), 
        quantity: 1 
      },
      { 
        id: PRODUCTS.FEATURED[1].id.toString(), 
        name: PRODUCTS.FEATURED[1].name, 
        price: parseInt(PRODUCTS.FEATURED[1].price.replace('₹', '')), 
        quantity: 1 
      },
    ],
    paymentMethod: 'credit_card',
    createdAt: '2023-11-25T09:24:00',
    shippingAddress: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
  },
  {
    id: 'ORD-1002',
    user: {
      id: 'USR-102',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
    },
    status: 'processing',
    total: 499900,
    items: [
      { 
        id: PRODUCTS.FEATURED[2].id.toString(), 
        name: PRODUCTS.FEATURED[2].name, 
        price: parseInt(PRODUCTS.FEATURED[2].price.replace('₹', '')), 
        quantity: 1 
      },
      { 
        id: PRODUCTS.FEATURED[3].id.toString(), 
        name: PRODUCTS.FEATURED[3].name, 
        price: parseInt(PRODUCTS.FEATURED[3].price.replace('₹', '')), 
        quantity: 1 
      },
    ],
    paymentMethod: 'upi',
    createdAt: '2023-11-24T14:35:00',
    shippingAddress: {
      street: '456 Park Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  },
  {
    id: 'ORD-1003',
    user: {
      id: 'USR-103',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
    },
    status: 'shipped',
    total: 799900,
    items: [
      { 
        id: PRODUCTS.RELATED[0].id.toString(), 
        name: PRODUCTS.RELATED[0].name, 
        price: parseInt(PRODUCTS.RELATED[0].price.replace('₹', '')), 
        quantity: 1 
      },
      { 
        id: PRODUCTS.RELATED[1].id.toString(), 
        name: PRODUCTS.RELATED[1].name, 
        price: parseInt(PRODUCTS.RELATED[1].price.replace('₹', '')), 
        quantity: 2 
      },
    ],
    paymentMethod: 'credit_card',
    createdAt: '2023-11-23T11:12:00',
    shippingAddress: {
      street: '789 Lake Road',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
  },
  {
    id: 'ORD-1004',
    user: {
      id: 'USR-104',
      name: 'Anjali Desai',
      email: 'anjali.desai@example.com',
    },
    status: 'delivered',
    total: 349900,
    items: [
      { 
        id: PRODUCTS.RELATED[2].id.toString(), 
        name: PRODUCTS.RELATED[2].name, 
        price: parseInt(PRODUCTS.RELATED[2].price.replace('₹', '')), 
        quantity: 1 
      },
      { 
        id: PRODUCTS.RELATED[3].id.toString(), 
        name: PRODUCTS.RELATED[3].name, 
        price: parseInt(PRODUCTS.RELATED[3].price.replace('₹', '')), 
        quantity: 1 
      },
    ],
    paymentMethod: 'cash_on_delivery',
    createdAt: '2023-11-20T16:45:00',
    shippingAddress: {
      street: '10 Ocean View',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
    },
  },
  {
    id: 'ORD-1005',
    user: {
      id: 'USR-105',
      name: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
    },
    status: 'cancelled',
    total: 899900,
    items: [
      { 
        id: PRODUCTS.RELATED[4].id.toString(), 
        name: PRODUCTS.RELATED[4].name, 
        price: parseInt(PRODUCTS.RELATED[4].price.replace('₹', '')), 
        quantity: 1 
      },
    ],
    paymentMethod: 'net_banking',
    createdAt: '2023-11-19T10:30:00',
    shippingAddress: {
      street: '222 Hill Street',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700001',
      country: 'India',
    },
  },
];

// Status badge mapping for visual representation
const getStatusBadge = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string, className: string }> = {
    pending: { 
      label: 'Pending', 
      className: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-full' 
    },
    processing: { 
      label: 'Processing', 
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-full' 
    },
    shipped: { 
      label: 'Shipped', 
      className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-full' 
    },
    delivered: { 
      label: 'Fulfilled', 
      className: 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 rounded-full' 
    },
    cancelled: { 
      label: 'Unfulfilled', 
      className: 'bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 rounded-full' 
    },
  };

  const statusInfo = statusMap[status] || { 
    label: 'Unknown', 
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full' 
  };
  
  return (
    <Badge 
      variant="outline"
      className={statusInfo.className}
    >
      {status === 'pending' || status === 'cancelled' ? '• ' : ''}{statusInfo.label}
    </Badge>
  );
};

// Payment method formatting
const formatPaymentMethod = (method: PaymentMethod): string => {
  const methodMap: Record<PaymentMethod, string> = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    upi: 'UPI',
    net_banking: 'Net Banking',
    cash_on_delivery: 'Cash on Delivery',
  };

  return methodMap[method] || method;
};

const OrdersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof Order>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  // Filter orders based on search query and filters
  const filteredOrders = MOCK_ORDERS.filter(order => {
    // Search query matching
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filtering
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Payment method filtering
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Handle date comparison for createdAt
    if (sortColumn === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });
  
  // Paginate orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  
  // Handle column sort
  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc'); // Default to descending for new column
    }
  };
  
  // Get summary statistics
  const pendingOrders = MOCK_ORDERS.filter(order => order.status === 'pending').length;
  const processingOrders = MOCK_ORDERS.filter(order => order.status === 'processing').length;
  const shippedOrders = MOCK_ORDERS.filter(order => order.status === 'shipped').length;
  
  return (
    <div className="p-6 w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate('/admin/dashboard')}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <span className="mx-2">/</span>
          <span className="text-foreground">Orders</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Orders
            </h1>
            <p className="text-muted-foreground">
              Manage and process customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 flex items-center text-lg">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800">{pendingOrders}</div>
            <p className="text-amber-600 text-sm">Awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center text-lg">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{processingOrders}</div>
            <p className="text-blue-600 text-sm">Currently being processed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-700 flex items-center text-lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-800">{shippedOrders}</div>
            <p className="text-indigo-600 text-sm">On the way to customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={paymentFilter}
            onValueChange={setPaymentFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="debit_card">Debit Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="net_banking">Net Banking</SelectItem>
              <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[30px] pl-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer w-[120px]"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Order
                    {sortColumn === 'id' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Date
                    {sortColumn === 'createdAt' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortColumn === 'user' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('paymentMethod')}
                >
                  <div className="flex items-center">
                    Payment
                    {sortColumn === 'paymentMethod' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center">
                    Total
                    {sortColumn === 'total' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Items</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Fulfillment
                    {sortColumn === 'status' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <TableRow key={order.id} className="border-t border-gray-200">
                    <TableCell className="pl-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{order.user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length} orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "bg-primary text-white" : ""}
              >
                {index + 1}
              </Button>
            )).slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementPage; 