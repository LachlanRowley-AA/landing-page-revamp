'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { balloonCalcMethodValues, brokerageCalcMethodValues } from '@/lib/calculatorMethods';

export interface Criteria {
  Title: string;
  Text: {
    ABN: number;
    GST: number;
    Property: boolean;
    Misc: string[];
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
    BalloonDecrease: number;
    InterestUplift: number;
  };
  AKF: number;
}

export type CriteriaMap = Record<string, Criteria>;

const CriteriaContext = createContext<CriteriaMap | null>(null);

// Helper to transform snake_case DB records to camelCase Criteria objects
function normalizeCriteria(data: any[]): CriteriaMap {
  const map: CriteriaMap = {};

  data.forEach((item) => {
    const id = item.id || item.title || 'unknown';

    map[id] = {
      Title: item.title,
      Text: {
        ABN: item.abn ?? 0,
        GST: item.gst ?? 0,
        Property: item.property ?? false,
        Misc: item.misc ?? [],
      },
      Rate: item.rate ?? 0,
      Icon: item.icon ?? '',
      MaxPrice: item.max_price ?? 0,
      MaxBalloon: item.max_balloon ?? 0,
      PrivateSaleUplift: item.private_sale_uplift ?? 0,
      FinanceFee: item.finance_fee ?? 0,
      PrivateSaleFee: item.private_sale_fee ?? 0,
      MinDeposit: item.min_deposit ?? 0,
      BalloonCalcMethod: item.balloon_calc_method,
      BrokerageCalcMethod: item.brokerage_calc_method,
      VehicleAgeImpact: {
        BalloonDecrease: item.vehicle_balloon_decrease ?? 0,
        InterestUplift: item.vehicle_interest_uplift ?? 0,
      },
      AKF: item.akf ?? 0,
    };
  });

  return map;
}

export function CriteriaHandler({ children }: { children: ReactNode }) {
  const [criteria, setCriteria] = useState<CriteriaMap>({});

  useEffect(() => {
    // ✅ Load from sessionStorage if available
    const stored = sessionStorage.getItem('criteriaData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCriteria(parsed);
        console.log('Loaded criteria from sessionStorage');
        return; // skip fetching
      } catch (e) {
        console.warn('Failed to parse stored criteria, refetching...');
      }
    }

    // ✅ Otherwise fetch from API
    const fetchCriteria = async () => {
      try {
        const res = await fetch('/api/getLenders');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const normalized = normalizeCriteria(json.data);
        setCriteria(normalized);
        sessionStorage.setItem('criteriaData', JSON.stringify(normalized));
        console.log('Fetched and stored new criteria');
      } catch (error) {
        console.error('Error fetching criteria:', error);
      }
    };

    fetchCriteria();
  }, []);

  return (
    <CriteriaContext.Provider value={criteria}>
      {children}
    </CriteriaContext.Provider>
  );
}

export function useCriteria() {
  const ctx = useContext(CriteriaContext);
  if (!ctx) throw new Error('useCriteria must be used inside CriteriaHandler');
  return ctx;
}
