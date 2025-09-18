'use client';

import { useContext } from 'react';
import {
  Card,
  Divider,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { CalculatorContext } from '../Context';
import { useCriteria } from '../Criteria/CriteriaHandler';

interface CalculatedAmountProps {
  calculatorIndex: number;
}

export default function CalculatedAmount({ calculatorIndex }: CalculatedAmountProps) {
  const ctx = useContext(CalculatorContext);
  const criteria = useCriteria();
  const theme = useMantineTheme();

  if (!criteria || !ctx) {
    return null;
  }

  const { effectiveLoanMonthlyRepayment, effectiveLoanInterestRate } = ctx;

  return (
    <Card
      shadow="lg"
      radius="lg"
      withBorder
      p="xl"
      style={{ backgroundColor: theme.white, borderColor: '#01E194' }}
    >
      <Stack gap="xl" align="center">
        {/* Interest Rate Section */}
        <Stack gap={6} align="center">
          <Text size="lg" fw={600} c="dimmed">
            Effective Interest Rate
          </Text>
          <Title
            order={1}
            size="3rem"
            c={theme.colors.blue[7]}
            style={{ lineHeight: 1.1 }}
          >
            {effectiveLoanInterestRate.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
            %
          </Title>
        </Stack>

        <Divider size="lg" w="60%" />

        {/* Repayment Section */}
        <Stack gap={6} align="center">
          <Text size="lg" fw={600} c="dimmed">
            Monthly Repayment
          </Text>
          <Title
            order={1}
            size="3rem"
            c={theme.colors.green[7]}
            style={{ lineHeight: 1.1 }}
          >
            $
            {effectiveLoanMonthlyRepayment.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Title>
        </Stack>
      </Stack>
    </Card>
  );
}
