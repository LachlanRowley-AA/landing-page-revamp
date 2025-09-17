'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { balloonCalcMethodValues, brokerageCalcMethodValues } from '../Criteria/CriteriaHandler';

export interface CalculatorContextProps {
  // Loan basics
  baseAmountOwed: number;
  amountOwed: number;
  stageIndex: number;

  // Loan details
  loanPaymentTermLength: number;
  loanInterestRate: number;
  loanInterestAmount: number;
  loanMonthlyRepayment: number;
  effectiveLoanMonthlyRepayment: number;
  effectiveLoanInterestRate: number;

  depositRate: number;

  // Balloon + fees
  balloonAmount: number;
  // baseFee: number;
  isPrivateSale: boolean;
  // privateSaleRateUplift: number;
  // privateSaleFee: number;

  // Setters
  setBaseAmountOwed: (value: number) => void;
  setStageIndex: (value: number) => void;
  setIsPrivateSale: (value: boolean) => void;

  setDepositRate: (value: number) => void;

  setBaseFee: (value: number) => void;
  setPrivateSaleFee: (value: number) => void;
  setPrivateSaleRateUplift: (value: number) => void;

  setLoanPaymentTermLength: (value: number) => void;
  setLoanInterestRate: (value: number) => void;
  setLoanInterestAmount: (value: number) => void;
  setLoanMonthlyRepayment: (value: number) => void;
  setEffectiveLoanMonthlyRepayment: (value: number) => void;
  setEffectiveLoanInterestRate: (value: number) => void;
  setBalloonAmount: (value: number) => void;

  // Calculators
  // balloonCalcMethod: balloonCalcMethodValues;
  setBalloonCalcMethod: (value: balloonCalcMethodValues) => void;

  // brokerageCalcMethod: brokerageCalcMethodValues;
  setBrokerageCalcMethod: (value: brokerageCalcMethodValues) => void;

