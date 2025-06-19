'use client';

import { AnimatedCounter, AnimatedCounterProps } from './AnimatedCounter';
import { JumboTitle } from '../JumboTitle/JumboTitle';
import { Box, BoxProps, Container, Grid, Stack, Text, rem, TextInput, Slider, Group, useMantineTheme, Switch } from '@mantine/core';
import { m, motion } from 'motion/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { useMediaQuery } from '@mantine/hooks';


const DEFAULT_INTEREST_RATE = 15.95; // 15.95% annual interest
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


const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

const LineChart = ({ loanAmount, interestRate, isWeekly }: { loanAmount: number, interestRate: number, isWeekly: boolean }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  // Convert periods to appropriate time units
  const periodMultiplier = isWeekly ? 4.33 : 1; // Approximate weeks per month
  const periods = isWeekly ? 
    [13, 17.3, 21.6, 26] : // weeks
    [1, 2, 3, 4]; // months

  const interestCosts = periods.map(period => 
    calculateInterestCost(loanAmount, period, interestRate, isWeekly).toFixed(2)
  );

  const data = {
    labels: ['30 days', '60 days', '90 days', '120 days'],
    datasets: [
      {
        label: 'Total Interest Cost',
        data: interestCosts,
        backgroundColor: [
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
          'rgba(1, 255, 148, 0.8)',
          'rgba(1, 255, 148, 0.4)',
        ],
        borderColor: [
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
          'rgba(1, 255, 148, 1)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options= {
    barPercentage: 1.1,
    categoryPercenage: 1.0,
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: 'y' as const,
    borderRadius: 10,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: { 
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
          font: {
            size: isMobile ? 20 : 24,
            weight: "bold"
          },
        }
      } as const
    },
    plugins: {
      datalabels: {
        color: 'black',
        formatter(value : number, context: Context) {
          return `$${  Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        },
        font: {
          size: isMobile ? 18 : 18
        }
      },
      legend: {
        display: false,
      },
    }
  };

  return (
    <>
      <style>
        {`
          .chart-container {
            width: 100%;
            background-color: white;
            padding: 0;
            height: auto;
          }
  
          @media (max-width: 768px) {
            .chart-container {
              padding: 0 0px;
            }
          }
          
          .chart-wrapper {
            width: 100%;
            height: 300px;
          }
          
          @media (max-width: 768px) {
            .chart-wrapper {
              height: 250px;
            }
          }
        `}
      </style>
      <div className="chart-container">
        <motion.div
          initial={{ opacity: 0.0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <JumboTitle ta="center" fz="xs" order={1} fw="bold" c="#01E194" mt={isMobile ? "md" : "xl"} pt={0} mb="md">
            How Much Interest You'll Pay if Paid Out in:
          </JumboTitle>
          <JumboTitle ta="center" fz="xxs" order={3} fw="bold" c="#01E194" mt={isMobile ? "md" : "md"} pt={0} mb="md">
            (inclusive of already paid interest):
          </JumboTitle>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="chart-wrapper"
        >
          <Bar data={data} plugins={[ChartDataLabels]} options={options} />
        </motion.div>
      </div>
    </>
  );
};


export const Calculator = () => {
  const [baseValue, setBaseValue] = useState(10000);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [isWeekly, setIsWeekly] = useState(false);
  
  const repayment = calculateRepayment(baseValue, interestRate, isWeekly);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  return (
    <Grid
      gutter={isMobile ? 'sm' : 'xl'}
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
      <Grid.Col span={12} bg="white" pt={isMobile ? 'xs' : 'md'} px={isMobile ? 'xs' : 'md'} pb={isMobile ? 'md' : 'xl'} style={{ minHeight: '100%' }}>
        <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <span>
              <JumboTitle order={3} fz="md" ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "black",md:"#01E194"}}>
                Calculate your estimated
              </JumboTitle>
              <JumboTitle order={3} fz="md" ta="center" style={{ textWrap: 'balance' }} hiddenFrom='lg' c={{base: "#01E194",md:"#01E194"}}>
                {isWeekly ? 'weekly' : 'monthly'} repayment
              </JumboTitle>
            </span>
            <Grid align="center" visibleFrom='lg' gutter="xl">
              <Grid.Col span={12}>
                <span>
                  <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} c={{base: "black",md:"black"}} fw={600}>
                    Calculate your
                  </JumboTitle>
                  <JumboTitle order={3} fz="xs" ta="center" style={{ textWrap: 'balance' }} c={{base: "01E194",md:"#01E194"}} fw={600}>
                    {isWeekly ? 'weekly' : 'monthly'} repayment
                  </JumboTitle>
                </span>
            </Grid.Col>
          </Grid>
          </motion.div>
        </Stack>
        
        <Container size="lg" mt="md" ta="center" pt={isMobile ? 0 : 'md'} px={isMobile ? 0 : 'md'} pb={isMobile ? 'md' : 'xl'} style={{ height: '100%' }}>
          <motion.div initial={{ opacity: 0.0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Stack gap={isMobile ? 'sm' : 'md'}>
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
                max={200000}
                step={1000}
                value={baseValue}
                onChange={(value) => setBaseValue(Math.max(0, value))}
                c={{base: "white",md:"#01E194"}}
                mx={isMobile ? 'xs' : 0}
              />              
              </Stack>
          </motion.div>
          
          <Grid gutter={isMobile ? 'md' : 'calc(var(--mantine-spacing-lg) * 4)'} align="center" px={0} mt={isMobile ? 'md' : 'xl'}>
            <Grid.Col span={12} mx={0} px={0}>
              <StatCell 
                startValue={baseValue} 
                endValue={repayment} 
                title={isWeekly ? "Weekly Repayment" : "Monthly Repayment"} 
                description={isWeekly ? "Weekly repayment" : "Monthly repayment"} 
              />
            </Grid.Col>
          </Grid>
          
          <Box mt={isMobile ? 'md' : 'xl'} pb={isMobile ? 'md' : 'xl'}>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >  
              {/* <JumboTitle ta="center" fz="xs" order={1}  fw="bold" c="#01E194" mt="xl" mb="xl" pt="xl">
                Payout Options
              </JumboTitle> */}
              {/* <JumboTitle ta="center" fz="xxs" order={3}  fw="bold" c="#01E194" mt="xl" mb="xl" textWrap='balance'>
                Save money with no penalties for early payout 
              </JumboTitle>
              */}
              </motion.div>
            <Grid gutter={isMobile ? 'sm' : 'calc(var(--mantine-spacing-lg) * 1)'} align="center">
              <Grid.Col span={12}>
                <LineChart loanAmount={baseValue} interestRate={interestRate} isWeekly={isWeekly}/>
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Grid.Col>
    </Grid>
  );
};