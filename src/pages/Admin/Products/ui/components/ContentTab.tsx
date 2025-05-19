import React from 'react';
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { ProductFormState } from '@shared/types';

interface ContentTabProps {
    product: ProductFormState;
    errors: Record<string, string>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
    product,
    errors,
    handleChange
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Content</CardTitle>
                <CardDescription>
                    Detailed information about the product
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="shortDescription">
                        Short Description
                    </Label>
                    <Textarea
                        id="shortDescription"
                        name="shortDescription"
                        placeholder="Brief summary of the product (for listings and search results)"
                        value={product.shortDescription}
                        onChange={handleChange}
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        A brief summary used in product listings. Keep it concise.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">
                        Full Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed product description..."
                        value={product.description}
                        onChange={handleChange}
                        className={errors.description ? 'border-red-500' : ''}
                        rows={10}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">{errors.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Comprehensive description including features, benefits, and other details.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="searchKeywords">
                        Search Keywords
                    </Label>
                    <Textarea
                        id="searchKeywords"
                        name="searchKeywords"
                        placeholder="Keywords to help customers find this product (separated by commas)"
                        value={product.searchKeywords}
                        onChange={handleChange}
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        Keywords to improve search relevance. Separate with commas.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ContentTab; 