import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy loading images using Intersection Observer
 * @param {string} src - Image source URL
 * @param {Object} options - Intersection Observer options
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        ...options,
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src, options]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return { imgRef, imageSrc, isLoaded, handleLoad };
};

