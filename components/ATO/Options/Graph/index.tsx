'use client';

import { useContext } from 'react';
import { BarChart } from '@mantine/charts';
import {
  Stack,
  Text,
  Title,
  Box,
  Group,
  ThemeIcon,
  Grid,
  GridCol,
  Divider,
} from '@mantine/core';
import { IconArrowDownRight, IconCalculator } from '@tabler/icons-react';
import { ATO_OptionsContext } from '../Context';

export default function Graph() {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const { ATO_interestAmount, Loan_interestAmount, taxRate } = ctx;



  // split finance interest: raw vs. tax savings
  const financeTaxDeduction = Loan_interestAmount * taxRate;
  const financeNetInterest = Loan_interestAmount - financeTaxDeduction;

  // total effective cost
  const atoCost = ATO_interestAmount;
  const financeCost = financeNetInterest;

  // savings
  const savings = atoCost - financeCost;

  return (
    <Grid gutter="xl" align="stretch">
      {/* LEFT: Chart + savings */}
      <GridCol span={{ base: 12, md: 8 }}>
        <Stack gap="md" align="center">
          <Title order={3} ta="center">
            Compare Your Interest Costs
          </Title>

          {savings > 0 ? (
            <Group gap="sm" align="center">
              <ThemeIcon color="teal" radius="xl" size="lg" variant="light">
                <IconArrowDownRight size={20} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="teal">
                You save ${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
            </Group>
          ) : (
            <Text size="lg" fw={600} c="red">
              No savings with finance option
            </Text>
          )}

          <Box w="100%">
            <BarChart
              h={300}
              data={[
                {
                  source: 'ATO Payment Plan',
                  ato: ATO_interestAmount,
                  financeNet: 0,
                  financeDeduction: 0,
                },
                {
                  source: 'Finance Plan',
                  ato: 0,
                  financeNet: financeNetInterest,
                  financeDeduction: financeTaxDeduction,
                },
              ]}
              dataKey="source"
              type="stacked"
              series={[
                { name: 'ato', label: 'ATO Interest', color: 'blue.6' },
                { name: 'financeNet', label: 'Finance Net Interest', color: 'teal.6' },
                {
                  name: 'financeDeduction',
                  label: 'Tax Deduction Savings',
                  color: 'url(#diagonalStripes)',
                },
              ]}
              tickLine="y"
              withTooltip={false}
            >
              <defs>
                <pattern
                  id="diagonalStripes"
                  patternUnits="userSpaceOnUse"
                  width={6}
                  height={8}
                  patternTransform="rotate(45)"
                >
                  <rect
                    width="2"
                    height="8"
                    transform="translate(0,0)"
                    fill="color-mix(in lch, var(--mantine-color-teal-6) 70%, rgba(0,0,0,0))"
                  />
                </pattern>
              </defs>
            </BarChart>
          </Box>
        </Stack>
      </GridCol>

      {/* RIGHT: Sidebar explanation */}
      <GridCol span={{ base: 12, md: 4 }}>
        <Stack gap="sm">

          <Text size="sm">
            <b>Tax rate:</b> {(taxRate * 100).toFixed(0)}%
          </Text>
          <Text size="sm">
            <b>Loan interest (before tax):</b>{' '}
            ${Loan_interestAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text size="sm">
            <b>Tax deduction:</b>{' '}
            ${financeTaxDeduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text size="sm">
            <b>Net finance cost:</b>{' '}
            ${financeNetInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>

          <Divider />

          <Text size="sm">
            <b>ATO interest:</b>{' '}
            ${ATO_interestAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text size="sm" fw={700} c="teal">
            <b>Savings:</b>{' '}
            ${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </Stack>
      </GridCol>
    </Grid>
  );
}
