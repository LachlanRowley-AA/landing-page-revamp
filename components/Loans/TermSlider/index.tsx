'use client';

import { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Group,
  rem,
  Slider,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContext } from '../Context';
import { useDisplay } from '../DisplayContext';


export default function TermSlider() {
  const theme = useMantineTheme();
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error('CalculatorContext is not provided');
  }

    const displayCtx = useDisplay();
    const { isMobile } = displayCtx;
  

  const { loanPaymentTermLength, setLoanPaymentTermLength } = ctx;
  const [loanLengthYears, setLoanLengthYears] = useState<number>(1);

  function loanLengthSetter(years : number) {
    console.log('year set', years);
    setLoanLengthYears(years);
    setLoanPaymentTermLength(12 * years);
  }

  const MAX_AMOUNT = 5;

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Stack align="center" justify="center" gap="xs">
      <Stack align="center" gap="xs">
        <Grid align="center" gutter="xl">
          <Grid.Col span={12}>
            <span>
              <JumboTitle
                order={isMobile ? 3 : 2}
                fz="xs"
                ta="center"
                style={{ textWrap: 'balance' }}
                c={{ base: 'black', md: 'black' }}
                fw={600}
              >
                Term Length
              </JumboTitle>
            </span>
          </Grid.Col>
        </Grid>
      </Stack>

      <Container size="lg" ta="center" style={{ height: '100%', width: '100%' }}>
        <Group align="center" w='100%'>
          <Stack align="center" w='100%'>
            <Stack gap={0} w="100%">
              <Slider
                px="xl"
                min={1}
                max={MAX_AMOUNT}
                step={1}
                value={loanLengthYears}
                onChange={(value) => loanLengthSetter(Math.max(1, value))}
                mx={isMobile ? 'xs' : 0}
                size="xl"
                w='100%'
                marks={[
                  { value: 1, label: '1 year'},
                  { value: 2, label: '2 years'},
                  { value: 3, label: '3 years'},
                  { value: 4, label: '4 years'},
                  { value: 5, label: '5 years'},
                ]}
              />
            </Stack>
          </Stack>
        </Group>
      </Container>
    </Stack>
  );
}
