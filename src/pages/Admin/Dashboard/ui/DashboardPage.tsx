import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  LineChart, 
  Package, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck, 
  List 
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { formatCurrency } from '@shared/utils/format';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';

// Mock data
const RECENT_ORDERS = [
  {
    id: 'ORD-1001',
    customer: 'John Smith',
    status: 'delivered',
    date: '2023-11-25',
    total: 299900,
  },
  {
    id: 'ORD-1002',
    customer: 'Priya Patel',
    status: 'processing',
    date: '2023-11-24',
    total: 499900,
  },
  {
    id: 'ORD-1003',
    customer: 'Rahul Sharma',
    status: 'shipped',
    date: '2023-11-23',
    total: 799900,
  },
  {
    id: 'ORD-1004',
    customer: 'Anjali Desai',
    status: 'delivered',
    date: '2023-11-20',
    total: 349900,
  },
  {
    id: 'ORD-1005',
    customer: 'Vikram Mehta',
    status: 'cancelled',
    date: '2023-11-19',
    total: 899900,
  },
];

const POPULAR_PRODUCTS = [
  {
    id: 'P1001',
    name: 'Classic White T-shirt',
    category: 'T-shirts',
    sales: 124,
    stock: 45,
    price: 199900,
  },
  {
    id: 'P1005',
    name: 'Winter Jacket',
    category: 'Outerwear',
    sales: 89,
    stock: 12,
    price: 599900,
  },
  {
    id: 'P1003',
    name: 'Premium Hoodie',
    category: 'Sweatshirts',
    sales: 78,
    stock: 34,
    price: 299900,
  },
  {
    id: 'P1002',
    name: 'Blue Jeans',
    category: 'Jeans',
    sales: 67,
    stock: 23,
    price: 100000,
  },
  {
    id: 'P1007',
    name: 'Graphic T-shirt',
    category: 'T-shirts',
    sales: 56,
    stock: 78,
    price: 199900,
  },
];

const SUMMARY_METRICS = {
  totalSales: 25998700,
  totalOrders: 364,
  averageOrderValue: 71424,
  totalCustomers: 247,
  pendingOrders: 15,
  processingOrders: 28,
  shippedOrders: 42,
  deliveredOrders: 276,
  cancelledOrders: 3,
  ordersByStatus: {
    pending: 15,
    processing: 28,
    shipped: 42,
    delivered: 276,
    cancelled: 3,
  },
  ordersByDate: {
    // Simulating last 7 days data
    '2023-11-19': 46,
    '2023-11-20': 52,
    '2023-11-21': 58,
    '2023-11-22': 49,
    '2023-11-23': 62,
    '2023-11-24': 51,
    '2023-11-25': 46,
  },
  salesByDate: {
    // Simulating last 7 days data
    '2023-11-19': 3245000,
    '2023-11-20': 3578900,
    '2023-11-21': 4125000,
    '2023-11-22': 3289700,
    '2023-11-23': 4398200,
    '2023-11-24': 3712000,
    '2023-11-25': 3649900,
  },
};

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string, label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
    shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  };

  const { color, label } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    processing: <List className="h-4 w-4 text-blue-500" />,
    shipped: <Truck className="h-4 w-4 text-indigo-500" />,
    delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
  };

  return statusIcons[status as keyof typeof statusIcons] || null;
};

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(SUMMARY_METRICS.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SUMMARY_METRICS.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SUMMARY_METRICS.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              +7.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(SUMMARY_METRICS.averageOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
        {/* Sales Chart - Takes up more space */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Overview</CardTitle>
              <Tabs 
                value={timeRange} 
                onValueChange={(v) => setTimeRange(v as 'daily' | 'weekly' | 'monthly')}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="daily" className="text-xs px-2">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs px-2">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-2">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              Your revenue and orders over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* This would be a real chart in a production app */}
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Sales chart would be displayed here. 
                  <br />
                  Integrate a charting library for real implementation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Status Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Current order distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* This would be a real chart in a production app */}
            <div className="h-80">
              <div className="text-center mb-4">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-6">
                  Status chart would be here
                </p>
              </div>
              
              {/* Status counts */}
              <div className="space-y-4">
                {Object.entries(SUMMARY_METRICS.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    {getStatusIcon(status)}
                    <div className="ml-2 flex-1">
                      <div className="text-sm font-medium capitalize">
                        {status}
                      </div>
                      <div className="h-2 w-full bg-muted mt-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'processing' ? 'bg-blue-500' :
                            status === 'shipped' ? 'bg-indigo-500' :
                            status === 'delivered' ? 'bg-green-500' :
                            'bg-red-500'
                          } rounded-full`}
                          style={{ 
                            width: `${(count / SUMMARY_METRICS.totalOrders) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-2 text-sm font-medium">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/orders')}
              >
                View All
              </Button>
            </div>
            <CardDescription>
              Latest customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ORDERS.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium">
                        {order.id}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button 
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/admin/orders')}
            >
              View All Orders
            </Button>
          </CardFooter>
        </Card>
        
        {/* Popular Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Popular Products</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/products')}
              >
                View All
              </Button>
            </div>
            <CardDescription>
              Best selling products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {POPULAR_PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="bg-muted rounded w-10 h-10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">
                        {product.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.sales} sold
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                      product.stock > 50 ? 'bg-green-100 text-green-800' :
                      product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} in stock
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button 
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/admin/products')}
            >
              View All Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 