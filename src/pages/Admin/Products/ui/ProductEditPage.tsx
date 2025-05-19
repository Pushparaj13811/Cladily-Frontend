import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, Home } from 'lucide-react';
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
import { Card, CardContent } from '@app/components/ui/card';

import useProductForm from './hooks/useProductForm';
import BasicInfoTab from './components/BasicInfoTab';
import ContentTab from './components/ContentTab';
import ImagesTab from './components/ImagesTab';
import VariantsTab from './components/VariantsTab';

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
    baseSlug,
    department,
    departmentId,
    availableDepartments,
    availableCategories,
    isFetchingDepartments,
    
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
    handleDepartmentIdChange,
    handleBaseSlugChange,
    handleAddImage,
    handleRemoveImage,
    handleReorderImages,
    handleSubmit,
    handleDelete,
    handleMultiSelectChange,
    
    // Variant handlers
    handleVariantToggle,
    handleAddVariantOption,
    handleUpdateVariantOption,
    handleRemoveVariantOption,
    handleGenerateVariants,
    handleUpdateVariant,
    handleRemoveVariant,
  } = useProductForm({ productId: id });
  
  // Determine if we're in edit mode based on presence of productId
  const isEditMode = Boolean(id);
  
  return (
    <div className="p-6 w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate('/admin/dashboard')}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <span className="mx-2">/</span>
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate('/admin/products')}
          >
            Products
          </Button>
          <span className="mx-2">/</span>
          <span className="text-foreground">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </span>
        </div>
        
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? 'Update information for this product' 
                : 'Fill in the product details to create a new listing'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            
            <Button 
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting 
                ? isEditMode ? 'Updating...' : 'Creating...' 
                : isEditMode ? 'Save Changes' : 'Create Product'
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading product data...</span>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="border rounded-md shadow-sm bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b p-4">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>
              </div>
            
              <div className="p-6">
                {/* Basic Information Tab */}
                <TabsContent value="basic">
                  <BasicInfoTab
                    product={product}
                    errors={errors}
                    baseSlug={baseSlug}
                    department={department}
                    departmentId={departmentId}
                    availableDepartments={availableDepartments}
                    handleChange={handleChange}
                    availableCategories={availableCategories}
                    handleNumberChange={handleNumberChange}
                    handleSelectChange={handleSelectChange}
                    handleSwitchChange={handleSwitchChange}
                    handleDepartmentChange={handleDepartmentChange}
                    handleDepartmentIdChange={handleDepartmentIdChange}
                    handleBaseSlugChange={handleBaseSlugChange}
                    handleMultiSelectChange={handleMultiSelectChange}
                    isFetchingDepartments={isFetchingDepartments}
                  />
                </TabsContent>
                
                {/* Variants Tab */}
                <TabsContent value="variants">
                  <VariantsTab
                    product={product}
                    handleVariantToggle={handleVariantToggle}
                    handleAddVariantOption={handleAddVariantOption}
                    handleUpdateVariantOption={handleUpdateVariantOption}
                    handleRemoveVariantOption={handleRemoveVariantOption}
                    handleGenerateVariants={handleGenerateVariants}
                    handleUpdateVariant={handleUpdateVariant}
                    handleRemoveVariant={handleRemoveVariant}
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
                <TabsContent value="images">
                  <ImagesTab
                    images={product.images}
                    onAddImage={handleAddImage}
                    onRemoveImage={handleRemoveImage}
                    onReorderImages={handleReorderImages}
                    setUploadedFiles={setUploadedFiles}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          {/* Additional actions */}
          {isEditMode && (
            <div className="mt-8">
              <Card className="border border-destructive/20 bg-destructive/5 rounded-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-destructive">Delete Product</h3>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete this product.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove its data from our servers.
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
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductEditPage; 