import React from 'react';
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
import { Loader2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Department } from '@shared/types';
import { ParentCategoryFormState } from '../hooks/useCategoryForm';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Parent Category</DialogTitle>
          <DialogDescription>
            Create a new parent category which will immediately be set as the parent for this category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onCreateParent}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="parentName">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parentName"
                placeholder="e.g. Clothing"
                value={newParentCategory.name}
                onChange={(e) => setNewParentCategory(prev => ({ 
                  ...prev, 
                  name: e.target.value,
                  slug: e.target.value.toString()
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w-]+/g, '')
                      .replace(/--+/g, '-')
                      .replace(/^-+/, '')
                      .replace(/-+$/, '')
                }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentSlug">Slug</Label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">/products/category/</span>
                <Input
                  id="parentSlug"
                  placeholder="e.g. clothing"
                  value={newParentCategory.slug}
                  onChange={(e) => setNewParentCategory(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated from name. You can modify if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentDepartment">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newParentCategory.department}
                onValueChange={(value) => setNewParentCategory(prev => ({ ...prev, department: value as Department }))}
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