"use client";

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export const CloudinaryImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract public ID from src (remove file extension and leading slash)
  const getPublicId = (src: string) => {
    if (src.startsWith('http')) {
      // If it's already a full URL, extract the public ID
      const parts = src.split('/');
      const filename = parts[parts.length - 1];
      return filename.replace(/\.[^/.]+$/, '');
    }
    // If it's a local path, convert to public ID
    return src.replace(/^\//, '').replace(/\.[^/.]+$/, '');
  };

  const publicId = getPublicId(src);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 text-gray-500",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <CldImage
        src={publicId}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-contain transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        // Cloudinary optimizations
        quality="auto"
        format="auto"
        crop="fill"
        gravity="center"
      />
      
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}; 