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
        <form onSubmit={(e) => {
          // Always prevent default form submission behavior
          e.preventDefault();
          
          // We manually call handleSubmit only from the submit button's onClick
          // This ensures the form is only submitted when the submit button is clicked
        }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
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
              <Button 
                type="button" 
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting 
                ? isEditMode ? 'Updating...' : 'Creating...' 
                : isEditMode ? 'Update' : 'Create'
              }
              </Button>
            </div>
          </div>
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