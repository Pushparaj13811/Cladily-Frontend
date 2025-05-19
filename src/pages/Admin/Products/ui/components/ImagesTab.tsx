import React, { useState, useRef } from 'react';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Button } from '@app/components/ui/button';
import { Separator } from '@app/components/ui/separator';
import { ImagePlus, Trash2, MoveUp, MoveDown, Star, Upload, X, Info } from 'lucide-react';
import { Badge } from '@app/components/ui/badge';

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
  
  // Check if this is the first image (featured by default)
  const isFeatured = (index: number) => {
    return index === 0 || images[index].url === featuredImageUrl;
  };
  
  return (
    <div className="space-y-8">
      {/* Current Images Section */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-medium">Product Gallery</h3>
          <div className="text-sm text-muted-foreground flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
          </div>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No product images yet</p>
            <p className="text-sm text-muted-foreground">Upload images using the form below</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div 
                key={`${image.url}-${index}`} 
                className="relative group border rounded-md overflow-hidden bg-white"
              >
                <div className="h-48 w-full overflow-hidden">
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
                      <Button size="sm" variant="outline" className="bg-white" onClick={() => moveImageUp(index)}>
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {index < images.length - 1 && (
                      <Button size="sm" variant="outline" className="bg-white" onClick={() => moveImageDown(index)}>
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white"
                      onClick={() => setAsFeatured(image.url)}
                      disabled={isFeatured(index)}
                    >
                      <Star className={`h-4 w-4 ${isFeatured(index) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                    
                    <Button size="sm" variant="outline" className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onRemoveImage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isFeatured(index) && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                )}
                
                <div className="p-2 text-xs border-t bg-gray-50">
                  <p className="truncate">{image.altText || 'No alt text'}</p>
                  <p className="text-muted-foreground">Position: {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Upload Images Section */}
      <div>
        <h3 className="text-lg font-medium mb-5">Upload Images</h3>
        <div className="bg-gray-50 border rounded-md p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newImageFile" className="text-sm font-medium">
                Select Images <span className="text-red-500">*</span>
              </Label>
              
              {filePreview ? (
                <div className="relative">
                  <div className="h-48 w-full rounded-md overflow-hidden border bg-white">
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
                    variant="outline" 
                    className="absolute top-2 right-2 bg-white"
                    onClick={handleResetFileSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 hover:border-primary cursor-pointer bg-white" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Drag and drop files or click to browse</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports: JPG, PNG, WebP, GIF up to 5MB
                    </p>
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
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </p>
              )}
              
              {imageError && (
                <p className="text-xs text-red-500">{imageError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newImageAlt" className="text-sm font-medium">
                Alt Text
              </Label>
              <Input
                id="newImageAlt"
                placeholder="Description of the images for accessibility (applied to all)"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Text describing the image for users who can't see it. Good for SEO too.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                className="bg-primary hover:bg-primary/90 text-white" 
                disabled={selectedFiles.length === 0}
                onClick={handleSubmit}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length > 1 ? `${selectedFiles.length} Images` : 'Image'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImagesTab; 