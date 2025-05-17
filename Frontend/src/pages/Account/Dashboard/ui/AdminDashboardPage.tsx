// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Users,
//   Package,
//   DollarSign,
//   ShoppingCart,
//   TrendingUp,
//   ListOrdered,
//   Layers,
//   Settings,
//   Bell,
//   Tag,
//   Grid,
//   LogOut,
//   ChevronRight,
//   ArrowUpRight
// } from 'lucide-react';
// import { Button } from '@app/components/ui/button';
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from '@app/components/ui/card';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger
// } from '@app/components/ui/tabs';
// import { 
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   AreaChart,
//   Area
// } from 'recharts';
// import { formatCurrency } from '@shared/utils/format';
// import { useAuth } from '@app/providers/auth-provider';

// // Mock data for sales
// const salesData = [
//   { name: 'Jan', amount: 12400 },
//   { name: 'Feb', amount: 9800 },
//   { name: 'Mar', amount: 17500 },
//   { name: 'Apr', amount: 15200 },
//   { name: 'May', amount: 18900 },
//   { name: 'Jun', amount: 22800 },
//   { name: 'Jul', amount: 20100 },
// ];

// // Mock data for product categories
// const categoryData = [
//   { name: 'T-shirts', value: 35 },
//   { name: 'Sweatshirts', value: 20 },
//   { name: 'Jeans', value: 15 },
//   { name: 'Jackets', value: 12 },
//   { name: 'Accessories', value: 10 },
//   { name: 'Other', value: 8 },
// ];

// // Mock data for recent orders
// const recentOrders = [
//   { id: 'ORD39458', customer: 'Rahul Sharma', date: '2023-11-22', status: 'completed', total: 7899 },
//   { id: 'ORD38291', customer: 'Priya Singh', date: '2023-11-21', status: 'processing', total: 3499 },
//   { id: 'ORD37182', customer: 'Aditya Patel', date: '2023-11-21', status: 'shipped', total: 4999 },
//   { id: 'ORD36294', customer: 'Neha Kapoor', date: '2023-11-20', status: 'pending', total: 1899 },
// ];

// // Helper function to format date
// const formatDate = (dateStr: string) => {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });
// };

// // Helper function to get status badge style
// const getStatusBadge = (status: string) => {
//   switch (status) {
//     case 'completed':
//       return 'bg-green-100 text-green-800 border-green-200';
//     case 'processing':
//       return 'bg-blue-100 text-blue-800 border-blue-200';
//     case 'shipped':
//       return 'bg-purple-100 text-purple-800 border-purple-200';
//     case 'pending':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     case 'cancelled':
//       return 'bg-red-100 text-red-800 border-red-200';
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// // Mock data for inventory alerts
// const inventoryAlerts = [
//   { id: 'P1293', name: 'Classic White T-shirt', stock: 3, category: 'T-shirts' },
//   { id: 'P2184', name: 'Blue Denim Jeans', stock: 5, category: 'Jeans' },
//   { id: 'P3671', name: 'Black Hoodie', stock: 2, category: 'Sweatshirts' },
// ];

// const AdminDashboardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
  
//   // Handle logout
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <p className="text-muted-foreground mt-1">
//             Welcome, {user?.name || 'Admin'}
//           </p>
//           <span className="sr-only">Current tab: {activeTab}</span>
//         </div>
//         <Button 
//           variant="outline"
//           className="mt-4 sm:mt-0"
//           onClick={handleLogout}
//         >
//           <LogOut className="mr-2 h-4 w-4" />
//           Logout
//         </Button>
//       </div>
      
//       <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
//         <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-2">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="sales">Sales</TabsTrigger>
//           <TabsTrigger value="orders">Orders</TabsTrigger>
//           <TabsTrigger value="inventory">Inventory</TabsTrigger>
//         </TabsList>
        
