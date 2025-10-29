export type balloonCalcMethodValues = 'TakesFinal' | 'Additional' | 'OnTop' | '';
export type brokerageCalcMethodValues = 'ExFee' | 'IncFee' | 'PMTDiff' | 'Trains' | 'Advance' | ''; //Advance isn't broker related but ...

export const FormatValue = (key: string, value: any) => {
  switch (key) {
    case 'ABN':
      return value >= 1
        ? `ABN registered for ${value} or more years`
        : `ABN registered for 1 day or more`;
    case 'GST':
      return value > 1
        ? `GST registered for ${value - 1} or more years`
        : value > 0
          ? `GST registered for 1 day or more`
          : 'Not GST registered';
    case 'Property':
      return value ? "Own a home in your or your spouse's name" : 'Not a property owner';
    case 'Misc':
      return Array.isArray(value) ? value : [value];
    default:
      return value;
  }
};

export const calculateMonthlyRepayment = (
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

export const calculateInterestAmount = (
  loanAmount: number,
  interestRate: number,
  termLength: number
) => {
  return calculateMonthlyRepayment(loanAmount, interestRate, termLength) * termLength - loanAmount;
};

export const calculateEffectiveRepayment = (
  loanAmount: number,
  fee: number,
  interestRate: number,
  termLength: number, // e.g. 12 months (excludes balloon month)
  balloonRate: number,
  calcMethod: balloonCalcMethodValues,
  brokerageCalcMethod: brokerageCalcMethodValues,
  brokerageRate = 0.03,
  akf = 0
): number => {
  switch (brokerageCalcMethod) {
    case 'ExFee':
      return (
        akf +
        calculateEffectiveRepay(
          loanAmount,
          loanAmount * (1 + brokerageRate) + fee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        )
      );
    case 'IncFee':
      return (
        akf +
        calculateEffectiveRepay(
          loanAmount,
          (loanAmount + fee) * (1 + brokerageRate),
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        )
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
      return akf + baseRepay + repayIncrease;
    }
    case 'Trains': {
      //Assume the base fee includes the 2.5c per $broker fee dollar so only need to calc net brokerage 2.5c
      const brokerageFee = (loanAmount + fee) * brokerageRate * 0.025;
      return (
        akf +
        calculateEffectiveRepay(
          loanAmount,
          (loanAmount + fee) * (1 + brokerageRate) + brokerageFee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod
        )
      );
    }
    case 'Advance': {
      return (
        akf +
        calculateEffectiveRepay(
          loanAmount,
          loanAmount * (1 + brokerageRate) + fee,
          interestRate,
          termLength,
          balloonRate,
          calcMethod,
          true
        )
      );
    }
    default:
      return 0;
  }
};

const calculateEffectiveRepay = (
  loanAmount: number,
  financedAmount: number,
  interestRate: number,
  termLength: number, // months (excludes balloon month)
  balloonRate: number,
  calcMethod: balloonCalcMethodValues,
  payInAdvance: boolean = false
): number => {
  if (loanAmount <= 0 || termLength <= 0) {
    return 0;
  }
  const balloonValue = (loanAmount * balloonRate) / 100;
  const r = interestRate / 100 / 12;

  if (r === 0) {
    // No interest → divide evenly, balloon at end
    return (financedAmount - balloonValue) / termLength;
  }

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
      break;
  }

  // Standard present value with balloon discounted
  let pmt = ((financedAmount - balloonValue / (1 + r) ** termLength) * r) / (1 - (1 + r) ** -n);

  // Adjust if payments are in advance (annuity due)
  if (payInAdvance) {
    pmt /= 1 + r;
  }

  return pmt;
};

export function findEffectiveRateBinaryBalloon(
  principal: number,
  fee: number,
  realMonthly: number,
  numMonths: number,
  balloonRate: number,
  balloonCalcMethod: balloonCalcMethodValues,
  tolerance = 0.01,
  maxIterations = 1000
) {
  if (principal <= 0 || realMonthly >= 0 || balloonRate < 0) {
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
export function findEffectiveInterestRate(
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
