import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Search, ArrowUpDown, Loader2, ChevronRight, ChevronDown, Check, X, LayoutGrid, List } from 'lucide-react';
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
import { Badge } from '@app/components/ui/badge';
import { getCategoryHierarchy, deleteCategory } from '@features/dashboard';
import { Category } from '@shared/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@app/components/ui/toggle-group';

// Interface for category with children
interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  depth?: number;
  isExpanded?: boolean;
}

const CategoriesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [flattenedCategories, setFlattenedCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Category>('position');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'hierarchical' | 'separated'>('hierarchical');
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');

  // Derived states
  const parentCategories = categories.filter(cat => !cat.parentId);
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategoryHierarchy();
        
        // Initialize expansion state for all categories
        const categoriesWithState = initializeCategories(data);
        setCategories(categoriesWithState);
        
        // Generate flattened list for display
        const flattened = flattenCategories(categoriesWithState);
        setFlattenedCategories(flattened);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to fetch categories');
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  // Initialize categories with expansion state
  const initializeCategories = (cats: CategoryWithChildren[]): CategoryWithChildren[] => {
    return cats.map(category => ({
      ...category,
      isExpanded: false,
      depth: 0,
      children: category.children ? initializeCategories(category.children.map(child => ({
        ...child,
        depth: 1
      }))) : undefined
    }));
  };

  // Flatten hierarchical categories for display based on expansion state
  const flattenCategories = (cats: CategoryWithChildren[], depth = 0): CategoryWithChildren[] => {
    let result: CategoryWithChildren[] = [];
    
    for (const category of cats) {
      // Add the category itself
      const categoryWithDepth = { ...category, depth };
      result.push(categoryWithDepth);
      
      // Add its children if expanded
      if (category.isExpanded && category.children && category.children.length > 0) {
        result = [...result, ...flattenCategories(category.children, depth + 1)];
      }
    }
    
    return result;
  };

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    const updateExpansion = (cats: CategoryWithChildren[]): CategoryWithChildren[] => {
      return cats.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, isExpanded: !cat.isExpanded };
        }
        if (cat.children) {
          return { ...cat, children: updateExpansion(cat.children) };
        }
        return cat;
      });
    };
    
    const updatedCategories = updateExpansion(categories);
    setCategories(updatedCategories);
    setFlattenedCategories(flattenCategories(updatedCategories));
  };

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? flattenedCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : flattenedCategories;

  const filteredParentCategories = searchQuery
    ? parentCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : parentCategories;

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    // If search is active, ignore hierarchy and sort by the column
    if (searchQuery) {
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
    }
    
    // If no search, maintain hierarchical order
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

  // Get subcategories for a parent
  const getSubcategoriesForParent = (parentId: string): CategoryWithChildren[] => {
    return flattenedCategories.filter(cat => cat.parentId === parentId);
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);

    try {
      await deleteCategory(categoryToDelete.id);

      // Refetch the categories to update the hierarchy
      const data = await getCategoryHierarchy();
      const categoriesWithState = initializeCategories(data);
      setCategories(categoriesWithState);
      setFlattenedCategories(flattenCategories(categoriesWithState));

      toast({
        title: 'Category deleted',
        description: `${categoryToDelete.name} has been deleted successfully.`,
      });

      setCategoryToDelete(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Render category card for grid view
  const renderCategoryCard = (category: CategoryWithChildren) => {
    return (
      <Card key={category.id} className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {category.name}
              {category.childrenCount && category.childrenCount > 0 && (
                <Badge variant="outline" className="ml-2">
                  {category.childrenCount} subcategories
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(`/admin/categories/${category.id}`)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCategoryToDelete(category)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            {category.isActive ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <X className="h-3 w-3 mr-1" /> Inactive
              </Badge>
            )}
            {!category.isVisible && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Hidden
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {category.description || 'No description'}
          </p>
          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <span>{category.productsCount || 0} products</span>
            {category.children && category.children.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => toggleExpand(category.id)}
              >
                {category.isExpanded ? 'Hide subcategories' : 'Show subcategories'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render hierarchical grid view
  const renderHierarchicalGrid = () => {
    return (
      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <React.Fragment key={category.id}>
            <div className={`${category.depth ? `ml-${category.depth * 6}` : ''}`}>
              {renderCategoryCard(category)}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render separated grid view
  const renderSeparatedGrid = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Parent Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParentCategories.map(category => (
              <div key={category.id}>
                {renderCategoryCard(category)}
              </div>
            ))}
          </div>
        </div>
        
        {filteredParentCategories.map(parent => {
          const subcategories = getSubcategoriesForParent(parent.id);
          if (subcategories.length === 0) return null;
          
          return (
            <div key={`sub-${parent.id}`}>
              <h2 className="text-xl font-semibold mb-4">
                {parent.name} Subcategories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcategories.map(subcategory => (
                  <div key={subcategory.id}>
                    {renderCategoryCard(subcategory)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render category table row
  const renderCategoryTableRow = (category: CategoryWithChildren) => {
    return (
      <TableRow key={category.id}>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <div className={`${category.depth ? `ml-${category.depth * 6}` : ''} flex items-center`}>
              {category.children && category.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={() => toggleExpand(category.id)}
                >
                  {category.isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {category.name}
              {!searchQuery && category.childrenCount && category.childrenCount > 0 && !category.children?.length && (
                <Badge variant="outline" className="ml-2">
                  +{category.childrenCount}
                </Badge>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="max-w-md truncate">
          {category.description || 'No description'}
        </TableCell>
        <TableCell>{category.productsCount || 0}</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            {category.isActive ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <X className="h-3 w-3 mr-1" /> Inactive
              </Badge>
            )}
            {!category.isVisible && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Hidden
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
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
    );
  };

  // Render hierarchical table view
  const renderHierarchicalTable = () => {
    return (
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
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {searchQuery ? 'No categories match your search' : 'No categories found'}
              </TableCell>
            </TableRow>
          ) : (
            sortedCategories.map((category) => renderCategoryTableRow(category))
          )}
        </TableBody>
      </Table>
    );
  };

  // Render separated table view
  const renderSeparatedTables = () => {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Parent Categories</CardTitle>
            <CardDescription>Top-level categories with no parent</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParentCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchQuery ? 'No parent categories match your search' : 'No parent categories found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParentCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {category.name}
                          {category.childrenCount && category.childrenCount > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {category.childrenCount} subcategories
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {category.description || 'No description'}
                      </TableCell>
                      <TableCell>{category.productsCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {category.isActive ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <X className="h-3 w-3 mr-1" /> Inactive
                            </Badge>
                          )}
                          {!category.isVisible && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {filteredParentCategories.map(parent => {
          const subcategories = getSubcategoriesForParent(parent.id);
          if (subcategories.length === 0) return null;
          
          return (
            <Card key={`sub-${parent.id}`}>
              <CardHeader>
                <CardTitle>{parent.name} Subcategories</CardTitle>
                <CardDescription>Categories under {parent.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcategories.map((subcategory) => (
                      <TableRow key={subcategory.id}>
                        <TableCell className="font-medium">{subcategory.name}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {subcategory.description || 'No description'}
                        </TableCell>
                        <TableCell>{subcategory.productsCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {subcategory.isActive ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <X className="h-3 w-3 mr-1" /> Inactive
                              </Badge>
                            )}
                            {!subcategory.isVisible && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Hidden
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/categories/${subcategory.id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setCategoryToDelete(subcategory)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
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
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/admin/categories/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* View controls */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'hierarchical' | 'separated')}>
            <ToggleGroupItem value="hierarchical" aria-label="Hierarchical View">
              Hierarchical
            </ToggleGroupItem>
            <ToggleGroupItem value="separated" aria-label="Separated View">
              Separated
            </ToggleGroupItem>
          </ToggleGroup>
          
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as 'list' | 'grid')}>
            <ToggleGroupItem value="list" aria-label="List View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid View">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-lg text-muted-foreground">Loading categories...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          {viewType === 'list' ? (
            viewMode === 'hierarchical' ? renderHierarchicalTable() : renderSeparatedTables()
          ) : (
            <div className="p-4">
              {viewMode === 'hierarchical' ? renderHierarchicalGrid() : renderSeparatedGrid()}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(categoryToDelete)} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.name}"?
              {categoryToDelete?.childrenCount ? (
                <strong className="block mt-2 text-red-500">
                  Warning: This will also delete {categoryToDelete.childrenCount} subcategories!
                </strong>
              ) : null}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagementPage; 