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
  vehicleAgeToggle: boolean;

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

  setMaxBalloonAmount: (value: number) => void;
  setBalloonAmount: (value: number) => void;

  setVehicleAgeToggle: (value: boolean) => void;
  setVehicleAgeBalloonDecrease: (value: number) => void;
  setVehicleAgeInterestUplift: (value: number) => void;

  // Calculators
  setBalloonCalcMethod: (value: balloonCalcMethodValues) => void;
  setBrokerageCalcMethod: (value: brokerageCalcMethodValues) => void;

  calculateInterestAmount: (loanAmount: number, interestRate: number, termLength: number) => number;
  calculateMonthlyRepayment: (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => number;
  calculateEffectiveRepayment: (
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

  const [maxBalloonAmount, setMaxBalloonAmount] = useState(100);
  const [balloonAmount, setBalloonAmount] = useState(0);
  const [isPrivateSale, setIsPrivateSale] = useState(false);
  const [baseFee, setBaseFee] = useState(0);
  const [privateSaleFee, setPrivateSaleFee] = useState(0);
  const [privateSaleRateUplift, setPrivateSaleRateUplift] = useState(0);

  const [vehicleAgeToggle, setVehicleAgeToggle] = useState(false);
  const [vehicleAgeBalloonDecrease, setVehicleAgeBalloonDecrease] = useState(0);
  const [vehicleAgeInterestUplift, setVehicleAgeInterestUplift] = useState(0);

  // --- Calculation helpers ---
  const [balloonCalcMethod, setBalloonCalcMethod] = useState<balloonCalcMethodValues>('Additional');
  const [brokerageCalcMethod, setBrokerageCalcMethod] =
    useState<brokerageCalcMethodValues>('IncFee');

  const calculateMonthlyRepayment = (
    loanAmount: number,
    interestRate: number,
    termLength: number
  ) => {
    if (loanAmount <= 0 || termLength <= 0) {
      return 0;
    }

    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      return loanAmount / termLength;
    }

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

  const calculateEffectiveRepayment = (
    loanAmount: number,
    fee: number,
    interestRate: number,
    termLength: number, // e.g. 12 months (excludes balloon month)
    balloonRate: number,
    calcMethod: balloonCalcMethodValues,
    brokerageCalcMethod: brokerageCalcMethodValues,
    brokerageRate = 0.03
  ): number => {
    switch (brokerageCalcMethod) {
      case 'ExFee':
        return calculateEffectiveRepay(
          loanAmount,
          loanAmount * (1 + brokerageRate) + fee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        );
      case 'IncFee':
        return calculateEffectiveRepay(
          loanAmount,
          (loanAmount + fee) * (1 + brokerageRate),
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        );
      case 'PMTDiff': {
        const baseRepay = calculateEffectiveRepay(
          loanAmount,
          loanAmount + fee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        );
        const comm = (loanAmount + fee) * 0.04; //3% with 25% reduction
        const repayIncrease = comm / termLength;
        return baseRepay + repayIncrease;
      }
      case 'Trains': {
        //Assume the base fee includes the 2.5c per $broker fee dollar so only need to calc net brokerage 2.5c
        const brokerageFee = (loanAmount + fee) * brokerageRate * 0.025;
        console.log('brokerage fee:', brokerageFee, loanAmount, fee)
        console.log('financed amount: ', loanAmount + fee + brokerageFee)
        return calculateEffectiveRepay(
          loanAmount,
          (loanAmount + fee) * (1 + brokerageRate) + brokerageFee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        )
      }
      default:
        return 0;
    }
  };

  const calculateEffectiveRepay = (
    loanAmount: number,
    financedAmount: number,
    interestRate: number,
    termLength: number, // e.g. 12 months (excludes balloon month)
    balloonRate: number,
    calcMethod: balloonCalcMethodValues
  ): number => {
    if (loanAmount <= 0 || termLength <= 0) {
      return 0;
    }
    const balloonValue = (loanAmount * balloonRate) / 100;
    console.log('balloon value is:', balloonValue);
    const r = interestRate / 100 / 12;

    if (r === 0) {
      // No interest → divide evenly across n repayments, balloon at end
      return (financedAmount - balloonValue) / termLength;
    }

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
        // return (financedAmount * r) / (1 - (1 + r) ** -termLength);
    }
    return ((financedAmount - balloonValue / (1 + r) ** termLength) * r) / (1 - (1 + r) ** -n);
  };

  function findEffectiveRateBinaryBalloon(
    principal: number,
    fee: number,
    realMonthly: number,
    numMonths: number,
    balloonRate: number,
    balloonCalcMethod: balloonCalcMethodValues,
    tolerance = 0.01,
    maxIterations = 1000
  ) {
    if (principal <= 0 || realMonthly >= 0 || balloonAmount < 0) {
      return {
        monthlyRate: 0,
        annualRate: 0,
        annualRatePercent: 0,
        iterations: 0,
      };
    }
    // Binary search
    let low = 0;
    let high = 100;
    let mid = 0;
    let iteration = 0;

    for (iteration = 1; iteration <= maxIterations; iteration++) {
      mid = (low + high) / 2;
      const value = calculateEffectiveRepayment(
        principal,
        fee,
        mid,
        numMonths,
        balloonRate,
        balloonCalcMethod,
        'IncFee',
        0
      );

      const diff = Math.abs(realMonthly) - value;

      if (Math.abs(diff) < tolerance) {
        break;
      }

      if (diff > 0) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const annualRatePercent = mid;

    return { annualRatePercent };
  }

  // --- Internal utilities ---
  function findEffectiveInterestRate(
    principal: number,
    fee: number,
    monthlyPayment: number,
    baseMonths: number,
    balloonAmount: number,
    balloonCalcMethod: balloonCalcMethodValues
  ) {
    if (principal <= 0 || monthlyPayment >= 0) {
      return { monthlyRate: 0, annualRate: 0, annualRatePercent: 0, iterations: 1 };
    }
    const binaryRate = findEffectiveRateBinaryBalloon(
      principal,
      fee,
      monthlyPayment,
      baseMonths,
      balloonAmount,
      balloonCalcMethod,
      0.01
    );
    return binaryRate;
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
    let realInterestRate = isPrivateSale
      ? loanInterestRate + privateSaleRateUplift
      : loanInterestRate;
    realInterestRate = vehicleAgeToggle
      ? realInterestRate + vehicleAgeInterestUplift
      : realInterestRate;

    const interestAmount = calculateInterestAmount(
      amountOwed,
      realInterestRate,
      loanPaymentTermLength
    );
    const monthlyRepayment = calculateMonthlyRepayment(
      amountOwed,
      realInterestRate,
      loanPaymentTermLength
    );
    const effectiveRepayment = calculateEffectiveRepayment(
      baseAmountOwed - (baseAmountOwed * depositRate) / 100,
      amountOwed - (baseAmountOwed - (baseAmountOwed * depositRate) / 100),
      realInterestRate,
      loanPaymentTermLength,
      balloonAmount,
      balloonCalcMethod,
      brokerageCalcMethod
    );

    console.log(
      'effective repayment values',
      baseAmountOwed - (baseAmountOwed * depositRate) / 100,
      amountOwed - (baseAmountOwed - (baseAmountOwed * depositRate) / 100),
      realInterestRate,
      loanPaymentTermLength,
      balloonAmount,
      amountOwed,
      vehicleAgeToggle,
      vehicleAgeInterestUplift
    );

    const effectiveRate = findEffectiveInterestRate(
      baseAmountOwed - (baseAmountOwed * depositRate) / 100,
      baseFee,
      -effectiveRepayment,
      loanPaymentTermLength,
      balloonAmount,
      balloonCalcMethod
    ).annualRatePercent;

    setLoanInterestAmount(interestAmount);
    setLoanMonthlyRepayment(monthlyRepayment);
    setEffectiveLoanMonthlyRepayment(effectiveRepayment);
    setEffectiveLoanInterestRate(effectiveRate);
  }, [amountOwed, loanInterestRate, loanPaymentTermLength, balloonAmount, vehicleAgeToggle]);

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

        vehicleAgeToggle,

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

        setVehicleAgeToggle,
        setVehicleAgeInterestUplift,
        setMaxBalloonAmount,
        setVehicleAgeBalloonDecrease,

        calculateInterestAmount,
        calculateMonthlyRepayment,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
