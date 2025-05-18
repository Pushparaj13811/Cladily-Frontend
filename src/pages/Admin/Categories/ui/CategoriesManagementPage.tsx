import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { useToast } from '@app/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';

// Mock categories data
const MOCK_CATEGORIES = [
  {
    id: 'cat1',
    name: 'T-shirts',
    slug: 't-shirts',
    description: 'Casual and comfortable t-shirts for everyday wear',
    productsCount: 24,
    createdAt: '2023-05-10',
    updatedAt: '2023-09-20',
  },
  {
    id: 'cat2',
    name: 'Jeans',
    slug: 'jeans',
    description: 'Durable and stylish jeans for all occasions',
    productsCount: 18,
    createdAt: '2023-05-12',
    updatedAt: '2023-10-15',
  },
  {
    id: 'cat3',
    name: 'Sweatshirts',
    slug: 'sweatshirts',
    description: 'Warm and cozy sweatshirts for colder days',
    productsCount: 15,
    createdAt: '2023-06-05',
    updatedAt: '2023-09-30',
  },
  {
    id: 'cat4',
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Jackets and coats for outdoor protection',
    productsCount: 12,
    createdAt: '2023-07-18',
    updatedAt: '2023-10-10',
  },
  {
    id: 'cat5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Hats, belts, and other fashion accessories',
    productsCount: 30,
    createdAt: '2023-05-20',
    updatedAt: '2023-10-05',
  },
  {
    id: 'cat6',
    name: 'Shorts',
    slug: 'shorts',
    description: 'Comfortable shorts for warm weather',
    productsCount: 10,
    createdAt: '2023-06-15',
    updatedAt: '2023-09-12',
  },
];

type Category = typeof MOCK_CATEGORIES[0];

const CategoriesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [sortColumn, setSortColumn] = useState<keyof Category>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
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
    
    return 0;
  });
  
  // Handle column sort
  const handleSort = (column: keyof Category) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };
  
  // Handle category deletion
  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;
    
    // In a real app, this would be an API call
    setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
    
    toast({
      title: 'Category deleted',
      description: `${categoryToDelete.name} has been deleted successfully.`,
    });
    
    setCategoryToDelete(null);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button onClick={() => navigate('/admin/categories/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortColumn === 'name' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('productsCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Products</span>
                  {sortColumn === 'productsCount' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Updated</span>
                  {sortColumn === 'updatedAt' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.description.length > 60
                      ? `${category.description.substring(0, 60)}...`
                      : category.description}
                  </TableCell>
                  <TableCell>{category.productsCount}</TableCell>
                  <TableCell>
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/categories/${category.id}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This will not delete the products in this category, but they will no longer be associated with this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagementPage; 