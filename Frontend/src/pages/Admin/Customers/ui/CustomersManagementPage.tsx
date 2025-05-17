import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, Eye, MoreHorizontal, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { Badge } from '@app/components/ui/badge';
import { Customer } from '@shared/types/customer';

// Mock customers data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'USR-101',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+91 98765 43210',
    status: 'active',
    registeredDate: '2023-10-15T10:30:00',
    totalOrders: 5,
    totalSpent: 459900,
    lastOrderDate: '2023-11-25T09:24:00',
  },
  {
    id: 'USR-102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 97654 32109',
    status: 'active',
    registeredDate: '2023-09-20T14:15:00',
    totalOrders: 3,
    totalSpent: 529900,
    lastOrderDate: '2023-11-24T14:35:00',
  },
  {
    id: 'USR-103',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 87654 32109',
    status: 'active',
    registeredDate: '2023-08-12T09:45:00',
    totalOrders: 8,
    totalSpent: 1249900,
    lastOrderDate: '2023-11-23T11:12:00',
  },
  {
    id: 'USR-104',
    name: 'Anjali Desai',
    email: 'anjali.desai@example.com',
    phone: '+91 76543 21098',
    status: 'inactive',
    registeredDate: '2023-06-05T16:20:00',
    totalOrders: 2,
    totalSpent: 349900,
    lastOrderDate: '2023-11-20T16:45:00',
  },
  {
    id: 'USR-105',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '+91 65432 10987',
    status: 'active',
    registeredDate: '2023-05-18T11:10:00',
    totalOrders: 1,
    totalSpent: 899900,
    lastOrderDate: '2023-11-19T10:30:00',
  },
];

// Format date helper
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CustomersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof Customer | 'email' | 'status' | 'lastOrderDate'>('registeredDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter customers based on search query and filters
  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => {
    // Search query matching
    const matchesSearch = 
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filtering
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortColumn) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      
      case 'email':
        valueA = a.email;
        valueB = b.email;
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      
      case 'status':
        valueA = a.status;
        valueB = b.status;
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      
      case 'registeredDate':
        valueA = new Date(a.registeredDate).getTime();
        valueB = new Date(b.registeredDate).getTime();
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      
      case 'totalOrders':
        valueA = a.totalOrders;
        valueB = b.totalOrders;
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      
      case 'totalSpent':
        valueA = a.totalSpent;
        valueB = b.totalSpent;
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      
      case 'lastOrderDate':
        valueA = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
        valueB = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      
      default:
        return 0;
    }
  });
  
  // Handle column sort
  const handleSort = (column: keyof Customer | 'email' | 'status' | 'lastOrderDate') => {
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
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage and view customer accounts
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter and search customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Customer
                  {sortColumn === 'name' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Contact
                  {sortColumn === 'email' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer w-[100px]"
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
                className="cursor-pointer hidden lg:table-cell"
                onClick={() => handleSort('registeredDate')}
              >
                <div className="flex items-center">
                  Registered
                  {sortColumn === 'registeredDate' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('totalOrders')}
              >
                <div className="flex items-center">
                  Orders
                  {sortColumn === 'totalOrders' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('totalSpent')}
              >
                <div className="flex items-center">
                  Total Spent
                  {sortColumn === 'totalSpent' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{customer.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === 'active' ? 'default' : 'outline'}>
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(customer.registeredDate)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                      {customer.totalOrders}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/admin/customers/${customer.id}/orders`)}>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          View Orders
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Stats (Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{MOCK_CUSTOMERS.length}</div>
            <p className="text-muted-foreground text-sm">All registered customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {MOCK_CUSTOMERS.filter(c => c.status === 'active').length}
            </div>
            <p className="text-muted-foreground text-sm">Customers who are currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Average Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalOrders, 0) / MOCK_CUSTOMERS.length).toFixed(1)}
            </div>
            <p className="text-muted-foreground text-sm">Average orders per customer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomersManagementPage; 