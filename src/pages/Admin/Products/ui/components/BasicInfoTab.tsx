import React from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Switch } from '@app/components/ui/switch';
import { BasicInfoTabProps } from '@shared/types';
import { Separator } from '@app/components/ui/separator';

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    product,
    errors,
    baseSlug,
    availableDepartments,
    handleChange,
    handleNumberChange,
    handleSelectChange,
    handleSwitchChange,
    handleBaseSlugChange,
    availableCategories,
    handleMultiSelectChange,
    handleDepartmentIdChange,
    isFetchingDepartments
}) => {
    // Helper to format currency input
    const formatCurrency = (value: string) => {
        // Remove all characters except numbers and decimal point
        const numericValue = value.replace(/[^0-9.]/g, '');
        return numericValue;
    };

    return (
        <div className="space-y-8">
            {/* Essential Details Section */}
            <div>
                <h3 className="text-lg font-medium mb-5">Essential Details</h3>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="name">
                            Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Men's Cotton T-shirt"
                            value={product.name}
                            onChange={handleChange}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departmentId">
                            Department <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={product.departmentId || ''}
                            onValueChange={(value) => handleDepartmentIdChange(value)}
                            disabled={isFetchingDepartments}
                        >
                            <SelectTrigger id="departmentId" className={errors.departmentId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDepartments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.departmentId && (
                            <p className="text-xs text-red-500">{errors.departmentId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Status
                        </Label>
                        <Select
                            value={product.status}
                            onValueChange={(value) => handleSelectChange('status', value)}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Only active products are visible to customers
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* URL & Identification Section */}
            <div>
                <h3 className="text-lg font-medium mb-5">URL & Identification</h3>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="slug">
                            Product URL <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center rounded-md bg-muted/50 p-1 pl-3">
                                <span className="text-sm text-muted-foreground">/products/</span>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={product.slug}
                                    className={`border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${errors.slug ? 'text-red-500' : ''}`}
                                    readOnly
                                />
                            </div>
                            <div className="mt-2">
                                <Label htmlFor="baseSlug" className="text-sm font-normal">Custom URL Part:</Label>
                                <Input
                                    id="baseSlug"
                                    name="baseSlug"
                                    placeholder="e.g. cotton-t-shirt"
                                    value={baseSlug}
                                    onChange={(e) => handleBaseSlugChange(e.target.value)}
                                    className={`mt-1 ${errors.slug ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                        {errors.slug && (
                            <p className="text-xs text-red-500">{errors.slug}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            The product URL should contain only lowercase letters, numbers, and hyphens.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sku">
                            SKU
                        </Label>
                        <Input
                            id="sku"
                            name="sku"
                            placeholder="e.g. MNS-CTTN-TSHRT-L"
                            value={product.sku}
                            onChange={handleChange}
                            className={errors.sku ? 'border-red-500' : ''}
                        />
                        {errors.sku && (
                            <p className="text-xs text-red-500">{errors.sku}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Stock Keeping Unit (unique identifier)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="barcode">
                            Barcode
                        </Label>
                        <Input
                            id="barcode"
                            name="barcode"
                            placeholder="e.g. 123456789012"
                            value={product.barcode}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground">
                            UPC, ISBN, or other barcode
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div>
                <h3 className="text-lg font-medium mb-5">Pricing</h3>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Price <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                                id="price"
                                name="price"
                                className={`pl-7 ${errors.price ? 'border-red-500' : ''}`}
                                placeholder="0.00"
                                value={product.price}
                                onChange={(e) => handleNumberChange('price', formatCurrency(e.target.value))}
                            />
                        </div>
                        {errors.price && (
                            <p className="text-xs text-red-500">{errors.price}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="compareAtPrice">
                            Compare at Price
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                                id="compareAtPrice"
                                name="compareAtPrice"
                                className="pl-7"
                                placeholder="0.00"
                                value={product.compareAtPrice}
                                onChange={(e) => handleNumberChange('compareAtPrice', formatCurrency(e.target.value))}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Original price before discount (if on sale)
                        </p>
                    </div>

                    <div className="space-y-2 md:col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="taxable"
                                checked={product.taxable}
                                onCheckedChange={(checked) => handleSwitchChange('taxable', checked)}
                            />
                            <Label htmlFor="taxable">Product is taxable</Label>
                        </div>
                    </div>

                    {product.taxable && (
                        <div className="space-y-2">
                            <Label htmlFor="taxCode">
                                Tax Code
                            </Label>
                            <Input
                                id="taxCode"
                                name="taxCode"
                                placeholder="e.g. CLOTHING_CA"
                                value={product.taxCode}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">
                                Tax code for this product (if applicable)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Categories Section */}
            <div>
                <h3 className="text-lg font-medium mb-5">Categories</h3>
                <div className="space-y-4">
                    <div className='space-y-2'>
                        <Label htmlFor='categoryIds'>
                            Product Categories
                        </Label>
                        <div className="flex flex-col space-y-2">
                            <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[2.5rem]">
                                {product.categoryIds && product.categoryIds.length > 0 ? (
                                    product.categoryIds.map((categoryId) => {
                                        const category = availableCategories.find(c => c.id === categoryId);
                                        return (
                                            <div key={categoryId} className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center">
                                                {category ? category.name : categoryId}
                                                <button 
                                                    type="button"
                                                    className="ml-1 text-primary/70 hover:text-primary"
                                                    onClick={() => {
                                                        const newCategoryIds = product.categoryIds.filter(id => id !== categoryId);
                                                        handleMultiSelectChange('categoryIds', newCategoryIds);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-muted-foreground text-sm">No categories selected</div>
                                )}
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    if (value === '_none') return;
                                    
                                    // Don't add duplicates
                                    if (!product.categoryIds.includes(value)) {
                                        handleMultiSelectChange('categoryIds', [...product.categoryIds, value]);
                                    }
                                }}
                            >
                                <SelectTrigger id='categorySelect'>
                                    <SelectValue placeholder="Add Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCategories && availableCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryIds && (
                                <p className="text-xs text-red-500">{errors.categoryIds}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoTab; 