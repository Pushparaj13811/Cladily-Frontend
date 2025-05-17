import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';

// Mock orders data
const MOCK_ORDERS = [
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
      { id: 'P1001', name: 'Classic White T-shirt', price: 199900, quantity: 1 },
      { id: 'P1002', name: 'Blue Jeans', price: 100000, quantity: 1 },
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
      { id: 'P1003', name: 'Premium Hoodie', price: 299900, quantity: 1 },
      { id: 'P1004', name: 'Slim Fit Chinos', price: 200000, quantity: 1 },
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
      { id: 'P1005', name: 'Winter Jacket', price: 599900, quantity: 1 },
      { id: 'P1006', name: 'Wool Socks', price: 100000, quantity: 2 },
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
      { id: 'P1007', name: 'Graphic T-shirt', price: 199900, quantity: 1 },
      { id: 'P1008', name: 'Baseball Cap', price: 150000, quantity: 1 },
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
      { id: 'P1009', name: 'Designer Dress', price: 899900, quantity: 1 },
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

type Order = typeof MOCK_ORDERS[0];

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
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and process customer orders
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter and search orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-row gap-4">
              <div className="w-40">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
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
              </div>
              
              <div className="w-40">
                <Select
                  value={paymentFilter}
                  onValueChange={setPaymentFilter}
                >
                  <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer w-[150px]"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Order ID
                  {sortColumn === 'id' && (
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
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortColumn === 'status' && (
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
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Date
                  {sortColumn === 'createdAt' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.user.name}</div>
                      <div className="text-sm text-muted-foreground">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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