'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

export interface ATO_OptionsContextProps {
  amountOwed: number;
  stageIndex: number;
  taxRate: number;
  isMobile: boolean;

  ATO_paymentTermLength: number;
  ATO_interestRate: number;
  ATO_interestAmount: number;
  ATO_monthlyRepayment: number;
  ATOFinalPayment: number;

  Loan_paymentTermLength: number;
  Loan_interestRate: number;
  Loan_interestAmount: number;
  Loan_monthlyRepayment: number;
  loanDeposit: boolean;

  setAmountOwed: (value: number) => void;
  setStageIndex: (value: number) => void;
  setTaxRate: (value: number) => void;
  setIsMobile: (value: boolean) => void;

  setATO_paymentTermLength: (value: number) => void;
  setATO_InterestRate: (value: number) => void;
  setATO_InterestAmount: (value: number) => void;
  setATO_MonthlyRepayment: (value: number) => void;

  setLoan_paymentTermLength: (value: number) => void;
  setLoan_InterestRate: (value: number) => void;
  setLoan_InterestAmount: (value: number) => void;
  setLoan_MonthlyRepayment: (value: number) => void;
  setLoanDeposit: (value: boolean) => void;

  calculateInterestAmount: (loanAmount: number, interestRate: number, termLength: number) => void;
  calculateMonthlyRepayment: (loanAmount: number, interestRate: number, termLength: number) => void;
}

export const ATO_OptionsContext = createContext<ATO_OptionsContextProps | null>(null);

