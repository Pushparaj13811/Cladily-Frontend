import React, { useState, useEffect } from 'react';
import { generateCloudinaryUrl } from '../../utils/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    publicId,
    alt,
    width = 800,
    height,
    className = '',
    priority = false,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Generate responsive image URLs
    const urls = {
        small: generateCloudinaryUrl(publicId, { 
            width: Math.floor(width * 0.5), 
            height: height ? Math.floor(height * 0.5) : undefined,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        }) || '',
        medium: generateCloudinaryUrl(publicId, { 
            width, 
            height,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        }) || '',
        large: generateCloudinaryUrl(publicId, { 
            width: Math.floor(width * 1.5), 
            height: height ? Math.floor(height * 1.5) : undefined,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        }) || ''
    };

    // Generate blur placeholder URL
    const placeholderUrl = generateCloudinaryUrl(publicId, {
        width: 20,
        height: 20,
        crop: 'fill',
        quality: 10,
        format: 'webp'
    }) || '';

    useEffect(() => {
        setIsLoading(true);
        setError(false);
    }, [publicId]);

    // If no publicId or URL generation failed, show placeholder
    if (!publicId || !urls.medium) {
        return (
            <div
                className={`bg-muted flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <span className="text-muted-foreground">No image</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            {/* Blur placeholder */}
            {isLoading && placeholderUrl && (
                <img
                    src={placeholderUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                    style={{ filter: 'blur(20px)' }}
                />
            )}

            {/* Main image */}
            <img
                src={urls.medium}
                srcSet={`${urls.small} 400w, ${urls.medium} 800w, ${urls.large} 1200w`}
                sizes={`(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px`}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                }}
                {...props}
            />

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Failed to load image</span>
                </div>
            )}
        </div>
    );
}; 