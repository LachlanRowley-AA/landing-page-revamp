'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconChevronRight } from '@tabler/icons-react';
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
  Loader,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useDisplay } from './DisplayContext';
import { CalculatorContext } from './Context';

import CriteriaDisplay from './Criteria/CriteriaDisplay';
import PrivateSaleSlider from './PrivateSaleSlider';
import LoanSlider from './Slider';
import TermSlider from './TermSlider';
import BalloonSlider from './BalloonSlider';
import VehicleAgeMenu from './VehicleAgeMenu';
import CalculatedAmount from './CalculatedAmount';

interface LoanProps {
  calculatorIndex: number;
}

export function Loans({ calculatorIndex }: LoanProps) {
  const router = useRouter();
  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;
  const calcCtx = useContext(CalculatorContext);

  const [calculator, setCalculator] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);

  // Fetch calculator data from your API route
  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        const res = await fetch(`/api/getlenders/${calculatorIndex}`);
        console.log('API response status:', res.status);
        const json = await res.json();
        console.log('Fetched calculator data:', json);

        if (!res.ok) throw new Error(json.error || 'Failed to fetch lender');
        setCalculator(json.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculator();
  }, [calculatorIndex]);

  // Initialize calculator context once the API data arrives
  useEffect(() => {
    if (!calculator || !calcCtx) return;

    calcCtx.setLoanInterestRate(calculator.rate);
    calcCtx.setLoanPaymentTermLength(60);
    calcCtx.setBaseFee(calculator.finance_fee);
    calcCtx.setPrivateSaleFee(calculator.private_sale_fee);
    calcCtx.setBalloonCalcMethod(calculator.balloon_calc_method);
    calcCtx.setBrokerageCalcMethod(calculator.brokerage_calc_method);
    calcCtx.setVehicleAgeInterestUplift(calculator.vehicle_age_impact?.interest_uplift || 0);
    calcCtx.setAKF(calculator.akf);
    console.log('Initialized calculator context with fetched data:', calculator.finance_fee);

  }, [calculator, calcCtx]);

  if (loading) {
    return (
      <Center h="70vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !calculator) {
    return (
      <Center h="70vh">
        <Text c="red">{error || 'Unable to load calculator data'}</Text>
      </Center>
    );
  }

  const Header = (
    <Grid align="center" mb="md">
      <Grid.Col span="auto">
        <Button
          variant="light"
          radius="xl"
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => router.push('/calculators/vehicles')}
        >
          Back to Vehicles
        </Button>
      </Grid.Col>

      <Grid.Col span="content">
        <Image
          src="/Default/logo_black.png"
          maw={{ base: '30vw', md: '10vw' }}
          alt="Logo"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </Grid.Col>

      <Grid.Col span="auto" />
    </Grid>
  );

  return (
    <Container size="lg" py={{ base: 'sm', md: 'xs' }} px="xs">
      <Card
        shadow="md"
        radius="xl"
        withBorder
        p={{ base: 'md', md: 'xl' }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {Header}
        <Divider my="xs" />

        <Stack gap="xs">
          <Paper
            p="md"
            radius="xl"
            style={{ border: '1px solid rgba(1, 225, 148, 0.2)' }}
            shadow="xs"
          >
            <CriteriaDisplay index={calculatorIndex} />
          </Paper>

          <Grid>
            <GridCol span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <Grid gutter="xl">
                  <GridCol span={6}>
                    <PrivateSaleSlider index={calculatorIndex} />
                  </GridCol>
                  <GridCol span={6}>
                    <VehicleAgeMenu index={calculatorIndex} />
                  </GridCol>
                </Grid>
                <Divider />
                <LoanSlider index={calculatorIndex} />
                <Divider />
                <Grid gutter="md">
                  <GridCol span={{ base: 12, md: 6 }}>
                    <TermSlider />
                  </GridCol>
                  <GridCol span={{ base: 12, md: 6 }}>
                    <BalloonSlider index={calculatorIndex} />
                  </GridCol>
                </Grid>
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 5 }}>
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
              Speak to a specialist
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}

export default Loans;