//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Revenue
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">{formatCurrency(149999)}</div>
//                   <DollarSign className="h-8 w-8 text-muted-foreground/50" />
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2 flex items-center text-green-600">
//                   <TrendingUp className="h-3 w-3 mr-1" /> 
//                   12% increase from last month
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Orders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">68</div>
//                   <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2 flex items-center text-green-600">
//                   <TrendingUp className="h-3 w-3 mr-1" /> 
//                   8% increase from last month
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Products
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">142</div>
//                   <Package className="h-8 w-8 text-muted-foreground/50" />
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   5 products low in stock
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Active Users
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">291</div>
//                   <Users className="h-8 w-8 text-muted-foreground/50" />
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2 flex items-center text-green-600">
//                   <TrendingUp className="h-3 w-3 mr-1" /> 
//                   15% increase from last month
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
          
//           {/* Sales Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Sales Overview</CardTitle>
//               <CardDescription>
//                 Monthly revenue for the current year
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={salesData}
//                     margin={{
//                       top: 5,
//                       right: 30,
//                       left: 20,
//                       bottom: 5,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip 
//                       formatter={(value) => formatCurrency(value as number)}
//                       labelFormatter={(label) => `Month: ${label}`}
//                     />
//                     <Bar dataKey="amount" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* Recent Orders and Alerts */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Recent Orders */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Orders</CardTitle>
//                 <CardDescription>
//                   Latest 4 orders placed in the store
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {recentOrders.map((order) => (
//                     <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
//                       <div>
//                         <p className="font-medium">{order.customer}</p>
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <span className="mr-2">{order.id}</span>
//                           <span>{formatDate(order.date)}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
//                           {order.status}
//                         </span>
//                         <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/orders')}
//                 >
//                   View All Orders
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
            
//             {/* Inventory Alerts */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Inventory Alerts</CardTitle>
//                 <CardDescription>
//                   Products with low stock levels
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {inventoryAlerts.map((item) => (
//                     <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
//                       <div>
//                         <p className="font-medium">{item.name}</p>
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <span className="mr-2">{item.id}</span>
//                           <span>Category: {item.category}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
//                           Stock: {item.stock}
//                         </span>
//                         <Button 
//                           variant="ghost" 
//                           size="sm"
//                           onClick={() => navigate(`/admin/products/${item.id}`)}
//                         >
//                           Update
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/inventory')}
//                 >
//                   Manage Inventory
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
          
//           {/* Quick Access Links */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/products')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Package className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Products</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Manage your products</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <ListOrdered className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Orders</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Manage customer orders</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/customers')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Users className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Customers</h3>
//                 <p className="text-xs text-muted-foreground mt-1">View customer database</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/settings')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Settings className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Settings</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Configure store settings</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
        
//         {/* Sales Tab */}
//         <TabsContent value="sales" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Sales
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{formatCurrency(149999)}</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   For the current year
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Average Order Value
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{formatCurrency(2205)}</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   12% increase from last month
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Conversion Rate
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">3.2%</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   0.5% increase from last month
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Revenue Trends</CardTitle>
//               <CardDescription>
//                 Monthly revenue comparison with previous year
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={[
//                       { name: 'Jan', current: 12400, previous: 9800 },
//                       { name: 'Feb', current: 9800, previous: 8700 },
//                       { name: 'Mar', current: 17500, previous: 14200 },
//                       { name: 'Apr', current: 15200, previous: 13900 },
//                       { name: 'May', current: 18900, previous: 15800 },
//                       { name: 'Jun', current: 22800, previous: 18400 },
//                       { name: 'Jul', current: 20100, previous: 17200 },
//                     ]}
//                     margin={{
//                       top: 5,
//                       right: 30,
//                       left: 20,
//                       bottom: 5,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip 
//                       formatter={(value) => formatCurrency(value as number)}
//                     />
//                     <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current Year" />
//                     <Line type="monotone" dataKey="previous" stroke="#82ca9d" name="Previous Year" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Category Sales Distribution</CardTitle>
//                 <CardDescription>
//                   Sales percentage by product category
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       layout="vertical"
//                       data={categoryData}
//                       margin={{
//                         top: 5,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis type="number" />
//                       <YAxis dataKey="name" type="category" />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#8884d8" name="Percentage" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/reports/categories')}
//                 >
//                   View Detailed Report
//                   <ArrowUpRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Monthly Visitors</CardTitle>
//                 <CardDescription>
//                   Website traffic for the current year
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart
//                       data={[
//                         { name: 'Jan', visitors: 1240 },
//                         { name: 'Feb', visitors: 1580 },
//                         { name: 'Mar', visitors: 1890 },
//                         { name: 'Apr', visitors: 2390 },
//                         { name: 'May', visitors: 2780 },
//                         { name: 'Jun', visitors: 3190 },
//                         { name: 'Jul', visitors: 3580 },
//                       ]}
//                       margin={{
//                         top: 10,
//                         right: 30,
//                         left: 0,
//                         bottom: 0,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/reports/analytics')}
//                 >
//                   View Analytics
//                   <ArrowUpRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>
        
//         {/* Orders Tab */}
//         <TabsContent value="orders" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   New Orders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">12</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Pending processing
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Processing
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">8</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Being prepared
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Shipped
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">15</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   In transit
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Delivered
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">33</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Last 30 days
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
          
//           <Card>
//             <CardHeader className="pb-0">
//               <CardTitle>Recent Orders</CardTitle>
//               <CardDescription>
//                 Manage and process customer orders
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left font-medium p-2 pl-0">Order ID</th>
//                       <th className="text-left font-medium p-2">Customer</th>
//                       <th className="text-left font-medium p-2">Date</th>
//                       <th className="text-left font-medium p-2">Status</th>
//                       <th className="text-right font-medium p-2 pr-0">Amount</th>
//                       <th className="text-right font-medium p-2 pr-0">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {[...recentOrders, ...recentOrders].slice(0, 6).map((order, index) => (
//                       <tr key={`${order.id}-${index}`} className="border-b last:border-0">
//                         <td className="p-2 pl-0">{order.id}</td>
//                         <td className="p-2">{order.customer}</td>
//                         <td className="p-2">{formatDate(order.date)}</td>
//                         <td className="p-2">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="p-2 pr-0 text-right">{formatCurrency(order.total)}</td>
//                         <td className="p-2 pr-0 text-right">
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             onClick={() => navigate(`/admin/orders/${order.id}`)}
//                           >
//                             View
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button 
//                 className="w-full"
//                 onClick={() => navigate('/admin/orders')}
//               >
//                 View All Orders
//               </Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>
        
//         {/* Inventory Tab */}
//         <TabsContent value="inventory" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Products
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">142</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   In 6 categories
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Low Stock
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">5</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Need attention
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Out of Stock
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">2</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Need restocking
//                 </p>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   New Arrivals
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">12</div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Last 30 days
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Low Stock Products</CardTitle>
//                 <CardDescription>
//                   Products that need replenishing soon
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {inventoryAlerts.map((item) => (
//                     <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
//                       <div>
//                         <p className="font-medium">{item.name}</p>
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <span className="mr-2">{item.id}</span>
//                           <span>Category: {item.category}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
//                           Stock: {item.stock}
//                         </span>
//                         <Button 
//                           variant="outline" 
//                           size="sm"
//                           onClick={() => navigate(`/admin/products/edit/${item.id}`)}
//                         >
//                           Restock
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/inventory/low-stock')}
//                 >
//                   View All Low Stock
//                 </Button>
//               </CardFooter>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Category Distribution</CardTitle>
//                 <CardDescription>
//                   Products by category
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {categoryData.map((category) => (
//                     <div key={category.name} className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
//                         <span>{category.name}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <div className="text-sm font-medium">{category.value} products</div>
//                         <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="w-full"
//                   onClick={() => navigate('/admin/categories')}
//                 >
//                   Manage Categories
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/products/new')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Package className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Add Product</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Create new product listing</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/categories')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Layers className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Categories</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Manage product categories</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/inventory/bulk-update')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Grid className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Bulk Update</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Update multiple products</p>
//               </CardContent>
//             </Card>
            
//             <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate('/admin/inventory/reports')}>
//               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
//                 <Bell className="h-10 w-10 mb-3 text-primary" />
//                 <h3 className="font-medium">Alerts</h3>
//                 <p className="text-xs text-muted-foreground mt-1">Configure inventory alerts</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default AdminDashboardPage; 