  calculateInterestAmount: (loanAmount: number, interestRate: number, termLength: number) => number;
  calculateMonthlyRepayment: (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => number;
  calculateEffectiveRate: (
    loanAmount: number,
    fees: number,
    interestRate: number,
    termLength: number,
    balloonRate: number,
    calcMethod: balloonCalcMethodValues,
    brokerageCalcMethod: brokerageCalcMethodValues,
    brokerageRate?: number
  ) => number;
}

export const CalculatorContext = createContext<CalculatorContextProps | null>(null);

type ProviderProps = {
  children: ReactNode;
};

export function CalculatorContextProvider({ children }: ProviderProps) {
  // Loan states
  const [baseAmountOwed, setBaseAmountOwed] = useState(1000);
  const [amountOwed, setAmountOwed] = useState(1000);
  const [stageIndex, setStageIndex] = useState(0);

  const [depositRate, setDepositRate] = useState(0);

  const [loanPaymentTermLength, setLoanPaymentTermLength] = useState(0);
  const [loanInterestRate, setLoanInterestRate] = useState(13.95);
  const [loanInterestAmount, setLoanInterestAmount] = useState(0);
  const [loanMonthlyRepayment, setLoanMonthlyRepayment] = useState(0);

  const [effectiveLoanMonthlyRepayment, setEffectiveLoanMonthlyRepayment] = useState(0);
  const [effectiveLoanInterestRate, setEffectiveLoanInterestRate] = useState(0);

  // Fees & balloon
  const [balloonAmount, setBalloonAmount] = useState(0);
  const [isPrivateSale, setIsPrivateSale] = useState(false);
  const [baseFee, setBaseFee] = useState(0);
  const [privateSaleFee, setPrivateSaleFee] = useState(0);
  const [privateSaleRateUplift, setPrivateSaleRateUplift] = useState(0);

  // --- Calculation helpers ---
  const [balloonCalcMethod, setBalloonCalcMethod] = useState<balloonCalcMethodValues>('Additional');
  const [brokerageCalcMethod, setBrokerageCalcMethod] = useState<brokerageCalcMethodValues>('IncFee');

  const calculateMonthlyRepayment = (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => {
    if (loanAmount <= 0 || termLength <= 0) return 0;

    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) return loanAmount / termLength;

    return (loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -termLength);
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

  const calculateEffectiveRate = (
    loanAmount: number,
    fee: number,
    interestRate: number,
    termLength: number, // e.g. 12 months (excludes balloon month)
    balloonRate: number,
    calcMethod: balloonCalcMethodValues,
    brokerageCalcMethod: brokerageCalcMethodValues,
    brokerageRate = 0.03,
  ): number => {
    if (loanAmount <= 0 || termLength <= 0) {
      return 0;
    }

    let financedAmount = 0;
    switch (brokerageCalcMethod) {
      case 'ExFee':
        financedAmount = loanAmount * (1 + brokerageRate) + fee;
        break;
      case 'IncFee':
        financedAmount = (loanAmount + fee) * (1 + brokerageRate);
    }
    const balloonValue = (loanAmount * balloonRate) / 100;
    const r = interestRate / 100 / 12;

    if (r === 0) {
      // No interest → divide evenly across n repayments, balloon at end
      return (financedAmount - balloonValue) / termLength;
    }

    console.log('base term length', termLength);
    // n = number of 'normal' repayments. Balloon replaces the final repayment if it exists
    let n = 0;
    switch (calcMethod) {
      case 'TakesFinal':
        n = balloonRate > 0 ? termLength - 1 : termLength;
        break;
      case 'Additional':
        n = termLength;
        break;
      case 'OnTop':
        n = termLength;
    }
    return (
      ((financedAmount - balloonValue / Math.pow(1 + r, termLength)) * r) /
      (1 - Math.pow(1 + r, -n))
    );
  };

  // --- Internal utilities ---
  function findEffectiveInterestRate(
    principal: number,
    monthlyPayment: number,
    baseMonths: number,
    futureValue: number,
    balloonAmount : number,
    balloonCalcMethod : balloonCalcMethodValues,
    tolerance = 1e-10,
    maxIterations = 3000,
  ) {
    if (principal <= 0 || monthlyPayment >= 0) {
      return { monthlyRate: 0, annualRate: 0, annualRatePercent: 0, iterations: 1 };
    }

    let rate = 0.01 / 12; // initial guess
    let numMonths = baseMonths;
    switch (balloonCalcMethod) {
      case "Additional":
        break;
      case "TakesFinal":
        numMonths = balloonAmount > 0 ? numMonths - 1 : numMonths;
        break;
      case "OnTop":
        break;
    }

    for (let i = 0; i < maxIterations; i++) {
      const { fValue, fDerivative } = calculateFunctionAndDerivative(
        rate,
        principal,
        monthlyPayment,
        numMonths,
        futureValue
      );

      const newRate = rate - fValue / fDerivative;
      if (Math.abs(newRate - rate) < tolerance) {
        return {
          monthlyRate: newRate,
          annualRate: newRate * 12,
          annualRatePercent: newRate * 12 * 100,
          iterations: i + 1,
        };
      }
      rate = Math.max(newRate, 0.001 / 12);
    }

    throw new Error(`Failed to converge after ${maxIterations} iterations`);
  }

  function calculateFunctionAndDerivative(
    rate: number,
    principal: number,
    monthlyPayment: number,
    numMonths: number,
    futureValue: number
  ) {
    if (rate === 0) {
      const fValue = principal + monthlyPayment * numMonths - futureValue;
      const fDerivative = (monthlyPayment * numMonths * (numMonths + 1)) / 2;
      return { fValue, fDerivative };
    }

    const onePlusR = 1 + rate;
    const onePlusRtoN = onePlusR ** numMonths;

    const compoundedPrincipal = principal * onePlusRtoN;
    const annuityFV = (monthlyPayment * (onePlusRtoN - 1)) / rate;
    const fValue = compoundedPrincipal + annuityFV - futureValue;

    const dCompoundedPrincipal = principal * numMonths * onePlusR ** (numMonths - 1);
    const numerator = numMonths * onePlusRtoN * rate - (onePlusRtoN - 1);
    const dAnnuityFV = (monthlyPayment * numerator) / (rate * rate);

    return { fValue, fDerivative: dCompoundedPrincipal + dAnnuityFV };
  }

  // --- Derived state ---
  useEffect(() => {
    const total =
      baseAmountOwed -
      (baseAmountOwed * depositRate) / 100 +
      baseFee +
      (isPrivateSale ? privateSaleFee : 0);
    setAmountOwed(total);
  }, [baseAmountOwed, baseFee, isPrivateSale, privateSaleFee, depositRate]);

  useEffect(() => {
    const interestAmount = calculateInterestAmount(
      amountOwed,
      loanInterestRate,
      loanPaymentTermLength
    );
    const monthlyRepayment = calculateMonthlyRepayment(
      amountOwed,
      loanInterestRate,
      loanPaymentTermLength
    );
    const effectiveRepayment = calculateEffectiveRate(
      baseAmountOwed - (baseAmountOwed * depositRate) / 100,
      amountOwed - (baseAmountOwed - (baseAmountOwed * depositRate) / 100),
      loanInterestRate,
      loanPaymentTermLength,
      balloonAmount,
      balloonCalcMethod,
      brokerageCalcMethod,
      0.03
    );

    console.log(
      'effective repayment values',
      baseAmountOwed - (baseAmountOwed * depositRate) / 100,
      amountOwed - (baseAmountOwed - (baseAmountOwed * depositRate) / 100),
      loanInterestRate,
      loanPaymentTermLength,
      balloonAmount,
      amountOwed
    );

    console.log('interest paid: ', effectiveRepayment * (loanPaymentTermLength - 1) - amountOwed);

    const effectiveRate = findEffectiveInterestRate(
      amountOwed - (balloonAmount * baseAmountOwed) / 100,
      -effectiveRepayment,
      loanPaymentTermLength,
      (balloonAmount * baseAmountOwed) / 100,
      balloonAmount,
      balloonCalcMethod,
    ).annualRatePercent;

    setLoanInterestAmount(interestAmount);
    setLoanMonthlyRepayment(monthlyRepayment);
    setEffectiveLoanMonthlyRepayment(effectiveRepayment);
    setEffectiveLoanInterestRate(effectiveRate);
  }, [amountOwed, loanInterestRate, loanPaymentTermLength, balloonAmount]);

  return (
    <CalculatorContext.Provider
      value={{
        baseAmountOwed,
        amountOwed,
        stageIndex,

        depositRate,

        loanInterestRate,
        loanInterestAmount,
        loanMonthlyRepayment,
        loanPaymentTermLength,

        balloonAmount,
        isPrivateSale,

        effectiveLoanMonthlyRepayment,
        effectiveLoanInterestRate,

        setBaseAmountOwed,
        setStageIndex,
        setIsPrivateSale,
        setDepositRate,

        setLoanInterestRate,
        setLoanInterestAmount,
        setLoanMonthlyRepayment,
        setLoanPaymentTermLength,

        setBalloonAmount,
        setBalloonCalcMethod,
        setBrokerageCalcMethod,
        
        setEffectiveLoanMonthlyRepayment,
        setEffectiveLoanInterestRate,

        setPrivateSaleFee,
        setPrivateSaleRateUplift,
        setBaseFee,

        calculateInterestAmount,
        calculateMonthlyRepayment,
        calculateEffectiveRate,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
