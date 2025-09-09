'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

export interface ATO_OptionsContextProps {
  amountOwed: number;
  stageIndex: number;
  taxRate: number;

  ATO_paymentTermLength: number;
  ATO_interestRate: number;
  ATO_interestAmount: number;
  ATO_monthlyRepayment: number;
  
  Loan_paymentTermLength: number;
  Loan_interestRate: number;
  Loan_interestAmount: number;
  Loan_monthlyRepayment: number;

  setAmountOwed: (value: number) => void;
  setStageIndex: (value: number) => void;
  setTaxRate: (value: number) => void;

  setATO_paymentTermLength: (value: number) => void;
  setATO_InterestRate: (value: number) => void;
  setATO_InterestAmount: (value: number) => void;
  setATO_MonthlyRepayment: (value: number) => void;
  
  setLoan_paymentTermLength: (value: number) => void;
  setLoan_InterestRate: (value: number) => void;
  setLoan_InterestAmount: (value: number) => void;
  setLoan_MonthlyRepayment: (value: number) => void;
  calculateInterestAmount: (loanAmount: number, interestRate: number, termLength: number) => void; 
}

export const ATO_OptionsContext = createContext<ATO_OptionsContextProps | null>(null);

type ATO_ContextProviderProps = {
  children: ReactNode;
};
export function ATO_ContextProvider({ children }: ATO_ContextProviderProps) {
  const [amountOwed, setAmountOwed] = useState<number>(1000);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0.25)

  const [ATO_paymentTermLength, setATO_paymentTermLength] = useState<number>(0);
  const [ATO_interestRate, setATO_InterestRate] = useState<number>(0);
  const [ATO_interestAmount, setATO_InterestAmount] = useState<number>(0);
  const [ATO_monthlyRepayment, setATO_MonthlyRepayment] = useState<number>(0);

  const [Loan_paymentTermLength, setLoan_paymentTermLength] = useState<number>(0);
  const [Loan_interestRate, setLoan_InterestRate] = useState<number>(12.95);
  const [Loan_interestAmount, setLoan_InterestAmount] = useState<number>(0);
  const [Loan_monthlyRepayment, setLoan_MonthlyRepayment] = useState<number>(0);


  const calculateMonthlyRepayment = (loanAmount: number, interestRate: number, termLength: number) => {
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
      return (loanAmount / termLength);
    }

    return (
      loanAmount *
        ((effectivePeriodRate * (1 + effectivePeriodRate) ** totalPayments) /
          ((1 + effectivePeriodRate) ** totalPayments - 1))
    );
  };

  const calculateInterestAmount = (loanAmount: number, interestRate: number, termLength: number) => {
    return calculateMonthlyRepayment(loanAmount, interestRate, termLength) * (termLength) - loanAmount;
  };


  useEffect(() => {
    setATO_InterestAmount(calculateInterestAmount(amountOwed, ATO_interestRate, ATO_paymentTermLength));
  }, [amountOwed, ATO_paymentTermLength, ATO_interestRate]);


    useEffect(() => {
    setLoan_InterestAmount(calculateInterestAmount(amountOwed, Loan_interestRate, Loan_paymentTermLength));
  }, [amountOwed, Loan_interestRate, Loan_paymentTermLength]);

  return (
    <ATO_OptionsContext.Provider
      value={{
        amountOwed,
        stageIndex,
        taxRate,

        ATO_paymentTermLength,
        ATO_interestRate,
        ATO_interestAmount,
        ATO_monthlyRepayment,

        Loan_interestRate,
        Loan_interestAmount,
        Loan_monthlyRepayment,
        Loan_paymentTermLength,
        
        setAmountOwed,
        setStageIndex,
        setTaxRate,

        setATO_paymentTermLength,
        setATO_InterestRate,
        setATO_InterestAmount,
        setATO_MonthlyRepayment,

        setLoan_InterestRate,
        setLoan_InterestAmount,
        setLoan_MonthlyRepayment,
        setLoan_paymentTermLength,
        calculateInterestAmount,
      }}
    >
      {children}
    </ATO_OptionsContext.Provider>
  );
}
