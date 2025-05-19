import React, { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Switch } from '@app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@app/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Badge } from '@app/components/ui/badge';

interface VariantOption {
  name: string;
  values: string[];
}

interface Variant {
  id?: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: string;
  compareAtPrice: string;
  position: number;
  options: Record<string, string>;
  imageUrl?: string;
  inventoryQuantity: number;
  backorder: boolean;
  requiresShipping: boolean;
}

interface VariantsTabProps {
  product: {
    hasVariants: boolean;
    variants: Variant[];
    variantOptions: VariantOption[];
  };
  handleVariantToggle: (hasVariants: boolean) => void;
  handleAddVariantOption: (option: VariantOption) => void;
  handleUpdateVariantOption: (index: number, option: VariantOption) => void;
  handleRemoveVariantOption: (index: number) => void;
  handleGenerateVariants: () => void;
  handleUpdateVariant: (index: number, variant: Variant) => void;
  handleRemoveVariant: (index: number) => void;
}

const VariantsTab: React.FC<VariantsTabProps> = ({
  product,
  handleVariantToggle,
  handleAddVariantOption,
  handleUpdateVariantOption,
  handleRemoveVariantOption,
  handleGenerateVariants,
  handleUpdateVariant,
  handleRemoveVariant,
}) => {
  const [newOption, setNewOption] = useState<VariantOption>({ name: '', values: [''] });
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<VariantOption>({ name: '', values: [''] });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  // Helper to format currency input
  const formatCurrency = (value: string) => {
    // Remove all characters except numbers and decimal point
    return value.replace(/[^0-9.]/g, '');
  };

  // Handle option name change
  const handleOptionNameChange = (value: string) => {
    if (editingOptionIndex !== null) {
      setEditingOption({ ...editingOption, name: value });
    } else {
      setNewOption({ ...newOption, name: value });
    }
  };

  // Handle option value change
  const handleOptionValueChange = (index: number, value: string) => {
    if (editingOptionIndex !== null) {
      const newValues = [...editingOption.values];
      newValues[index] = value;
      setEditingOption({ ...editingOption, values: newValues });
    } else {
      const newValues = [...newOption.values];
      newValues[index] = value;
      setNewOption({ ...newOption, values: newValues });
    }
  };

  // Add a new option value field
  const handleAddOptionValue = () => {
    if (editingOptionIndex !== null) {
      setEditingOption({ ...editingOption, values: [...editingOption.values, ''] });
    } else {
      setNewOption({ ...newOption, values: [...newOption.values, ''] });
    }
  };

  // Remove an option value field
  const handleRemoveOptionValue = (index: number) => {
    if (editingOptionIndex !== null) {
      const newValues = editingOption.values.filter((_, i) => i !== index);
      setEditingOption({ ...editingOption, values: newValues });
    } else {
      const newValues = newOption.values.filter((_, i) => i !== index);
      setNewOption({ ...newOption, values: newValues });
    }
  };

  // Save a new option
  const handleSaveOption = () => {
    // Filter out empty values
    const filteredValues = (editingOptionIndex !== null ? editingOption : newOption).values.filter(v => v.trim() !== '');
    
    if (editingOptionIndex !== null) {
      const updatedOption = { ...editingOption, values: filteredValues };
      handleUpdateVariantOption(editingOptionIndex, updatedOption);
      setEditingOptionIndex(null);
    } else {
      const updatedOption = { ...newOption, values: filteredValues };
      handleAddVariantOption(updatedOption);
      setNewOption({ name: '', values: [''] });
    }
    
    setIsOptionDialogOpen(false);
  };

  // Edit an existing option
  const handleEditOption = (index: number) => {
    setEditingOptionIndex(index);
    setEditingOption({ ...product.variantOptions[index] });
    setIsOptionDialogOpen(true);
  };

  // Edit a variant
  const handleEditVariant = (index: number) => {
    setEditingVariantIndex(index);
    setEditingVariant({ ...product.variants[index] });
    setIsVariantDialogOpen(true);
  };

  // Save variant changes
  const handleSaveVariant = () => {
    if (editingVariantIndex !== null && editingVariant) {
      handleUpdateVariant(editingVariantIndex, editingVariant);
      setEditingVariantIndex(null);
      setEditingVariant(null);
    }
    setIsVariantDialogOpen(false);
  };

  // Cancel editing an option
  const handleCancelOption = () => {
    setEditingOptionIndex(null);
    setEditingOption({ name: '', values: [''] });
    setIsOptionDialogOpen(false);
  };

  return (
    <div onSubmit={(e) => e.preventDefault()}>
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>
            Configure options and variants for this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variant toggle */}
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div>
              <h3 className="font-medium">This product has multiple variants</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enable if this product comes in multiple options like different sizes or colors
              </p>
            </div>
            <Switch
              checked={product.hasVariants}
              onCheckedChange={handleVariantToggle}
            />
          </div>

          {product.hasVariants && (
            <>
              {/* Variant options section */}
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Variant Options</h3>
                  <Button 
                    type="button"
                    size="sm" 
                    onClick={() => {
                      setEditingOptionIndex(null);
                      setNewOption({ name: '', values: [''] });
                      setIsOptionDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>

                {product.variantOptions.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">No options defined yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add options like "Size" or "Color" to create variants
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.variantOptions.map((option, index) => (
                      <div key={index} className="border rounded-md p-3 flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{option.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {option.values.map((value, vIndex) => (
                              <Badge key={vIndex} variant="outline">{value}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            type="button"
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditOption(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button"
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleRemoveVariantOption(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {product.variantOptions.length > 0 && (
                      <Button 
                        type="button"
                        className="w-full mt-4" 
                        onClick={handleGenerateVariants}
                      >
                        Generate Variants
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Variant list section */}
              {product.variants.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Product Variants</h3>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Variant</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Compare</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Inventory</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map((variant, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="font-medium">{variant.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {Object.entries(variant.options).map(([key, value]) => (
                                  <span key={key}>{key}: {value}</span>
                                )).join(', ')}
                              </div>
                            </TableCell>
                            <TableCell>${parseFloat(variant.price).toFixed(2)}</TableCell>
                            <TableCell>
                              {variant.compareAtPrice ? `$${parseFloat(variant.compareAtPrice).toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell>{variant.sku || '-'}</TableCell>
                            <TableCell>{variant.inventoryQuantity}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button 
                                  type="button"
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditVariant(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  type="button"
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleRemoveVariant(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        {/* Option Dialog */}
        <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOptionIndex !== null ? 'Edit Option' : 'Add Variant Option'}
              </DialogTitle>
              <DialogDescription>
                Add an option like Size or Color and its values
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="optionName">Option Name</Label>
                <Input
                  id="optionName"
                  placeholder="e.g. Size, Color, Material"
                  value={editingOptionIndex !== null ? editingOption.name : newOption.name}
                  onChange={(e) => handleOptionNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Option Values</Label>
                <div className="space-y-2">
                  {(editingOptionIndex !== null ? editingOption.values : newOption.values).map((value, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder={`Value ${index + 1}`}
                        value={value}
                        onChange={(e) => handleOptionValueChange(index, e.target.value)}
                      />
                      {(editingOptionIndex !== null ? editingOption.values : newOption.values).length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveOptionValue(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddOptionValue}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Value
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCancelOption}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveOption}>
                {editingOptionIndex !== null ? 'Update Option' : 'Add Option'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Variant Edit Dialog */}
        <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Variant</DialogTitle>
              <DialogDescription>
                Update details for this variant
              </DialogDescription>
            </DialogHeader>

            {editingVariant && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="variantName">Variant Name</Label>
                  <Input
                    id="variantName"
                    value={editingVariant.name}
                    onChange={(e) => setEditingVariant({ ...editingVariant, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantPrice">Price</Label>
                    <Input
                      id="variantPrice"
                      value={editingVariant.price}
                      onChange={(e) => setEditingVariant({ 
                        ...editingVariant, 
                        price: formatCurrency(e.target.value) 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantComparePrice">Compare Price</Label>
                    <Input
                      id="variantComparePrice"
                      value={editingVariant.compareAtPrice}
                      onChange={(e) => setEditingVariant({ 
                        ...editingVariant, 
                        compareAtPrice: formatCurrency(e.target.value) 
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantSku">SKU</Label>
                    <Input
                      id="variantSku"
                      value={editingVariant.sku || ''}
                      onChange={(e) => setEditingVariant({ ...editingVariant, sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantBarcode">Barcode</Label>
                    <Input
                      id="variantBarcode"
                      value={editingVariant.barcode || ''}
                      onChange={(e) => setEditingVariant({ ...editingVariant, barcode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variantInventoryQuantity">Inventory Quantity</Label>
                  <Input
                    id="variantInventoryQuantity"
                    type="number"
                    min="0"
                    value={editingVariant.inventoryQuantity}
                    onChange={(e) => setEditingVariant({ 
                      ...editingVariant, 
                      inventoryQuantity: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="variantBackorder"
                    checked={editingVariant.backorder}
                    onCheckedChange={(checked) => setEditingVariant({ 
                      ...editingVariant, 
                      backorder: checked 
                    })}
                  />
                  <Label htmlFor="variantBackorder">Allow backorders</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="variantRequiresShipping"
                    checked={editingVariant.requiresShipping}
                    onCheckedChange={(checked) => setEditingVariant({ 
                      ...editingVariant, 
                      requiresShipping: checked 
                    })}
                  />
                  <Label htmlFor="variantRequiresShipping">Requires shipping</Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsVariantDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveVariant}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default VariantsTab; 