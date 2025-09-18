'use client';

import { useContext, useEffect, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import {
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  Stack,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import BalloonSlider from './BalloonSlider';
import CalculatedAmount from './CalculatedAmount';
import { CalculatorContext } from './Context';
import CriteriaDisplay from './Criteria/CriteriaDisplay';
import { CriteriaHandler, useCriteria } from './Criteria/CriteriaHandler';
import { useDisplay } from './DisplayContext';
import PrivateSaleSlider from './PrivateSaleSlider';
import LoanSlider from './Slider';
import TermSlider from './TermSlider';
import VehicleAgeMenu from './VehicleAgeMenu';

interface LoanProps {
  calculatorIndex: number;
}

export function Loans({ calculatorIndex }: LoanProps) {
  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;
  const calcCtx = useContext(CalculatorContext);
  const [showCalc, setShowCalc] = useState(false);

  if (!calcCtx) {
    return null;
  }

  const Header = (
    <Stack gap="xs" align="center" mb="md">
      <Image src="/Default/logo_black.png" maw={{ base: '30vw', md: '10vw' }} alt="Logo" />
      <JumboTitle order={isMobile ? 3 : 2} ta="center" fw={700} style={{ textWrap: 'balance' }}>
        Vehicle Finance Calculator
      </JumboTitle>
    </Stack>
  );
  const [showInput, setShowInput] = useState(true);

  // Inner component to safely use useCriteria inside CriteriaHandler
  const [mounted, setMounted] = useState(false);
  const CriteriaConsumer = () => {
    const criteria = useCriteria();
    if (!criteria) {
      return null;
    }

    const calculator = criteria[calculatorIndex];
    const {
      setLoanInterestRate,
      setLoanPaymentTermLength,
      setBaseFee,
      setPrivateSaleFee,
      setDepositRate,
      setBalloonCalcMethod,
      setBrokerageCalcMethod,
      setVehicleAgeInterestUplift,
    } = calcCtx;
    useEffect(() => {
      if (mounted) {
        return;
      }
      setLoanInterestRate(calculator.Rate);
      setLoanPaymentTermLength(60);
      setBaseFee(calculator.FinanceFee);
      setPrivateSaleFee(calculator.PrivateSaleFee);
      setDepositRate(calculator.MinDeposit);
      setBalloonCalcMethod(calculator.BalloonCalcMethod);
      setBrokerageCalcMethod(calculator.BrokerageCalcMethod);
      setVehicleAgeInterestUplift(calculator.VehicleAgeImpact.InterestUplift);
      console.log('base fee:', calculator.FinanceFee);

      setMounted(true);
    }, [calculator.Rate, setLoanInterestRate]);
  };

  const input = (
    <Stack gap="xs">
      <CriteriaDisplay index={calculatorIndex} />
      <Divider />
      <Grid>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <PrivateSaleSlider index={calculatorIndex} />
            <Grid gutter="md">
              <GridCol span={{ base: 12, md: 6 }}>
                <LoanSlider index={calculatorIndex} />
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <BalloonSlider index={calculatorIndex} />
              </GridCol>
            </Grid>
            <VehicleAgeMenu index={calculatorIndex} />

            <TermSlider />
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Center h="100%">
            {showCalc ? (
              <div>
                <Divider hiddenFrom="md" size="xl" mt="xl" mb="md" />
                <CalculatedAmount calculatorIndex={calculatorIndex} />
              </div>
            ) : (
              <Button
                visibleFrom="md"
                radius="xl"
                rightSection={<IconChevronRight size={18} />}
                onClick={() => setShowCalc(true)}
                size="xl"
              >
                Calculate
              </Button>
            )}
          </Center>
        </GridCol>
      </Grid>
      <Divider my="sm" />
      <Group justify="flex-end" mt="md">
        <Button
          radius="xl"
          rightSection={<IconChevronRight size={18} />}
          onClick={() => setShowCalc(true)}
        >
          Calculate
        </Button>
      </Group>
    </Stack>
  );

  return (
    <CriteriaHandler>
      <Container size="lg" py={{ base: 'sm', md: 'xl' }} px="xs">
        <Card
          shadow="md"
          radius="xl"
          withBorder
          p={{ base: 'md', md: 'xl' }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {Header}
          <Divider my="xs" />
          <CriteriaConsumer />
          {input}
        </Card>
      </Container>
    </CriteriaHandler>
  );
}

export default Loans;
