import React from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';

interface SEOSettingsTabProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({
  metaTitle,
  metaDescription,
  metaKeywords,
  handleChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>
          Search Engine Optimization information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            placeholder="e.g. Men's T-shirts | Store Name"
            value={metaTitle}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            The title that appears in search engine results. If left empty, the category name will be used.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            placeholder="Brief description for search engine results..."
            value={metaDescription}
            onChange={handleChange}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            A concise description that appears in search engine results. Recommended: 150-160 characters.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Meta Keywords</Label>
          <Input
            id="metaKeywords"
            name="metaKeywords"
            placeholder="e.g. t-shirts, men's clothing, casual wear"
            value={metaKeywords}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated keywords relevant to this category.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOSettingsTab; 