'use client';

import { useContext, useState } from 'react';
import { motion } from 'motion/react';
import {
  Button,
  Container,
  Grid,
  rem,
  Slider,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_OptionsContext } from '../Context';

export default function CalculatorSlider() {
  const theme = useMantineTheme();
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const { amountOwed, setAmountOwed, calculateInterestAmount } = ctx;
  const MAX_AMOUNT = 200000; //max amount ATO allows for payment plan

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <div>
      <Stack align="center" gap="xs">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ width: '100%' }}
        >
          <Grid align="center" gutter="xl">
            <Grid.Col span={12}>
              <span>
                <JumboTitle
                  order={1}
                  fz="xs"
                  ta="center"
                  style={{ textWrap: 'balance' }}
                  c={{ base: 'black', md: 'black' }}
                  fw={600}
                >
                  Set your ATO debt amount
                </JumboTitle>
              </span>
            </Grid.Col>
          </Grid>
        </motion.div>
      </Stack>

      <Container size="lg" mt="xl" ta="center" style={{ height: '100%' }}>
        <motion.div
          initial={{ opacity: 0.0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Stack>
            <TextInput
              type="text"
              value={amountOwed.toLocaleString()}
              onChange={(event) => {
                const raw = event.currentTarget.value;
                const parsed = Number(raw.replace(/,/g, ''));

                if (!isNaN(parsed)) {
                  const capped = Math.min(parsed, MAX_AMOUNT);
                  setAmountOwed(capped);
                  sessionStorage.setItem('loanAmount', capped.toString());
                }
              }}
              onKeyDown={(e) => {
                const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

                // Allow control keys
                if (allowed.includes(e.key)) {
                  return;
                }

                // Allow one dot if not already present
                if (e.key === '.') {
                  if (e.currentTarget.value.includes('.')) {
                    e.preventDefault(); // prevent multiple dots
                  }

                  return;
                }
                // Allow digits 0–9
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault(); // block everything else
                }
              }}
              onBlur={() => {
                const raw = amountOwed.toString();
                const parsed = Number(raw.replace(/,/g, ''));
                if (!isNaN(parsed)) {
                  const capped = Math.max(0, parsed);
                  setAmountOwed(capped);
                  sessionStorage.setItem('loanAmount', capped.toString());
                }
              }}
              leftSection="$"
              size="xl"
              styles={{
                input: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                label: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                section: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
              }}
              ta="center"
              c={{ base: 'white', md: theme.colors.tertiary[0] }}
              rightSection={
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setAmountOwed(Math.min(amountOwed, MAX_AMOUNT));
                    sessionStorage.setItem('loanAmount', amountOwed.toString());
                  }}
                >
                  Reset
                </Button>
              }
              rightSectionWidth={100}
            />
            <Stack gap={0}>
              <Slider
                px="xl"
                min={0}
                max={MAX_AMOUNT}
                step={1000}
                value={amountOwed}
                onChange={(value) => {
                  setAmountOwed(Math.max(0, value));
                  sessionStorage.setItem('loanAmount', value.toString());
                  console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                }}
                c={{ base: 'white', md: theme.colors.tertiary[0] }}
                mx={isMobile ? 'xs' : 0}
                size="xl"
              />
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </div>
  );
}
