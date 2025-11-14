'use client';

import { JSX, useContext } from 'react';
import {
  IconArrowDown,
  IconArrowDownRight,
  IconArrowUp,
  IconCalculator,
  IconEqual,
} from '@tabler/icons-react';
import { BarChart } from '@mantine/charts';
import { Box, Divider, Grid, GridCol, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_OptionsContext } from '../Context';

export default function Graph() {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const {
    ATO_monthlyRepayment,
    ATOFinalPayment,
    Loan_monthlyRepayment,
    taxRate,
    Loan_interestAmount,
    ATO_interestAmount,
    Loan_paymentTermLength,
    ATO_paymentTermLength,
    isMobile,
    amountOwed,
    loanDeposit,
  } = ctx;

  // split finance interest: raw vs. tax savings
  const financeTaxDeduction = Loan_interestAmount * taxRate;
  const financeNetInterest = Loan_interestAmount - financeTaxDeduction;

  // total effective cost
  const atoCost = ATO_interestAmount;
  const financeCost = financeNetInterest;

  // savings
  const monthlySavings = ATO_monthlyRepayment - Loan_monthlyRepayment;
  const netSavings = atoCost - financeCost;

  // decide what to show
  let title = '';
  let message: JSX.Element;
  let chartData: any[] = [];
  let chartSeries: any[] = [];

  if (Loan_monthlyRepayment < ATO_monthlyRepayment) {
    // Case 1: Monthly repayment cheaper
    title = 'Compare Your Monthly Repayment';
    message = (
      <Group gap="sm" align="center">
        <ThemeIcon color="teal" radius="xl" size="lg" variant="light">
          <IconArrowDownRight size={20} />
        </ThemeIcon>
        <Text fz={{ base: 'lg', md: 'xl' }} fw={700} c="teal">
          You'll pay $
          {monthlySavings.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}{' '}
          less per month*
        </Text>
        <Text size="xs" fw={500} c="black" ta="center" ml="md">
          * Monthly repayment comparison is shown only for an equivalent duration of the ATO plan.
        </Text>
      </Group>
    );

    chartData = [
      { source: 'ATO Payment Plan', value: ATO_monthlyRepayment },
      { source: 'Finance Plan', value: Loan_monthlyRepayment, color: 'teal.6' },
    ];

    chartSeries = [{ name: 'value', label: 'Monthly Repayment', color: 'blue.6' }];
  } else if (netSavings > 0) {
    // Case 2: Higher monthly repayment but cheaper overall
    title = 'Compare Your Interest Costs';
    message = (
      <Group gap="sm" align="center">
        <ThemeIcon color="teal" radius="xl" size="lg" variant="light">
          <IconCalculator size={20} />
        </ThemeIcon>
        <Text size="xl" fw={700} c="teal">
          You'll save $
          {netSavings.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}{' '}
          overall with finance
        </Text>
      </Group>
    );

    chartData = [
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
    ];

    chartSeries = [
      { name: 'ato', label: 'ATO Interest', color: 'blue.6' },
      { name: 'financeNet', label: 'Finance Net Interest', color: 'teal.6' },
      {
        name: 'financeDeduction',
        label: 'Tax Deduction Savings',
        color: 'url(#diagonalStripes)',
      },
    ];
  } else {
    // Case 3: No savings
    message = (
      <Text size="lg" fw={600} c="red">
        No savings with our finance options
      </Text>
    );

    chartData = [
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
    ];

    chartSeries = [
      { name: 'ato', label: 'ATO Interest', color: 'blue.6' },
      { name: 'financeNet', label: 'Finance Net Interest', color: 'teal.6' },
      {
        name: 'financeDeduction',
        label: 'Tax Deduction Savings',
        color: 'url(#diagonalStripes)',
      },
    ];
  }

  return (
    <Grid gutter="xl" align="stretch" mih={{ md: '50vh' }} mb="20px">
      {/* LEFT: Chart + savings */}
      <GridCol span={{ base: 12, md: 8 }}>
        <Stack gap="md" align="center">
          <JumboTitle
            order={isMobile ? 3 : 1}
            fz="xs"
            ta="center"
            style={{ textWrap: 'balance' }}
            c="black"
            fw={600}
          >
            {title}
          </JumboTitle>

          {message}

          <Box w="100%">
            <BarChart
              h={300}
              data={chartData}
              dataKey="source"
              type={chartSeries.length > 1 ? 'stacked' : 'default'}
              series={chartSeries}
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
          <Text size="md">
            <b style={{ color: 'blue' }}>ATO repayment:</b>
            <br /> An upfront deposit of $
            {(amountOwed * 0.05).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
            <br />
            <b>
              $
              {ATO_monthlyRepayment.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}{' '}
              for {ATO_paymentTermLength} months{' '}
            </b>
            {ATOFinalPayment > 0
              ? ` plus a final payment of $${ATOFinalPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`
              : ''}
          </Text>

          <Text size="md">
            <b style={{ color: 'green' }}>Finance repayment:</b> <br />
            {loanDeposit && (
              <>
                  An upfront deposit of $
                  {(amountOwed * 0.05).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                <br />
              </>
            )}{' '}
            <b>
              $
              {Loan_monthlyRepayment.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}{' '}
              for {Loan_paymentTermLength} months
            </b>
          </Text>
          <Divider />

          <Text size="md">
            <b>ATO GIC (non deductible):</b> $
            {ATO_interestAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text size="md">
            <b>Loan interest (deductible):</b> $
            {Loan_interestAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>
          <Divider label="Finance Tax deduction" />

          <Text size="sm">
            <b>Loan interest:</b> $
            {Loan_interestAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>

          <Text size="sm">
            <b>Tax rate:</b> {(taxRate * 100).toFixed(0)}%
          </Text>
          <Text size="sm">
            <b>Interest tax deduction:</b> $
            {financeTaxDeduction.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>
          <Divider />
          <Text size="md" c={financeNetInterest > ATO_interestAmount ? 'black' : 'black'}>
            <b>Finance cost after tax deduction:</b> $
            {financeNetInterest.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>
        </Stack>
      </GridCol>
    </Grid>
  );
}
