import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll functionality
 * @param {Function} loadMore - Function to call when more items should be loaded
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether data is currently being loaded
 * @param {Object} options - Configuration options
 */
export const useInfiniteScroll = (loadMore, hasMore, isLoading, options = {}) => {
  const {
    threshold = 0.1, // Trigger when 10% of sentinel is visible
    rootMargin = '100px', // Start loading 100px before reaching the sentinel
  } = options;

  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin,
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  return sentinelRef;
};

