'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface LoadingState {
  slider: boolean;
  blogs: boolean;
  announcements: boolean;
  testimonials: boolean;
  isAllContentLoaded: boolean;
}

interface LoadingContextType {
  loadingState: LoadingState;
  setSliderLoaded: (loaded: boolean) => void;
  setBlogsLoaded: (loaded: boolean) => void;
  setAnnouncementsLoaded: (loaded: boolean) => void;
  setTestimonialsLoaded: (loaded: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    slider: true,
    blogs: true,
    announcements: true,
    testimonials: true,
    isAllContentLoaded: false,
  });

  // Check if all content is loaded
  useEffect(() => {
    const isAllLoaded = !loadingState.slider && !loadingState.blogs && 
                       !loadingState.announcements && !loadingState.testimonials;
    
    console.log('Loading state check:', {
      slider: loadingState.slider,
      blogs: loadingState.blogs,
      announcements: loadingState.announcements,
      testimonials: loadingState.testimonials,
      isAllLoaded
    });
    
    if (isAllLoaded && !loadingState.isAllContentLoaded) {
      setLoadingState(prev => ({
        ...prev,
        isAllContentLoaded: true,
      }));
    }
  }, [loadingState.slider, loadingState.blogs, loadingState.announcements, loadingState.testimonials, loadingState.isAllContentLoaded]);

  const setSliderLoaded = useCallback((loaded: boolean) => {
    console.log('Setting slider loaded:', loaded);
    setLoadingState(prev => {
      if (prev.slider === !loaded) return prev; // No change needed
      return {
        ...prev,
        slider: !loaded, // true = loading, false = loaded
      };
    });
  }, []);

  const setBlogsLoaded = useCallback((loaded: boolean) => {
    console.log('Setting blogs loaded:', loaded);
    setLoadingState(prev => {
      if (prev.blogs === !loaded) return prev; // No change needed
      return {
        ...prev,
        blogs: !loaded,
      };
    });
  }, []);

  const setAnnouncementsLoaded = useCallback((loaded: boolean) => {
    console.log('Setting announcements loaded:', loaded);
    setLoadingState(prev => {
      if (prev.announcements === !loaded) return prev; // No change needed
      return {
        ...prev,
        announcements: !loaded,
      };
    });
  }, []);

  const setTestimonialsLoaded = useCallback((loaded: boolean) => {
    console.log('Setting testimonials loaded:', loaded);
    setLoadingState(prev => {
      if (prev.testimonials === !loaded) return prev; // No change needed
      return {
        ...prev,
        testimonials: !loaded,
      };
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    loadingState,
    setSliderLoaded,
    setBlogsLoaded,
    setAnnouncementsLoaded,
    setTestimonialsLoaded,
  }), [loadingState, setSliderLoaded, setBlogsLoaded, setAnnouncementsLoaded, setTestimonialsLoaded]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 