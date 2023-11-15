'use client';
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  return useContext(LoadingContext);
};
