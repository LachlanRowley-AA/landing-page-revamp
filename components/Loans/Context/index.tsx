'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  balloonCalcMethodValues,
  brokerageCalcMethodValues,
  calculateEffectiveRepayment,
  calculateInterestAmount,
  calculateMonthlyRepayment,
  findEffectiveInterestRate
} from '@/lib/calculatorMethods';

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

  setAKF: (value: number) => void;
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

  const [AKF, setAKF] = useState<number>(0);

  // --- Calculation helpers ---
  const [balloonCalcMethod, setBalloonCalcMethod] = useState<balloonCalcMethodValues>('Additional');
  const [brokerageCalcMethod, setBrokerageCalcMethod] =
    useState<brokerageCalcMethodValues>('IncFee');

  // --- Derived state ---
  useEffect(() => {
    const total =
      baseAmountOwed -
      (baseAmountOwed * depositRate) / 100 +
      baseFee +
      (isPrivateSale ? privateSaleFee : 0);
    setAmountOwed(total);
    console.log('Recalculated amount owed:', total);
    console.log('Base Amount Owed:', baseAmountOwed);
    console.log('Deposit Rate:', depositRate);
    console.log('Base Fee:', baseFee);
    console.log('Private Sale Fee:', isPrivateSale ? privateSaleFee : 0);
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
      brokerageCalcMethod,
      0.03,
      AKF
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

    console.log('Recalculated effective interest rate:', effectiveRate);
    console.log('Recalculated effective repayment:', effectiveRepayment);

  }, [amountOwed, loanInterestRate, loanPaymentTermLength, balloonAmount, vehicleAgeToggle, AKF]);

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

        setAKF,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
