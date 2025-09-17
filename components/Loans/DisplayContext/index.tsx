'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface DisplayProps {
  isMobile: boolean;
}

const DisplayContext = createContext<DisplayProps | null>(null);

export function DisplayContextProvider({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false, {
    getInitialValueInEffect: true,
  });

  return (
    <DisplayContext.Provider value={{ isMobile: isMobile ?? false }}>
      {children}
    </DisplayContext.Provider>
  );
}

export function useDisplay() {
  const ctx = useContext(DisplayContext);
  if (!ctx) {
    throw new Error('useDisplay must be used inside DisplayContextProvider');
  }
  return ctx;
}
