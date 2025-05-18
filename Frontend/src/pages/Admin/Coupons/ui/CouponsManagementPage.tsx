import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  CalendarIcon,
  Copy,
  TicketIcon
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@app/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@app/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@app/components/ui/pagination';
import { Badge } from '@app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { useToast } from '@app/hooks/use-toast';
import { Coupon, DiscountStatus, CouponType } from '@shared/types/discount';
import { MOCK_COUPONS } from '@shared/constants/coupons';

const CouponsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Filter and sort coupons
  const filteredCoupons = coupons.filter(coupon => {
    // Search filter
    const matchesSearch = coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort coupons
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    let aValue: unknown = a[sortField as keyof Coupon];
    let bValue: unknown = b[sortField as keyof Coupon];
    
    // Handle specific sorting cases
    if (sortField === 'startDate' || sortField === 'endDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = aValue ? new Date(aValue as string).getTime() : 0;
      bValue = bValue ? new Date(bValue as string).getTime() : 0;
    }
    
    if (aValue === bValue) return 0;
    
    if (sortDirection === 'asc') {
      return (aValue || 0) < (bValue || 0) ? -1 : 1;
    } else {
      return (aValue || 0) > (bValue || 0) ? -1 : 1;
    }
  });
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Delete coupon
  const handleDelete = (id: string) => {
    setCouponToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (couponToDelete) {
      setCoupons(coupons.filter(c => c.id !== couponToDelete));
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been deleted successfully."
      });
    }
  };
  
  // Copy coupon code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Coupon code ${code} has been copied to clipboard.`
      });
    });
  };
  
  // Format value based on coupon type
  const formatCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        return `${coupon.value}%`;
      case CouponType.FIXED_AMOUNT:
        return `₹${coupon.value.toFixed(2)}`;
      case CouponType.FREE_SHIPPING:
        return 'Free shipping';
      default:
        return '-';
    }
  };
  
  // Status badge renderer
  const renderStatusBadge = (status: DiscountStatus) => {
    switch (status) {
      case DiscountStatus.ACTIVE:
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case DiscountStatus.SCHEDULED:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case DiscountStatus.EXPIRED:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Expired</Badge>;
      case DiscountStatus.INACTIVE:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = sortedCoupons.slice(startIndex, startIndex + itemsPerPage);
  
  const renderPagination = () => {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={(currentPage === totalPages || totalPages === 0) ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">
            Manage your coupon codes for promotional discounts
          </p>
        </div>
        <Button onClick={() => navigate('/admin/coupons/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter(c => c.status === DiscountStatus.ACTIVE).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter(c => c.status === DiscountStatus.EXPIRED).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons by name or code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={DiscountStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={DiscountStatus.SCHEDULED}>Scheduled</SelectItem>
            <SelectItem value={DiscountStatus.EXPIRED}>Expired</SelectItem>
            <SelectItem value={DiscountStatus.INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer w-[250px]" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortField === 'name' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                <div className="flex items-center space-x-1">
                  <span>Code</span>
                  {sortField === 'code' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                <div className="flex items-center space-x-1">
                  <span>Value</span>
                  {sortField === 'type' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('endDate')}>
                <div className="flex items-center space-x-1">
                  <span>Expires</span>
                  {sortField === 'endDate' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort('usageCount')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Used</span>
                  {sortField === 'usageCount' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCoupons.length > 0 ? (
              paginatedCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{coupon.name}</div>
                      {coupon.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[230px]">
                          {coupon.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {coupon.code}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(coupon.code)}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <TicketIcon className="h-4 w-4 mr-2" />
                      <span>{formatCouponValue(coupon)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.endDate ? (
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{new Date(coupon.endDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No expiry</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(coupon.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span>{coupon.usageCount}</span>
                      {coupon.customerUsageLimit && (
                        <span className="text-muted-foreground text-xs ml-1">
                          / {coupon.isOneTimeUse ? 'Once' : coupon.customerUsageLimit}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/admin/coupons/${coupon.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && renderPagination()}
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponsManagementPage; 