"use client";

import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  folder?: string;
};

export const CloudinaryImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  folder = "challenge_options"
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Extract public ID from src (remove file extension and leading slash)
  const getPublicId = (src: string) => {
    if (src.startsWith('http')) {
      // If it's already a full URL, extract the public ID from the path
      const url = new URL(src);
      const pathParts = url.pathname.split('/');
      // Find the index after 'upload' and join the rest
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < pathParts.length) {
        // Skip the version number and start from the folder
        return pathParts.slice(uploadIndex + 2).join('/').replace(/\.[^/.]+$/, '');
      }
      return pathParts[pathParts.length - 1].replace(/\.[^/.]+$/, '');
    }
    // If it's a local path, convert to public ID and include the folder
    return `tastify/${folder}/${src.replace(/^\//, '').replace(/\.[^/.]+$/, '')}`;
  };

  const publicId = getPublicId(src);

  if (!isMounted) return null;

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
        onLoad={() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }}
        onError={() => {
          if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          }
        }}
        // Cloudinary optimizations
        quality="auto"
        format="auto"
        crop="fill"
        gravity="center"
      />
      
      {isLoading && isMounted && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}; 