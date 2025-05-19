import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';

import useProductForm from './hooks/useProductForm';
import BasicInfoTab from './components/BasicInfoTab';
import ContentTab from './components/ContentTab';
import ImagesTab from './components/ImagesTab';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    // State
    product,
    isLoading,
    isSubmitting,
    activeTab,
    errors,
    deleteDialogOpen,
    isEditMode,
    baseSlug,
    department,
    availableBrands,
    availableCategories,
    
    // State setters
    setActiveTab,
    setDeleteDialogOpen,
    setUploadedFiles,
    
    // Event handlers
    handleChange,
    handleNumberChange,
    handleSelectChange,
    handleSwitchChange,
    handleDepartmentChange,
    handleBaseSlugChange,
    handleAddImage,
    handleRemoveImage,
    handleReorderImages,
    handleSubmit,
    handleDelete,
  } = useProductForm({ productId: id });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Update the product information below'
              : 'Fill in the product information below'
            }
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading product data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <BasicInfoTab
                product={product}
                errors={errors}
                baseSlug={baseSlug}
                department={department}
                availableBrands={availableBrands}
                handleChange={handleChange}
                availableCategories={availableCategories}
                handleNumberChange={handleNumberChange}
                handleSelectChange={handleSelectChange}
                handleSwitchChange={handleSwitchChange}
                handleDepartmentChange={handleDepartmentChange}
                handleBaseSlugChange={handleBaseSlugChange}
              />
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent value="content">
              <ContentTab
                product={product}
                errors={errors}
                handleChange={handleChange}
              />
            </TabsContent>
            
            {/* Images Tab */}
            {activeTab === 'images' && (
              <ImagesTab
                images={product.images}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                onReorderImages={handleReorderImages}
                setUploadedFiles={setUploadedFiles}
              />
            )}
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            
            <div className="flex space-x-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting 
                  ? isEditMode ? 'Updating...' : 'Creating...' 
                  : isEditMode ? 'Update Product' : 'Create Product'
                }
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductEditPage; 