import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Category } from '@shared/types';

// Interface for category with children and UI state
export interface CategoryWithUI extends Category {
  children?: CategoryWithUI[];
  depth?: number;
  isExpanded?: boolean;
}

interface CategoryListProps {
  categories: CategoryWithUI[];
  onToggleExpand: (categoryId: string) => void;
  onDelete: (category: CategoryWithUI) => void;
  searchQuery?: string;
}

/**
 * Component to display categories in a hierarchical table format
 */
const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onToggleExpand,
  onDelete,
  searchQuery = '',
}) => {
  const navigate = useNavigate();

  return (
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
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {searchQuery ? 'No categories match your search' : 'No categories found'}
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className={`${category.depth ? `ml-${category.depth * 6}` : ''} flex items-center`}>
                    {category.children && category.children.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 mr-1"
                        onClick={() => onToggleExpand(category.id)}
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
                    onClick={() => onDelete(category)}
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
  );
};

export default CategoryList; 