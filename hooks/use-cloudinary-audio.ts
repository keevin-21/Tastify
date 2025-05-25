"use client";

import { useCallback, useMemo } from 'react';
import { useAudio } from 'react-use';

export const useCloudinaryAudio = (src: string | null) => {
  // Generate Cloudinary audio URL
  const audioUrl = useMemo(() => {
    if (!src) return '';
    
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
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured, falling back to local audio');
      return src;
    }

    // Include the correct folder path for options
    return `https://res.cloudinary.com/${cloudName}/video/upload/tastify/audio/options/${publicId}.mp3`;
  }, [src]);

  // Only use useAudio if we have a valid audio URL
  const shouldUseAudio = Boolean(audioUrl);
  
  const [audio, state, controls] = useAudio(
    shouldUseAudio 
      ? {
          src: audioUrl,
          preload: 'metadata',
        }
      : {
          src: '', // Empty src to prevent warnings
          preload: 'none',
        }
  );

  const play = useCallback(() => {
    if (audioUrl && controls && shouldUseAudio) {
      controls.play();
    }
  }, [audioUrl, controls, shouldUseAudio]);

  const pause = useCallback(() => {
    if (controls && shouldUseAudio) {
      controls.pause();
    }
  }, [controls, shouldUseAudio]);

  const stop = useCallback(() => {
    if (controls && shouldUseAudio) {
      controls.pause();
      controls.seek(0);
    }
  }, [controls, shouldUseAudio]);

  return {
    audio: shouldUseAudio ? audio : null,
    state,
    controls: {
      ...controls,
      play,
      pause,
      stop,
    },
    audioUrl,
    hasAudio: shouldUseAudio,
  };
}; 