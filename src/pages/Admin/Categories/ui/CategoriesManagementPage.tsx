import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Search, ArrowUpDown, ChevronRight, ChevronDown, Check, X, LayoutGrid, List, Home, FolderTree, Folder } from 'lucide-react';
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
  CardHeader,
  CardTitle,
  CardDescription,
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
  
  // Safe navigation function to handle navigation errors
  const safeNavigate = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if React Router navigation fails
      window.location.href = path;
    }
  };

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

  // Enhanced handler for navigating to category edit page
  const handleEditCategory = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    safeNavigate(`/admin/categories/${categoryId}`);
  };
  
  // Enhanced handler for confirming category deletion
  const handleConfirmDelete = (e: React.MouseEvent, category: Category) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryToDelete(category);
  };
  
  // Enhanced handler for creating a new category
  const handleCreateCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    safeNavigate('/admin/categories/new');
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
                onClick={(e) => handleEditCategory(e, category.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleConfirmDelete(e, category)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(category.id);
                }}
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
      <TableRow key={category.id} className="border-t border-gray-200">
        <TableCell className="pl-4">
          <input type="checkbox" className="rounded border-gray-300" />
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <div className={`${category.depth ? `ml-${category.depth * 6}` : ''} flex items-center`}>
              {category.children && category.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(category.id);
                  }}
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
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border border-green-200 rounded-full">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full">
                <X className="h-3 w-3 mr-1" /> Inactive
              </Badge>
            )}
            {!category.isVisible && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-full">
                Hidden
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => handleEditCategory(e, category.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => handleConfirmDelete(e, category)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  // Render hierarchical table view
  const renderHierarchicalTable = () => {
    return (
        <Table>
          <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[30px] pl-4">
              <div className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </div>
            </TableHead>
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
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
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
                        onClick={(e) => handleEditCategory(e, category.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleConfirmDelete(e, category)}
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
                              onClick={(e) => handleEditCategory(e, subcategory.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleConfirmDelete(e, subcategory)}
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

  // Fix the navigation to edit category or create new category
  useEffect(() => {
    // Listen for popstate events to handle browser back/forward buttons
    const handlePopState = () => {
      // Force a re-render when navigation happens
      setIsLoading(isLoading);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoading]);

  return (
    <div className="p-6 w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={(e) => {
              e.preventDefault();
              safeNavigate('/admin/dashboard');
            }}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <span className="mx-2">/</span>
          <span className="text-foreground">Categories</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Manage your product categories and hierarchy
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleCreateCategory}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Add Category
          </Button>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'hierarchical' | 'separated')}>
            <ToggleGroupItem value="hierarchical" aria-label="Hierarchical View" className="bg-white data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600">
              <FolderTree className="h-4 w-4 mr-2" />
              Hierarchical
            </ToggleGroupItem>
            <ToggleGroupItem value="separated" aria-label="Separated View" className="bg-white data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600">
              <Folder className="h-4 w-4 mr-2" />
              Flat View
            </ToggleGroupItem>
          </ToggleGroup>
          
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as 'list' | 'grid')}>
            <ToggleGroupItem value="list" aria-label="List View" className="bg-white data-[state=on]:bg-purple-50 data-[state=on]:text-purple-600">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid View" className="bg-white data-[state=on]:bg-purple-50 data-[state=on]:text-purple-600">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {/* Categories display */}
      <Card>
        <CardContent className={viewType === 'grid' ? 'p-4' : 'p-0'}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
              <Button 
                variant="outline" 
                onClick={() => navigate(0)}
              >
                Retry
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Categories Found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first category</p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleCreateCategory}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> 
                Add Category
              </Button>
            </div>
          ) : (
            viewType === 'grid' ? (
              viewMode === 'hierarchical' ? renderHierarchicalGrid() : renderSeparatedGrid()
            ) : (
              viewMode === 'hierarchical' ? renderHierarchicalTable() : renderSeparatedTables()
            )
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(categoryToDelete)} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this category?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The category "{categoryToDelete?.name}" will be
              permanently removed from your catalog.
              {categoryToDelete?.childrenCount && categoryToDelete.childrenCount > 0 && (
                <div className="mt-2 p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                  Warning: This category has {categoryToDelete.childrenCount} subcategories that will also be deleted.
                </div>
              )}
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
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagementPage; 