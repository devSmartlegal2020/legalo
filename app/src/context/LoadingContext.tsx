import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  isReady: boolean;
  setLoading: (loading: boolean) => void;
  setReady: (ready: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setReady = useCallback((ready: boolean) => {
    setIsReady(ready);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, isReady, setLoading, setReady }}>
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
