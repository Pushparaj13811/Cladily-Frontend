import React from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';

interface MediaSettingsTabProps {
  imageUrl: string;
  iconUrl: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MediaSettingsTab: React.FC<MediaSettingsTabProps> = ({
  imageUrl,
  iconUrl,
  handleChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media & Display</CardTitle>
        <CardDescription>
          Category images and display settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Category Banner Image</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            URL of a banner image for this category. Recommended size: 1200x300px.
          </p>
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs mb-1">Preview:</p>
              <div className="h-32 w-full rounded-md overflow-hidden border">
                <img
                  src={imageUrl}
                  alt="Category banner"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x300?text=Image+Not+Found';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="iconUrl">Category Icon</Label>
          <Input
            id="iconUrl"
            name="iconUrl"
            placeholder="https://example.com/icon.svg"
            value={iconUrl}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            URL of an icon for this category. Recommended size: 64x64px.
          </p>
          {iconUrl && (
            <div className="mt-2">
              <p className="text-xs mb-1">Preview:</p>
              <div className="h-16 w-16 rounded-md overflow-hidden border p-2">
                <img
                  src={iconUrl}
                  alt="Category icon"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Icon';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaSettingsTab; 