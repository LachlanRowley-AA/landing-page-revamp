'use client';

import { AnimatedCounter, AnimatedCounterProps } from './AnimatedCounter';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { Box, BoxProps, Container, Grid, Stack, Text, rem, TextInput, Slider, Group, useMantineTheme, Switch, SegmentedControl } from '@mantine/core';
import { motion } from 'motion/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';


const DEFAULT_INTEREST_RATE = 16.95; // 16.95% annual interest
const DAYS_IN_YEAR = 365;
const WEEKS_IN_YEAR = 52;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 365 / 12; // Average days per month
const LOAN_TERM_YEARS = 5;


const calculateRepayment = (loanAmount: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0) {return 0};

  const annualRate = interestRate / 100;
  const totalPayments = isWeekly ? LOAN_TERM_YEARS * WEEKS_IN_YEAR : LOAN_TERM_YEARS * MONTHS_IN_YEAR;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;

  // Effective period rate with daily compounding
  const effectivePeriodRate = (1 + dailyRate)**daysBetweenPayments - 1;

  return (
    loanAmount *
    ((effectivePeriodRate * (1 + effectivePeriodRate)**totalPayments) /
      ((1 + effectivePeriodRate)**totalPayments - 1))
  );
};

const calculateCustomRepayment = (loanAmount: number, interestRate: number, months: number) => {
  if (loanAmount <= 0) return 0;

  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;
  
  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (
    loanAmount *
    ((monthlyRate * (1 + monthlyRate)**months) /
      ((1 + monthlyRate)**months - 1))
  );
};

const calculateRemainingPrincipal = (loanAmount: number, periodsElapsed: number, interestRate: number, isWeekly: boolean) => {
  if (loanAmount <= 0 || periodsElapsed <= 0) return loanAmount;

  const annualRate = interestRate / 100;
  const dailyRate = annualRate / DAYS_IN_YEAR;
  const daysBetweenPayments = isWeekly ? DAYS_IN_WEEK : DAYS_IN_MONTH;
  const effectivePeriodRate = (1 + dailyRate)**daysBetweenPayments - 1;

  const periodRepayment = calculateRepayment(loanAmount, interestRate, isWeekly);

  const remainingBalance =
    loanAmount * (1 + effectivePeriodRate)**periodsElapsed -
    periodRepayment * (((1 + effectivePeriodRate)**periodsElapsed - 1) / effectivePeriodRate);

  return Math.max(0, remainingBalance);
};

const calculateInterestCost = (loanAmount: number, periodsElapsed: number, interestRate: number, isWeekly: boolean) => {
  const totalPaid = calculateRepayment(loanAmount, interestRate, isWeekly) * periodsElapsed;
  const principalPaid = loanAmount - calculateRemainingPrincipal(loanAmount, periodsElapsed, interestRate, isWeekly);
  return Math.max(0, totalPaid - principalPaid);
};


const StatCell = ({
    startValue,
    endValue,
    title,
    description,
    ...boxProps
  }: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; description: string }) => (
    <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Box {...boxProps}>
        <AnimatedCounter ta="center" fz={rem(50)} fw="bold" c={{base: "01E194",md:"#01E194"}} endValue={Math.max(0, endValue)} prefix="$" startValue={Math.max(0, startValue)}  />
        <Text fz="lg" inline ta="center" c={{base: "01E194",md:"black"}}>
          {description}
        </Text>
      </Box>
    </motion.div>
  );

  const PayoutCell = ({
    startValue,
    endValue,
    title,
    description,
    payoutStartValue,
    payoutEndValue,
    payout,
    ...boxProps
  }: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; 
    description: string; payout: string; payoutStartValue: AnimatedCounterProps['startValue']; payoutEndValue: AnimatedCounterProps['endValue'] }) => (
    <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Box {...boxProps}
        style={{
            radius: '1rem',
            borderRadius: '1rem',
            padding: '0px'
        }}
      >
        <AnimatedCounter c="black" ta="center" fz={rem(32)} fw="bold" endValue={Math.max(0, endValue)} prefix="$" startValue={Math.max(0, startValue)} />
        <Group justify="center" gap={5}>
          <Text c="#01E194" fz="lg">
            How Much Interest You'll Pay if Paid Out in:
          </Text>
          <Text fz="lg" c="black" fw="500">
            {description}
          </Text>
        </Group>
      </Box>
    </motion.div>
  );

