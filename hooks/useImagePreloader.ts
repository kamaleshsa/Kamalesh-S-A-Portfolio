'use client';

import { useEffect, useState } from 'react';

const FRAME_COUNT = 240;

export const useImagePreloader = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadCounter = 0;

    const loadImages = async () => {
      // ffmpeg frames are 1-based (frame_0001)
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Path: /frames/frame_0001.webp
        const frameIndex = i.toString().padStart(4, '0');
        img.src = `/frames/frame_${frameIndex}.webp`;
        
        const onComplete = () => {
             if (!isMounted) return;
             loadCounter++;
             setLoadedCount(loadCounter);
             if (loadCounter === FRAME_COUNT) {
                setIsLoaded(true);
             }
        };

        img.onload = onComplete;
        img.onerror = () => {
            console.error(`Failed to load frame ${i}:`, img.src);
            onComplete(); // Count it anyway so we don't hang, but it won't be drawn due to safety check
        };
        
        // Push even if not loaded yet, order matters for index access
        loadedImages[i] = img;
      }
    };

    loadImages();
    setImages(loadedImages);

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, loadedCount, total: FRAME_COUNT, isLoaded };
};
