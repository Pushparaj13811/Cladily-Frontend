import React, { useState } from 'react';
import { 
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Users, 
  Star
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data
const SUMMARY_METRICS = {
  totalSales: 246891,
  totalOrders: 1234,
  totalCustomers: 892,
  averageOrderValue: 198.45,
  ordersByStatus: {
    pending: 18,
    processing: 25,
    shipped: 42,
    delivered: 158,
    cancelled: 9
  }
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 2500 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 4000 },
  { name: 'Jun', value: 3500 },
  { name: 'Jul', value: 6000 },
  { name: 'Aug', value: 4500 },
  { name: 'Sep', value: 5800 },
  { name: 'Oct', value: 7000 },
  { name: 'Nov', value: 6300 },
  { name: 'Dec', value: 8000 },
];

const weeklyStats = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 900 },
  { name: 'Wed', value: 1500 },
  { name: 'Thu', value: 1100 },
  { name: 'Fri', value: 1700 },
  { name: 'Sat', value: 1300 },
  { name: 'Sun', value: 800 },
];

const topProducts = [
  {
    id: 1,
    name: 'Premium T-shirt',
    image: '/products/tshirt.jpg',
    fallback: 'TS',
    rating: 5,
    reviews: 856,
    code: 'PRD-11-001',
  },
  {
    id: 2,
    name: 'Designer Jeans',
    image: '/products/jeans.jpg',
    fallback: 'DJ',
    rating: 5,
    reviews: 720,
    code: 'PRD-08-022',
  },
  {
    id: 3,
    name: 'Leather Jacket',
    image: '/products/jacket.jpg',
    fallback: 'LJ',
    rating: 4,
    reviews: 627,
    code: 'PRD-05-303',
  },
  {
    id: 4,
    name: 'Casual Shoes',
    image: '/products/shoes.jpg',
    fallback: 'CS',
    rating: 5,
    reviews: 543,
    code: 'PRD-10-404',
  },
  {
    id: 5,
    name: 'Fashion Hat',
    image: '/products/hat.jpg',
    fallback: 'FH',
    rating: 4,
    reviews: 487,
    code: 'PRD-06-505',
  },
];

const recentSales = [
  {
    id: 1,
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      initials: 'JS',
    },
    amount: 259.00,
    date: '24 Dec 2023',
    status: 'completed',
  },
  {
    id: 2,
    customer: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      initials: 'AJ',
    },
    amount: 199.00,
    date: '23 Dec 2023',
    status: 'completed',
  },
  {
    id: 3,
    customer: {
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      initials: 'RB',
    },
    amount: 180.00,
    date: '22 Dec 2023',
    status: 'completed',
  },
  {
    id: 4,
    customer: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      initials: 'ED',
    },
    amount: 159.00,
    date: '21 Dec 2023',
    status: 'completed',
  },
];

// Render star ratings
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and sales</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{formatCurrency(SUMMARY_METRICS.totalSales)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+3.6%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{SUMMARY_METRICS.totalOrders}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+1.8%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{SUMMARY_METRICS.totalCustomers}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12.4%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(SUMMARY_METRICS.averageOrderValue)}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-red-600 font-medium">-2.1%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="border shadow-sm mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>
              Monthly sales overview for the current year
            </CardDescription>
          </div>
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
          </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Stats */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Stats</CardTitle>
              <CardDescription>Sales performance per day</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{formatCurrency(SUMMARY_METRICS.totalSales)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{SUMMARY_METRICS.totalOrders}</p>
                      </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(SUMMARY_METRICS.totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest customer transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={sale.customer.avatar} alt={sale.customer.name} />
                      <AvatarFallback>{sale.customer.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{sale.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${sale.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{sale.date}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Selling Products */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>Top performing products this month</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All Products
              </Button>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={product.image} alt={product.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {product.fallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                      </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">Code: {product.code}</p>
                  <div className="flex justify-center mb-1">
                    <StarRating rating={product.rating} />
                  </div>
                  <p className="text-xs text-muted-foreground">{product.reviews} Reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default DashboardPage; 