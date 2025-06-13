'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import { Badge, Box, BoxProps, Container, Grid, Stack, Text, rem, Group, useMantineTheme, Card, Divider } from '@mantine/core';
import { motion } from 'motion/react';
import { useMediaQuery } from '@mantine/hooks';

const DEFAULT_INTEREST_RATE = 15.95; // 15.95% annual interest
const DAYS_IN_YEAR = 365;
const WEEKS_IN_YEAR = 52;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 365 / 12; // Average days per month
const LOAN_TERM_YEARS = 5;
const EXAMPLE_AMOUNT = 30000;

const calculateRepayment = (loanAmount: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0) return 0;

  const annualRate = interestRate / 100;
  const totalPayments = isWeekly ? LOAN_TERM_YEARS * WEEKS_IN_YEAR : LOAN_TERM_YEARS * MONTHS_IN_YEAR;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;

  // Effective period rate with daily compounding
  const effectivePeriodRate = (1 + dailyRate) ** daysBetweenPayments - 1;

  return (
    loanAmount *
    ((effectivePeriodRate * (1 + effectivePeriodRate) ** totalPayments) /
      ((1 + effectivePeriodRate) ** totalPayments - 1))
  );
};

const calculateTotalInterest = (loanAmount: number, interestRate: number, isWeekly: boolean) => {
  const totalPayments = isWeekly ? LOAN_TERM_YEARS * WEEKS_IN_YEAR : LOAN_TERM_YEARS * MONTHS_IN_YEAR;
  const repayment = calculateRepayment(loanAmount, interestRate, isWeekly);
  return (repayment * totalPayments) - loanAmount;
};

const ExampleCard = ({ 
  title, 
  amount, 
  period, 
  highlight = false 
}: { 
  title: string; 
  amount: string; 
  period?: string; 
  highlight?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0.0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeInOut' }}
    viewport={{ once: true }}
  >
    <Card 
      padding="md" 
      radius="md" 
      bg={highlight ? "rgba(1, 225, 148, 0.1)" : "rgba(255, 255, 255, 0.05)"}
      style={{ 
        border: highlight ? "2px solid #01E194" : "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Stack align="center" gap="xs">
        <Text size="sm" c="rgba(255, 255, 255, 0.7)" ta="center" fw={500}>
          {title}
        </Text>
        <Text fz={{base: rem(24), md: rem(36)}} fw="bold" c={highlight ? "#01E194" : "white"} ta="center">
          {amount}
        </Text>
        {period && (
          <Text size="xs" c="rgba(255, 255, 255, 0.6)" ta="center">
            {period}
          </Text>
        )}
      </Stack>
    </Card>
  </motion.div>
);

const CalculationBreakdown = () => {
  const weeklyRepayment = calculateRepayment(EXAMPLE_AMOUNT, DEFAULT_INTEREST_RATE, true);
  const monthlyRepayment = calculateRepayment(EXAMPLE_AMOUNT, DEFAULT_INTEREST_RATE, false);
  const totalInterestWeekly = calculateTotalInterest(EXAMPLE_AMOUNT, DEFAULT_INTEREST_RATE, true);
  const totalInterestMonthly = calculateTotalInterest(EXAMPLE_AMOUNT, DEFAULT_INTEREST_RATE, false);

  return (
    <Container size="sm" p={0}>
      <Stack gap="lg">
        <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          <Box ta="center" mb="xl">
            <Badge 
              size="lg" 
              variant="light" 
              color="rgba(1, 225, 148, 0.2)"
              c="#01E194"
              fw={500}
              mb="md"
            >
              Loan Example
            </Badge>
            <Text size="md" c="rgba(255, 255, 255, 0.7)" mb="xs">
              Here's what your repayments would look like for a
            </Text>
            <Text size={rem(36)} fw="bold" c="white">
              ${EXAMPLE_AMOUNT.toLocaleString()} loan
            </Text>
            <Text size="xs" c="rgba(255, 255, 255, 0.6)" mt="xs">
              Paid off in 3 months
            </Text>
          </Box>
        </motion.div>

        <Grid gutter="md">
          <Grid.Col span={6}>
            <ExampleCard 
              title="Weekly Repayment"
              amount={`$${weeklyRepayment.toFixed(2)}`}
              period=""
              highlight={true}
            />
          </Grid.Col>
          {/* <Grid.Col span={6}>
            <ExampleCard 
              title="Monthly Repayment"
              amount={`$${monthlyRepayment.toFixed(2)}`}
              period="12 payments per year"
            />
          </Grid.Col> */}
          <Grid.Col span={6}>
            <ExampleCard 
              title="Total Charges (incl. interest)"
              amount="$1,176.26"
              period=""
            />
          </Grid.Col>

        </Grid>

        <Divider color="rgba(255, 255, 255, 0.1)" />

          {/* <Grid.Col span={6}>
            <ExampleCard 
              title="Total Interest (Monthly)"
              amount={`$${totalInterestMonthly.toFixed(2)}`}
              period="Over full loan term"
            />
          </Grid.Col> */}

        {/* <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
        >
          <Card 
            padding="lg" 
            radius="md" 
            bg="rgba(1, 225, 148, 0.05)"
            style={{ 
              border: "1px solid rgba(1, 225, 148, 0.2)",
            }}
          >
            <Group justify="space-between" align="center">
              <Stack gap="xs">
                <Text size="sm" c="#01E194" fw={600}>
                  💡 Why Weekly Payments?
                </Text>
                <Text size="xs" c="rgba(255, 255, 255, 0.8)">
                  Weekly payments can save you ${(totalInterestMonthly - totalInterestWeekly).toFixed(2)} in interest over the loan term
                </Text>
              </Stack>
            </Group>
          </Card>
        </motion.div> */}
      </Stack>
    </Container>
  );
};

export const Calculator = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  return (
    <Box
      bg="black"
      py="xl"
      px={{ base: "xs", md: "xl" }}
      style={{ minHeight: "80vh" }}
    >
      <Container size="lg" ta="center">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          <Stack align="center" gap="lg" mb="xl">
            <JumboTitle 
              order={2} 
              fz="md"
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="#01E194"
              fw={700}
            >
              Example
            </JumboTitle>
            <JumboTitle 
              order={2} 
              fz="md"
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="white"
              fw={700}
            >
              Loan Repayment
            </JumboTitle>
          </Stack>
        </motion.div>
        
        <CalculationBreakdown />
      </Container>
    </Box>
  );
};