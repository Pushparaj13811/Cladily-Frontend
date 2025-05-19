import React, { useState, useRef } from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { ImagePlus, Trash2, MoveUp, MoveDown, Pencil, Upload, X } from 'lucide-react';

// Define ProductImage interface
interface ProductImage {
  url: string;
  altText: string;
  position: number;
  file?: File;
}

interface ImagesTabProps {
  images: ProductImage[];
  onAddImage: (image: { url: string; altText: string; file?: File }) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (images: ProductImage[]) => void;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImagesTab: React.FC<ImagesTabProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onReorderImages,
  setUploadedFiles
}) => {
  const [newImageAlt, setNewImageAlt] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  
  // Handle file input change for multiple files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      // Create preview URL for the first file
      if (filesArray.length > 0) {
        const previewUrl = URL.createObjectURL(filesArray[0]);
        setFilePreview(previewUrl);
      }
      
      // Clear any errors
      if (imageError) setImageError('');
    }
  };
  
  // Handle form submission to add new images
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setImageError('Please select at least one image file to upload');
      return;
    }
    
    // Process all selected files
    selectedFiles.forEach((file) => {
      // Create a temporary URL for display until the actual upload is complete
      const tempUrl = URL.createObjectURL(file);
      
      // Add the image with file reference
      onAddImage({ 
        url: tempUrl, 
        altText: newImageAlt || 'Product image',
        file: file
      });
      
      // Add to uploaded files array
      setUploadedFiles(prev => [...prev, file]);
    });
    
    // Clear the form and error
    setSelectedFiles([]);
    setNewImageAlt('');
    setImageError('');
    setFilePreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Reset the file selection
  const handleResetFileSelection = () => {
    setSelectedFiles([]);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Move image up in the list
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...images];
    // Swap positions
    const temp = { ...newImages[index - 1] };
    newImages[index - 1] = { ...newImages[index], position: index - 1 };
    newImages[index] = { ...temp, position: index };
    
    onReorderImages(newImages);
  };
  
  // Move image down in the list
  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    const newImages = [...images];
    // Swap positions
    const temp = { ...newImages[index + 1] };
    newImages[index + 1] = { ...newImages[index], position: index + 1 };
    newImages[index] = { ...temp, position: index };
    
    onReorderImages(newImages);
  };
  
  // Set an image as featured (main product image)
  const setAsFeatured = (url: string) => {
    setFeaturedImageUrl(url);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload and manage product photos and gallery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="featuredImageUrl">
            Featured Image
          </Label>
          <div className="text-sm text-muted-foreground mb-2">
            The main product image shown in listings. Click "Set as Featured" on any gallery image to update.
          </div>
          
          {featuredImageUrl && (
            <div className="mt-2">
              <div className="h-40 w-full rounded-md overflow-hidden border">
                <img
                  src={featuredImageUrl}
                  alt="Featured product"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Add new image form */}
        <div className="border p-4 rounded-md bg-slate-50">
          <h3 className="font-medium text-sm mb-3">Upload New Images</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="newImageFile">
                Image Files <span className="text-red-500">*</span>
              </Label>
              
              {filePreview ? (
                <div className="relative">
                  <div className="h-40 w-full rounded-md overflow-hidden border">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                    {selectedFiles.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                        +{selectedFiles.length - 1} more
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="destructive" 
                    className="absolute top-2 right-2"
                    onClick={handleResetFileSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 hover:border-primary cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to select images</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 5MB per file</p>
                  </div>
                  <input
                    id="newImageFile"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              )}
              
              {selectedFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </p>
              )}
              
              {imageError && (
                <p className="text-xs text-red-500">{imageError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newImageAlt">
                Alt Text
              </Label>
              <Input
                id="newImageAlt"
                placeholder="Description of the images for accessibility (applied to all)"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
              />
            </div>
            
            <Button 
              type="button" 
              className="w-full" 
              disabled={selectedFiles.length === 0}
              onClick={handleSubmit}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Add {selectedFiles.length > 1 ? `${selectedFiles.length} Images` : 'Image'}
            </Button>
          </form>
        </div>
        
        {/* Image gallery */}
        <div className="space-y-4">
          <h3 className="font-medium">Image Gallery</h3>
          
          {images.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No images added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={`${image.url}-${index}`} className="group relative border rounded-md overflow-hidden">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.altText || `Product image ${index + 1}`}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <Button size="sm" variant="secondary" onClick={() => moveImageUp(index)}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {index < images.length - 1 && (
                        <Button size="sm" variant="secondary" onClick={() => moveImageDown(index)}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button size="sm" variant="secondary" onClick={() => setAsFeatured(image.url)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button size="sm" variant="destructive" onClick={() => onRemoveImage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-2 text-xs truncate">
                    {image.altText || `Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesTab; 