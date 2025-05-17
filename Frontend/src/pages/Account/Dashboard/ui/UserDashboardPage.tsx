import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  MapPin, 
  LogOut, 
  Package,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@app/components/ui/table';
import { formatCurrency } from '@shared/utils/format';
import { useAuth } from '@app/providers/auth-provider';

// Mock recent orders data
const RECENT_ORDERS = [
  {
    id: 'ORD123456',
    date: '2023-11-15',
    status: 'delivered',
    total: 8497,
    items: 2
  },
  {
    id: 'ORD789012',
    date: '2023-10-28',
    status: 'processing',
    total: 3499,
    items: 1
  }
];

// Helper function to format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Helper function to get status badge style
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        <Button 
          variant="outline"
          className="mt-4 sm:mt-0"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wishlisted Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Heart className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2</div>
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1</div>
              <CreditCard className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/account/orders')}
          >
            View All Orders
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {RECENT_ORDERS.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ORDERS.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/account/orders/${order.id}`)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet
            </p>
            <Button onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/account/profile')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium">My Profile</h3>
                  <p className="text-sm text-muted-foreground">Update your personal information</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/account/orders')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium">Order History</h3>
                  <p className="text-sm text-muted-foreground">View all your past orders</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/account/wishlist')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium">My Wishlist</h3>
                  <p className="text-sm text-muted-foreground">View and manage your saved items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/account/addresses')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium">Saved Addresses</h3>
                  <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage; 