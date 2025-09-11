'use client';

import { createContext, ReactNode, useContext } from 'react';
import criteria from '../CriteriaList.json';

interface Criteria {
  Title: string;
  Text: string[];
  Rate: number;
  Icon: string;
}
type CriteriaMap = Record<string, Criteria>;

const CriteriaContext = createContext<CriteriaMap | null>(null);

export function CriteriaHandler({ children }: { children: ReactNode }) {
  return <CriteriaContext.Provider value={criteria}>{children}</CriteriaContext.Provider>;
}

export function useCriteria() {
  const ctx = useContext(CriteriaContext);
  if (!ctx) {
    throw new Error('useCriteria must be used inside CriteriaProvider');
  }
  return ctx;
}