type ATO_ContextProviderProps = {
  children: ReactNode;
  isMobileProp?: boolean;
};
export function ATO_ContextProvider({ children, isMobileProp = false }: ATO_ContextProviderProps) {
  const [amountOwed, setAmountOwed] = useState<number>(1000);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0.25);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileProp);

  const [ATO_paymentTermLength, setATO_paymentTermLength] = useState<number>(0);
  const [ATO_interestRate, setATO_InterestRate] = useState<number>(0);
  const [ATO_interestAmount, setATO_InterestAmount] = useState<number>(0);
  const [ATO_monthlyRepayment, setATO_MonthlyRepayment] = useState<number>(0);
  const [ATOFinalPayment, setATOFinalPayment] = useState<number>(0);

  const [Loan_paymentTermLength, setLoan_paymentTermLength] = useState<number>(0);
  const [Loan_interestRate, setLoan_InterestRate] = useState<number>(13.95);
  const [Loan_interestAmount, setLoan_InterestAmount] = useState<number>(0);
  const [Loan_monthlyRepayment, setLoan_MonthlyRepayment] = useState<number>(0);
  const [loanDeposit, setLoanDeposit] = useState<boolean>(false);

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

  const calculateEffectiveRepayment = (
    loanAmount: number,
    fee: number,
    interestRate: number,
    termLength: number, // e.g. 12 months (excludes balloon month)
    brokerageRate = 0.00,
    akf = 0
  ): number => {
    return (
      akf +
      calculateEffectiveRepay(
        loanAmount,
        loanAmount * (1 + brokerageRate) + fee,
        interestRate,
        termLength,
        true
      )
    );
  };

  const calculateEffectiveRepay = (
    loanAmount: number,
    financedAmount: number,
    interestRate: number,
    termLength: number, // months (excludes balloon month)
    payInAdvance: boolean = false
  ): number => {
    if (loanAmount <= 0 || termLength <= 0) {
      return 0;
    }
    const balloonValue = 0;
    const r = interestRate / 100 / 12;

    if (r === 0) {
      // No interest → divide evenly, balloon at end
      return (financedAmount - balloonValue) / termLength;
    }

    const n = termLength;
    // Standard present value with balloon discounted
    let pmt = ((financedAmount - balloonValue / (1 + r) ** termLength) * r) / (1 - (1 + r) ** -n);

    // Adjust if payments are in advance (annuity due)
    if (payInAdvance) {
      pmt /= 1 + r;
    }

    return pmt;
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
    return loanAmount * (1 + dailyRate) ** days;
  };

  const calculateInterestAmount = (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => {
    return (
      calculateEffectiveRepayment(loanAmount, 0, interestRate, termLength) * termLength - loanAmount
    );
  };

  function daysBetween(startDate: Date, endDate: Date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    return (start - end) / oneDay;
  }

  // Half-up rounding to 2 decimal places
  function round2DecimalPlaces(num: number): number {
    return Math.round(num * 100) / 100;
  }

  const calculateATORepayment = (
    amountOwed: number,
    interestRate: number,
    ATO_paymentTermLength: number
  ) => {
    const dailyRate = interestRate / 365 / 100;
    const daysInPaymentPeriod = 365 / 12;
    const startDate = new Date(); // assume the loan starts today
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + ATO_paymentTermLength)
    );

    const totalDays = daysBetween(startDate, endDate) - 1;
    const numberOfPayments = Math.ceil(totalDays / daysInPaymentPeriod);

    // 7-day initial interest
    const initialInterest = round2DecimalPlaces(amountOwed * ((1 + dailyRate) ** 7 - 1));

    // balance after deposit
    const afterDeposit = round2DecimalPlaces(amountOwed + initialInterest - amountOwed * 0.05);

    const totalPeriodDays = numberOfPayments * daysInPaymentPeriod;
    const compoundFactor = (1 + dailyRate) ** totalPeriodDays;
    const annuityFactor = compoundFactor / (compoundFactor - 1);

    // theoretical payment size
    const paymentSize = round2DecimalPlaces(
      daysInPaymentPeriod * afterDeposit * dailyRate * annuityFactor +
        initialInterest / numberOfPayments
    );

    // Simulate payments
    let currentBalance = afterDeposit;
    let totalInterest = initialInterest;
    let finalPayment = 0;

    while (currentBalance >= paymentSize) {
      const interest = round2DecimalPlaces(
        currentBalance * ((1 + dailyRate) ** daysInPaymentPeriod - 1)
      );
      currentBalance = round2DecimalPlaces(currentBalance + interest - paymentSize);
      totalInterest = round2DecimalPlaces(totalInterest + interest);
    }

    if (currentBalance > 0) {
      const finalInterest = round2DecimalPlaces(
        currentBalance * ((1 + dailyRate) ** daysInPaymentPeriod - 1)
      );
      finalPayment = round2DecimalPlaces(currentBalance + finalInterest);
      totalInterest = round2DecimalPlaces(totalInterest + finalInterest);
    }

    return {
      Payments: paymentSize,
      TotalInterest: totalInterest,
      FinalPayment: finalPayment,
    };
  };

  useEffect(() => {
    const atoResults = calculateATORepayment(amountOwed, ATO_interestRate, ATO_paymentTermLength);
    setATO_InterestAmount(atoResults.TotalInterest);
    setATO_MonthlyRepayment(atoResults.Payments);
    setATOFinalPayment(atoResults.FinalPayment);
  }, [amountOwed, ATO_paymentTermLength, ATO_interestRate]);

  useEffect(() => {
    const amount = loanDeposit ? amountOwed * 0.95 : amountOwed;
    setLoan_InterestAmount(
      calculateInterestAmount(amount, Loan_interestRate, Loan_paymentTermLength)
    );
      setLoan_MonthlyRepayment(
        calculateEffectiveRepayment(
          amount,
          0,
          Loan_interestRate,
          Loan_paymentTermLength
        )
      );
  }, [amountOwed, Loan_interestRate, Loan_paymentTermLength, loanDeposit]);

  return (
    <ATO_OptionsContext.Provider
      value={{
        amountOwed,
        stageIndex,
        taxRate,
        isMobile,

        ATO_paymentTermLength,
        ATOFinalPayment,
        ATO_interestRate,
        ATO_interestAmount,
        ATO_monthlyRepayment,

        Loan_interestRate,
        Loan_interestAmount,
        Loan_monthlyRepayment,
        Loan_paymentTermLength,
        loanDeposit,

        setAmountOwed,
        setStageIndex,
        setTaxRate,
        setIsMobile,

        setATO_paymentTermLength,
        setATO_InterestRate,
        setATO_InterestAmount,
        setATO_MonthlyRepayment,

        setLoan_InterestRate,
        setLoan_InterestAmount,
        setLoan_MonthlyRepayment,
        setLoan_paymentTermLength,
        setLoanDeposit,

        calculateInterestAmount,
        calculateMonthlyRepayment,
      }}
    >
      {children}
    </ATO_OptionsContext.Provider>
  );
}
