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

import useCategoryForm from './hooks/useCategoryForm';
import CategoryTypeSelector from './components/CategoryTypeSelector';
import BasicInfoTab from './components/BasicInfoTab';
import MediaSettingsTab from './components/MediaSettingsTab';
import SEOSettingsTab from './components/SEOSettingsTab';
import DeleteCategoryDialog from './components/DeleteCategoryDialog';
import CreateParentDialog from './components/CreateParentDialog';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    // State
    category,
    categoryType,
    isLoading,
    isSubmitting,
    activeTab,
    errors,
    deleteDialogOpen,
    parentCategoryDialogOpen,
    newParentCategory,
    creatingParent,
    parentCategories,
    loadingParentCategories,
    isEditMode,
    
    // State setters
    setActiveTab,
    setDeleteDialogOpen,
    setParentCategoryDialogOpen,
    setNewParentCategory,
    
    // Event handlers
    handleChange,
    handleCategoryTypeChange,
    handleNumberChange,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit,
    handleDelete,
    handleCreateParentCategory,
    
    // Utility functions
    resetNewParentForm,
  } = useCategoryForm({ categoryId: id });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Update the category information below'
              : 'Fill in the category information below'
            }
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading category data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!isEditMode && (
            <CategoryTypeSelector
              value={categoryType}
              onChange={handleCategoryTypeChange}
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="media">Media & Display</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <BasicInfoTab
                category={category}
                categoryType={categoryType}
                errors={errors}
                parentCategories={parentCategories}
                loadingParentCategories={loadingParentCategories}
                handleChange={handleChange}
                handleNumberChange={handleNumberChange}
                handleSelectChange={handleSelectChange}
                handleSwitchChange={handleSwitchChange}
                onOpenParentCategoryDialog={() => setParentCategoryDialogOpen(true)}
              />
            </TabsContent>
            
            {/* Media Settings Tab */}
            <TabsContent value="media">
              <MediaSettingsTab
                imageUrl={category.imageUrl}
                iconUrl={category.iconUrl}
                handleChange={handleChange}
              />
            </TabsContent>
            
            {/* SEO Settings Tab */}
            <TabsContent value="seo">
              <SEOSettingsTab
                metaTitle={category.metaTitle}
                metaDescription={category.metaDescription}
                metaKeywords={category.metaKeywords}
                handleChange={handleChange}
              />
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/categories')}
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
                  : isEditMode ? 'Update Category' : `Create ${categoryType === 'parent' ? 'Parent Category' : 'Subcategory'}`
                }
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
      
      {/* Create Parent Category Dialog */}
      <CreateParentDialog
        open={parentCategoryDialogOpen}
        onOpenChange={setParentCategoryDialogOpen}
        newParentCategory={newParentCategory}
        setNewParentCategory={setNewParentCategory}
        onCreateParent={handleCreateParentCategory}
        onCancel={() => {
          setParentCategoryDialogOpen(false);
          resetNewParentForm();
        }}
        isCreating={creatingParent}
      />
    </div>
  );
};

export default CategoryEditPage; 