'use client';

import { createContext, ReactNode, useContext } from 'react';
import criteriaJSON from '../CriteriaList.json';

export type balloonCalcMethodValues = "TakesFinal" | "Additional" | "OnTop" | ""
export type brokerageCalcMethodValues = "ExFee" | "IncFee" | "PMTDiff" | "Trains" |""

export interface Criteria {
  Title: string;
  Text: {
    ABN: number,
    GST: number,
    Property: boolean,
    Misc: string[],
  };
  Rate: number;
  Icon: string;
  MaxPrice: number;
  MaxBalloon: number;
  PrivateSaleUplift: number;
  FinanceFee: number;
  PrivateSaleFee: number;
  MinDeposit: number;
  BalloonCalcMethod: balloonCalcMethodValues;
  BrokerageCalcMethod: brokerageCalcMethodValues;
  VehicleAgeImpact: {
    BalloonDecrease : number,
    InterestUplift: number
  }
}
type CriteriaMap = Record<string, Criteria>;

const CriteriaContext = createContext<CriteriaMap | null>(null);

export function CriteriaHandler({ children }: { children: ReactNode }) {
  const criteria = criteriaJSON as CriteriaMap;
  return <CriteriaContext.Provider value={criteria}>{children}</CriteriaContext.Provider>;
}

export function useCriteria() {
  const ctx = useContext(CriteriaContext);
  if (!ctx) {
    throw new Error('useCriteria must be used inside CriteriaProvider');
  }
  return ctx;
}
