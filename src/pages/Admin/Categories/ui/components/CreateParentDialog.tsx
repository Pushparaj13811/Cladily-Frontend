import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Switch } from '@app/components/ui/switch';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Department } from '@shared/types';
import { ParentCategoryFormState } from '../hooks/useCategoryForm';
import { Alert, AlertDescription, AlertTitle } from '@app/components/ui/alert';

interface CreateParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newParentCategory: ParentCategoryFormState;
  setNewParentCategory: React.Dispatch<React.SetStateAction<ParentCategoryFormState>>;
  onCreateParent: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

const CreateParentDialog: React.FC<CreateParentDialogProps> = ({
  open,
  onOpenChange,
  newParentCategory,
  setNewParentCategory,
  onCreateParent,
  onCancel,
  isCreating
}) => {
  const [slugError, setSlugError] = useState<string | null>(null);
  const [baseCategorySlug, setBaseCategorySlug] = useState('');
  
  // Generate a slug from text
  const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  // Generate full slug with department prefix
  const generateFullSlug = (department: Department | string, baseSlug: string): string => {
    const deptSlug = slugify(department.toString());
    const cleanBaseSlug = slugify(baseSlug);
    return `${deptSlug}/${cleanBaseSlug}`;
  };
  
  // Effect to update the slug when department or base slug changes
  useEffect(() => {
    if (newParentCategory.department && baseCategorySlug) {
      const fullSlug = generateFullSlug(newParentCategory.department, baseCategorySlug);
      setNewParentCategory(prev => ({
        ...prev,
        slug: fullSlug
      }));
    }
  }, [newParentCategory.department, baseCategorySlug]);
  
  // Handle name change to update base slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newBaseSlug = slugify(name);
    
    setNewParentCategory(prev => ({ 
      ...prev, 
      name: name,
    }));
    
    setBaseCategorySlug(newBaseSlug);
  };
  
  // Handle slug change (only the category part, not department)
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any characters that aren't allowed in slugs
    const sanitizedValue = inputValue.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')  // Remove all chars except lowercase letters, numbers and hyphens
      .replace(/--+/g, '-')        // Replace multiple hyphens with single hyphen
      .replace(/^-+/, '')          // Remove hyphens from start
      .replace(/-+$/, '');         // Remove hyphens from end
    
    setBaseCategorySlug(sanitizedValue);
  };
  
  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setNewParentCategory(prev => ({ 
      ...prev, 
      department: value as Department
    }));
  };
  
  // Handle form submission with error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugError(null); // Clear previous errors
    
    try {
      await onCreateParent(e);
    } catch (error) {
      // If it's a slug error, capture it and show suggestions
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('slug already exists')) {
        setSlugError('A category with this slug already exists.');
        
        // Suggest an alternative slug by adding a random number
        const randomSuffix = Math.floor(Math.random() * 1000);
        const departmentPart = newParentCategory.slug.split('/')[0];
        const newBaseSlug = `${baseCategorySlug}-${randomSuffix}`;
        const suggestedSlug = `${departmentPart}/${newBaseSlug}`;
        
        // Update form state
        setBaseCategorySlug(newBaseSlug);
        setNewParentCategory(prev => ({
          ...prev,
          slug: suggestedSlug
        }));
      }
    }
  };

  // Initialize base slug when dialog opens
  useEffect(() => {
    if (open && newParentCategory.name && !baseCategorySlug) {
      // If dialog is opened with existing data but no base slug
      if (newParentCategory.slug && newParentCategory.slug.includes('/')) {
        // Extract base slug from full slug
        const parts = newParentCategory.slug.split('/');
        setBaseCategorySlug(parts[parts.length - 1]);
      } else {
        // Generate base slug from name
        setBaseCategorySlug(slugify(newParentCategory.name));
      }
    } else if (!open) {
      // Reset base slug when dialog closes
      setBaseCategorySlug('');
      setSlugError(null);
    }
  }, [open, newParentCategory.name, newParentCategory.slug, baseCategorySlug]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Parent Category</DialogTitle>
          <DialogDescription>
            Create a new parent category which will immediately be set as the parent for this category.
          </DialogDescription>
        </DialogHeader>

        {slugError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {slugError} We've suggested an alternative slug.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="parentName">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parentName"
                placeholder="e.g. Clothing"
                value={newParentCategory.name}
                onChange={handleNameChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentDepartment">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newParentCategory.department}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger id="parentDepartment">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentSlug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="mr-2 text-muted-foreground">/products/category/</span>
                  <Input
                    id="parentSlug"
                    placeholder="e.g. menswear/clothing"
                    value={newParentCategory.slug}
                    className={slugError ? "border-red-500" : ""}
                    readOnly
                  />
                </div>
                <div className="mt-2">
                  <Label htmlFor="baseSlug" className="text-xs">Category Slug Part:</Label>
                  <Input
                    id="baseSlug"
                    placeholder="e.g. clothing"
                    value={baseCategorySlug}
                    onChange={handleSlugChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {slugError ? 
                  <span className="text-red-500">Please use the suggested slug or create a unique one.</span> : 
                  "Automatically includes department prefix. You can modify the category part."
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentDescription">Description</Label>
              <Textarea
                id="parentDescription"
                placeholder="Brief description of the category..."
                value={newParentCategory.description}
                onChange={(e) => setNewParentCategory(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="parentIsActive"
                  checked={newParentCategory.isActive}
                  onCheckedChange={(checked) => setNewParentCategory(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="parentIsActive">Category is active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="parentIsVisible"
                  checked={newParentCategory.isVisible}
                  onCheckedChange={(checked) => setNewParentCategory(prev => ({ ...prev, isVisible: checked }))}
                />
                <Label htmlFor="parentIsVisible">Visible in navigation</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Parent
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateParentDialog; 