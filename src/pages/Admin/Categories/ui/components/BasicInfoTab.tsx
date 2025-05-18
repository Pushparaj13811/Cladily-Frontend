import React from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Switch } from '@app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Button } from '@app/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Department, Category } from '@shared/types';

interface BasicInfoTabProps {
  category: {
    name: string;
    slug: string;
    description: string;
    department: Department;
    parentId: string | null;
    isActive: boolean;
    isVisible: boolean;
    position: number;
  };
  categoryType: 'parent' | 'sub';
  errors: Record<string, string>;
  parentCategories: Category[];
  loadingParentCategories: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string | null) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  onOpenParentCategoryDialog: () => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  category,
  categoryType,
  errors,
  parentCategories,
  loadingParentCategories,
  handleChange,
  handleNumberChange,
  handleSelectChange,
  handleSwitchChange,
  onOpenParentCategoryDialog
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Essential details about your category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. T-shirts"
            value={category.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <span className="mr-2 text-muted-foreground">/products/category/</span>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. t-shirts"
              value={category.slug}
              onChange={handleChange}
              className={errors.slug ? 'border-red-500' : ''}
            />
          </div>
          {errors.slug && (
            <p className="text-xs text-red-500">{errors.slug}</p>
          )}
          <p className="text-xs text-muted-foreground">
            The slug is used in the URL of the category page. It should contain only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Department dropdown - only enabled for parent categories */}
        <div className="space-y-2">
          <Label htmlFor="department">
            Department <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category.department}
            onValueChange={(value) => handleSelectChange('department', value)}
            disabled={categoryType === 'sub'} // Disable for subcategories
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Department).map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categoryType === 'sub' && (
            <p className="text-xs text-muted-foreground">
              Subcategories inherit the department from their parent category.
            </p>
          )}
        </div>

        {categoryType === 'sub' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="parentId">
                Parent Category <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenParentCategoryDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Parent
              </Button>
            </div>
            <Select
              value={category.parentId || 'none'}
              onValueChange={(value) => handleSelectChange('parentId', value === 'none' ? null : value)}
            >
              <SelectTrigger id="parentId">
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                {loadingParentCategories ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : (
                  parentCategories.map(cat => (
                    cat.id ? (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} {cat.department ? `(${cat.department})` : ''}
                      </SelectItem>
                    ) : null
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.parentId && (
              <p className="text-xs text-red-500">{errors.parentId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Select the parent category under which this subcategory will be displayed.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Brief description of the category..."
            value={category.description}
            onChange={handleChange}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            A short description of the category for SEO and display purposes.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Sort Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            min="0"
            value={category.position}
            onChange={(e) => handleNumberChange('position', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Categories with higher numbers appear first. Default is 0.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={category.isActive}
              onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Category is active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isVisible"
              checked={category.isVisible}
              onCheckedChange={(checked) => handleSwitchChange('isVisible', checked)}
            />
            <Label htmlFor="isVisible">Category is visible in navigation</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab; 