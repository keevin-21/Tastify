"use client";

import { useMemo } from 'react';

export const useCloudinaryLessonImage = (src: string | null) => {
  // Generate Cloudinary image URL
  const imageUrl = useMemo(() => {
    if (!src) return '';
    
    // For CldImage, we just need to return the public ID with the folder structure
    const cleanName = src.replace(/^\//, '').replace(/\.[^/.]+$/, '');
    return `tastify/lessons/${cleanName}`;
  }, [src]);

  return {
    imageUrl,
    hasImage: Boolean(imageUrl),
  };
};
