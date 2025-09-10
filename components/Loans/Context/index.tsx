'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

export interface CalculatorContextProps {
  amountOwed: number;
  stageIndex: number;
  taxRate: number;
  isMobile: boolean;

  Loan_paymentTermLength: number;
  Loan_interestRate: number;
  Loan_interestAmount: number;
  Loan_monthlyRepayment: number;

  balloonAmount: number;

  setAmountOwed: (value: number) => void;
  setStageIndex: (value: number) => void;
  setTaxRate: (value: number) => void;
  setIsMobile: (value: boolean) => void;

  setLoan_paymentTermLength: (value: number) => void;
  setLoan_InterestRate: (value: number) => void;
  setLoan_InterestAmount: (value: number) => void;
  setLoan_MonthlyRepayment: (value: number) => void;

  setBalloonAmount: (value: number) => void;

  calculateInterestAmount: (loanAmount: number, interestRate: number, termLength: number) => void;
  calculateMonthlyRepayment: (loanAmount: number, interestRate: number, termLength: number) => void;
}

export const CalculatorContext = createContext<CalculatorContextProps | null>(null);

type CalculatorContextProviderProps = {
  children: ReactNode;
  isMobileProp?: boolean;
};
export function CalculatorContextProvider({ children, isMobileProp = false }: CalculatorContextProviderProps) {
  const [amountOwed, setAmountOwed] = useState<number>(1000);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0.25);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileProp);

  const [Loan_paymentTermLength, setLoan_paymentTermLength] = useState<number>(0);
  const [Loan_interestRate, setLoan_InterestRate] = useState<number>(13.95);
  const [Loan_interestAmount, setLoan_InterestAmount] = useState<number>(0);
  const [Loan_monthlyRepayment, setLoan_MonthlyRepayment] = useState<number>(0);

  const [balloonAmount, setBalloonAmount] = useState<number>(0);

  useEffect(() => {
    setIsMobile(isMobileProp);
  }, [isMobileProp]);

  const calculateMonthlyRepayment = (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => {
    const DAYS_IN_YEAR = 365;
    const DAYS_IN_MONTH = 365 / 12; // Average days per month

    if (loanAmount <= 0) {
      return 0;
    }

    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalPayments = termLength;
    const dailyRate = annualRate / DAYS_IN_YEAR;
    const daysBetweenPayments = DAYS_IN_MONTH;

    const effectivePeriodRate = (1 + dailyRate) ** daysBetweenPayments - 1;

    if (monthlyRate === 0) {
      return loanAmount / termLength;
    }

    return (
      loanAmount *
      ((effectivePeriodRate * (1 + effectivePeriodRate) ** totalPayments) /
        ((1 + effectivePeriodRate) ** totalPayments - 1))
    );
  };

  const calculateDailyInterest = (loanAmount: number, interestRate: number, days: number) => {
    const DAYS_IN_YEAR = 365;
    const DAYS_IN_MONTH = 365 / 12; // Average days per month

    if (loanAmount <= 0) {
      return 0;
    }

    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const dailyRate = annualRate / DAYS_IN_YEAR;
    const daysBetweenPayments = DAYS_IN_MONTH;

    if (monthlyRate === 0) {
      return 0;
    }

    console.log('daily', (1 + dailyRate) ** 7);

    return loanAmount * (1 + dailyRate) ** days;
  };

  const calculateInterestAmount = (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => {
    return (
      calculateMonthlyRepayment(loanAmount, interestRate, termLength) * termLength - loanAmount
    );
  };

  useEffect(() => {
    setLoan_InterestAmount(
      calculateInterestAmount(amountOwed, Loan_interestRate, Loan_paymentTermLength)
    );
    setLoan_MonthlyRepayment(
      calculateMonthlyRepayment(amountOwed, Loan_interestRate, Loan_paymentTermLength)
    );
  }, [amountOwed, Loan_interestRate, Loan_paymentTermLength]);

  return (
    <CalculatorContext.Provider
      value={{
        amountOwed,
        stageIndex,
        taxRate,
        isMobile,

        Loan_interestRate,
        Loan_interestAmount,
        Loan_monthlyRepayment,
        Loan_paymentTermLength,

        balloonAmount,

        setAmountOwed,
        setStageIndex,
        setTaxRate,
        setIsMobile,

        setLoan_InterestRate,
        setLoan_InterestAmount,
        setLoan_MonthlyRepayment,
        setLoan_paymentTermLength,

        setBalloonAmount,

        calculateInterestAmount,
        calculateMonthlyRepayment,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
