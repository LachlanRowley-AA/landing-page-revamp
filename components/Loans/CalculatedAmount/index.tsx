import { useContext } from 'react';
import { Divider, Grid, GridCol, Stack, Title } from '@mantine/core';
import { CalculatorContext } from '../Context';
import { Criteria, useCriteria } from '../Criteria/CriteriaHandler';

interface CalculatedAmountProps {
  calculatorIndex: number;
}
export default function CalculatedAmount({ calculatorIndex }: CalculatedAmountProps) {
  const ctx = useContext(CalculatorContext);
  const criteria = useCriteria();
  if (!criteria) {
    return;
  }
  if (!ctx) {
    return;
  }
  const calculator = criteria[calculatorIndex];

  const { effectiveLoanMonthlyRepayment, effectiveLoanInterestRate } = ctx;

  //Highlight repayment
  //Please compare by repayment

  return (
    <Stack>
      <Title order={2} c="dark">
        Effective Interest Rate
      </Title>
      <Title ta={{base: 'center', md: 'left'}}>
        {effectiveLoanInterestRate.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
        %
      </Title>
      <Divider size="xl" c="black" />
      <Title order={2} ta="center" c="dark">
        Loan Repayment (monthly)
      </Title>
      <Title ta={{base: 'center', md: 'left'}}>
        $
        {effectiveLoanMonthlyRepayment.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </Title>
    </Stack>
  );
}
