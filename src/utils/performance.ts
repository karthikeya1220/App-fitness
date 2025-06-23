import React, { memo, useMemo, useCallback } from 'react';
import { FlatList, FlatListProps } from 'react-native';

// Higher-order component for memoization
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, propsAreEqual);
};

// Custom hook for stable callbacks
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Custom hook for stable values
export const useStableValue = <T>(
  getValue: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(getValue, deps);
};

// Performance monitoring utilities
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (__DEV__ && renderTime > 16) { // 16ms = 60fps threshold
          console.warn(
            `Performance Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render`
          );
        }
      };
    });

    return React.createElement(Component, { ref, ...props });
  });
};

// Bundle size optimization utilities
export const lazyLoad = (importFunction: () => Promise<any>) => {
  return React.lazy(() =>
    importFunction().catch((error) => {
      console.error('Error loading component:', error);
      // Return a fallback component
      return {
        default: () => React.createElement('div', {}, 'Error loading component. Please refresh the page.'),
      };
    })
  );
};

// Memory optimization utilities
export const useMemoryOptimizedState = <T>(
  initialValue: T,
  maxHistorySize = 10
) => {
  const [state, setState] = React.useState(initialValue);
  const historyRef = React.useRef<T[]>([initialValue]);

  const setStateOptimized = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const nextValue = typeof newValue === 'function' ? (newValue as Function)(prev) : newValue;
      
      // Manage history size
      historyRef.current.push(nextValue);
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current = historyRef.current.slice(-maxHistorySize);
      }
      
      return nextValue;
    });
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const previousValue = historyRef.current[historyRef.current.length - 1];
      setState(previousValue);
    }
  }, []);

  return [state, setStateOptimized, undo] as const;
};

// Image loading optimization
export const optimizeImageSource = (uri: string, width?: number, height?: number) => {
  if (!uri) return { uri: '' };
  
  // Add image optimization parameters if your backend supports it
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', '80'); // Quality
  params.append('f', 'auto'); // Format
  
  const separator = uri.includes('?') ? '&' : '?';
  const optimizedUri = params.toString() ? `${uri}${separator}${params.toString()}` : uri;
  
  return {
    uri: optimizedUri,
    priority: 'high' as const,
    cache: 'force-cache' as const,
  };
};

// Network optimization utilities
export const createOptimizedFetch = (baseURL: string) => {
  const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  return async (
    endpoint: string,
    options: RequestInit & { ttl?: number } = {}
  ) => {
    const { ttl = 5 * 60 * 1000, ...fetchOptions } = options; // 5 minutes default TTL
    const url = `${baseURL}${endpoint}`;
    const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    
    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      
      // Cache successful responses
      if (response.ok) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl,
        });
      }
      
      return data;
    } catch (error) {
      // Return cached data on error if available
      if (cached) {
        console.warn('Network error, returning cached data:', error);
        return cached.data;
      }
      throw error;
    }
  };
};

// Animation optimization utilities
export const useOptimizedAnimation = () => {
  const animationFrameRef = React.useRef<number>();
  
  const requestAnimationFrame = useCallback((callback: () => void) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      callback();
      animationFrameRef.current = undefined;
    });
  }, []);
  
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return { requestAnimationFrame };
};