const CustomStatCell = ({
    startValue,
    endValue,
    title,
    description,
    ...boxProps
  }: BoxProps & { startValue: AnimatedCounterProps['startValue']; endValue: AnimatedCounterProps['endValue']; title: string; description: string }) => (
    <motion.div
      initial={{ opacity: 0.0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Box {...boxProps} p="md" style={{ border: '2px solid #01E194', borderRadius: '12px' }}>
        <Text fz="lg" ta="center" c="black" fw="600" mb="xs">
          {title}
        </Text>
        <AnimatedCounter ta="center" fz={rem(36)} fw="bold" c="#01E194" endValue={Math.max(0, endValue)} prefix="$" startValue={Math.max(0, startValue)}  />
        <Text fz="sm" ta="center" c="dimmed" mt="xs">
          {description}
        </Text>
      </Box>
    </motion.div>
  );



type CalculatorProps = {
  startingAmount?: number;
}
export const Calculator = ({
  startingAmount = 20000
}: CalculatorProps) => {
  const [baseValue, setBaseValue] = useState(startingAmount ? startingAmount : 10000);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [isWeekly, setIsWeekly] = useState(false);
  const [customTimeframe, setCustomTimeframe] = useState('12');
  
  const repayment = calculateRepayment(baseValue, interestRate, isWeekly);
  const customRepayment = calculateCustomRepayment(baseValue, interestRate, parseInt(customTimeframe));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <Grid
      gutter={isMobile ? 'sm' : 'md'}
      my={0}
      mx={0}
      px='0px'
      style={{ 
        marginTop: '0px', 
        paddingTop: '0px',
        minHeight: '100%',
        height: 'auto'
      }}
      overflow='hidden'
      bg="white"
    >
      {/* First Column - Original Calculator */}
      <Grid.Col span={isMobile ? 12 : 12} bg="white" pt={isMobile ? 'xs' : 'md'} px={isMobile ? 'xs' : 'md'} pb={isMobile ? 'md' : 'xs'} style={{ minHeight: '100%' }}>
        <Stack align="center" gap={0} my={isMobile ? 'md' : 'xl'}>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <span>
              <JumboTitle order={1} ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "black",md:"#01E194"}}>
                Calculate your estimated
              </JumboTitle>
              <JumboTitle order={1} fz="md" ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "#01E194",md:"#01E194"}}>
                {isWeekly ? 'weekly' : 'monthly'} repayment
              </JumboTitle>
            </span>
            <Grid align="center" visibleFrom='lg'>
              <Grid.Col span={12}>
                <span>
                  <JumboTitle order={1} ta="center" style={{ textWrap: 'balance' }} c={{base: "black",md:"black"}} fw={600}>
                    Calculate your estimated
                  </JumboTitle>
                  <JumboTitle order={1} fz="xs" ta="center" style={{ textWrap: 'balance' }} c={{base: "01E194",md:"#01E194"}} fw={600}>
                    {isWeekly ? 'weekly' : 'monthly'} repayment
                  </JumboTitle>
                </span>
            </Grid.Col>
          </Grid>
          </motion.div>
        </Stack>
        
        <Container size="lg" mt="md" ta="center" pt={isMobile ? 0 : 'xs'} px={isMobile ? 0 : 'md'} pb={isMobile ? 'md' : 'xs'} style={{ height: '100%' }}>
          <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Stack gap={isMobile ? 'sm' : 'xs'}>
              <TextInput
                label="Loan Amount"
                type="text"
                value={baseValue.toLocaleString()}
                onChange={(event) => {
                  const rawValue = event.currentTarget.value.replace(/,/g, ''); // remove commas
                  const numericValue = Math.max(0, Number(rawValue));
                  setBaseValue(numericValue);
                }}
                variant="unstyled"
                leftSection="$"
                size='xl'
                styles={{
                  input: { fontSize: isMobile ? rem(28) : rem(40), color: 'black'},
                  label: { fontSize: isMobile ? rem(28) : rem(40), color: 'black'},
                  section:  { fontSize: isMobile ? rem(28) : rem(40), color: 'black'} 
                }}
                ta="center"
                c={{base: "white", md:"#01E194"}}
              />
              <Slider
                label="Loan Amount"
                min={10000}
                max={500000}
                step={1000}
                value={baseValue}
                onChange={(value) => setBaseValue(Math.max(0, value))}
                c={{base: "white",md:"#01E194"}}
                mx={isMobile ? 'xs' : 0}
                size="xl"
                styles={{
                  markLabel: {
                    color: "orange"
                  }
                }}
              />
              </Stack>
          </motion.div>
        </Container>
      </Grid.Col>

      {/* Second Column - Custom Timeframe Calculator */}
      <Grid.Col span={isMobile ? 12 : 12} bg="white" px={isMobile ? 'xs' : 'md'} pb={isMobile ? 'md' : 'xl'} style={{ minHeight: '100%' }}>
        <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <JumboTitle order={1} fz={isMobile ? "md" : "xs"} ta="center" style={{ textWrap: 'balance' }} c="black" fw={600}>
              Pay off your loan in
            </JumboTitle>
            <JumboTitle order={1} fz={isMobile ? "md" : "xs"} ta="center" style={{ textWrap: 'balance' }} c="#01E194" fw={600}>
              {customTimeframe} months
            </JumboTitle>
          </motion.div>
        </Stack>
        
        <Container size="lg" mt="md" ta="center" pt={isMobile ? 0 : 'md'} px={isMobile ? 0 : 'md'} pb={isMobile ? 'md' : 'xl'} style={{ height: '100%' }}>
          <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Stack gap={isMobile ? 'md' : 'xl'}>
              <SegmentedControl
                value={customTimeframe}
                onChange={setCustomTimeframe}
                data={[
                  { label: '6 months', value: '6' },
                  { label: '12 months', value: '12' },
                  { label: '24 months', value: '24' },
                  { label: '36 months', value: '36' },
                ]}
                size="md"
                styles={{
                  root: {
                    backgroundColor: '#f8f9fa',
                  },
                  control: {
                    '&[data-active]': {
                      backgroundColor: '#01E194',
                      color: 'white',
                    },
                  },
                }}
              />
              
              <CustomStatCell 
                startValue={repayment} 
                endValue={customRepayment} 
                title={`Monthly Payment`}
                description={`To pay off in ${customTimeframe} months`} 
              />
            </Stack>
          </motion.div>
        </Container>
      </Grid.Col>
    </Grid>
  );
};