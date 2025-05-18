import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  CalendarIcon,
  PercentIcon
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
import { Discount, DiscountStatus, DiscountType } from '@shared/types/discount';
import { MOCK_DISCOUNTS } from '@shared/constants/discount';

const DiscountsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Filter and sort discounts
  const filteredDiscounts = discounts.filter(discount => {
    // Search filter
    const matchesSearch = discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (discount.description && discount.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort discounts
  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
    let aValue: unknown = a[sortField as keyof Discount];
    let bValue: unknown = b[sortField as keyof Discount];
    
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
  
  // Delete discount
  const handleDelete = (id: string) => {
    setDiscountToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (discountToDelete) {
      setDiscounts(discounts.filter(d => d.id !== discountToDelete));
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
      
      toast({
        title: "Discount deleted",
        description: "The discount has been deleted successfully."
      });
    }
  };
  
  // Helper functions to format values
  const formatDiscountValue = (discount: Discount): string => {
    switch (discount.type) {
      case DiscountType.PERCENTAGE:
        return `${discount.value}%`;
      case DiscountType.FIXED_AMOUNT:
        return `₹${discount.value}`;
      case DiscountType.BUY_X_GET_Y:
        return `Buy ${discount.buyQuantity} Get ${discount.getQuantity} Free`;
      case DiscountType.FREE_SHIPPING:
        return 'Free Shipping';
      default:
        return `${discount.value}`;
    }
  };
  
  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedDiscounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDiscounts = sortedDiscounts.slice(startIndex, startIndex + itemsPerPage);
  
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">
            Manage your discounts and promotional offers
          </p>
        </div>
        <Button onClick={() => navigate('/admin/discounts/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.filter(d => d.status === DiscountStatus.ACTIVE).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.filter(d => d.status === DiscountStatus.SCHEDULED).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.reduce((sum, discount) => sum + discount.usageCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discounts..."
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                <div className="flex items-center space-x-1">
                  <span>Type/Value</span>
                  {sortField === 'type' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('startDate')}>
                <div className="flex items-center space-x-1">
                  <span>Period</span>
                  {sortField === 'startDate' && <ArrowUpDown className="h-4 w-4" />}
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
                  <span>Redemptions</span>
                  {sortField === 'usageCount' && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDiscounts.length > 0 ? (
              paginatedDiscounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{discount.name}</div>
                      {discount.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[230px]">
                          {discount.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {discount.type === DiscountType.PERCENTAGE && <PercentIcon className="h-4 w-4" />}
                      </span>
                      <span>{formatDiscountValue(discount)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <div>
                        <div className="text-xs">
                          {new Date(discount.startDate).toLocaleDateString()}
                        </div>
                        {discount.endDate && (
                          <div className="text-xs text-muted-foreground">
                            to {new Date(discount.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(discount.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {discount.usageCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/admin/discounts/${discount.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDelete(discount.id)}
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No discounts found.
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
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this discount? This action cannot be undone.
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

export default DiscountsManagementPage; 