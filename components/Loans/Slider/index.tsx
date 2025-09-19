'use client';

import { useContext } from 'react';
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
import { useCriteria } from '../Criteria/CriteriaHandler';
import { useDisplay } from '../DisplayContext';

interface CalculatorSliderProps {
  index: number;
}
export default function CalculatorSlider({ index }: CalculatorSliderProps) {
  const theme = useMantineTheme();
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error('CalculatorContext is not provided');
  }

  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;

  const calc = useCriteria()[index];

  const { baseAmountOwed, setBaseAmountOwed } = ctx;
  const MAX_AMOUNT = calc.MaxPrice ? calc.MaxPrice : 0;
  const depositAmount = calc.MinDeposit;

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Stack align="center" justify="center" gap="xs" w="100%">
      <Stack align="center" gap="xs" w="100%">
        <span>
          <JumboTitle
            order={isMobile ? 3 : 2}
            fz="xs"
            ta="center"
            style={{ textWrap: 'balance' }}
            fw={600}
          >
            Amount to finance
          </JumboTitle>
        </span>
      </Stack>

      <Container size="lg" ta="center" style={{ height: '100%' }}>
        <Stack>
          <TextInput
            type="text"
            value={baseAmountOwed.toLocaleString()}
            onChange={(event) => {
              const raw = event.currentTarget.value;
              const parsed = Number(raw.replace(/,/g, ''));

              if (!isNaN(parsed)) {
                const capped = Math.min(parsed, MAX_AMOUNT);
                setBaseAmountOwed(capped);
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
              const raw = baseAmountOwed.toString();
              const parsed = Number(raw.replace(/,/g, ''));
              if (!isNaN(parsed)) {
                const capped = Math.max(0, parsed);
                setBaseAmountOwed(capped);
                sessionStorage.setItem('loanAmount', capped.toString());
              }
            }}
            leftSection="$"
            size="md"
            styles={{
              input: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
              label: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
              section: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
            }}
            ta="center"
            c={{ base: 'white', md: theme.colors.tertiary[0] }}
            // rightSection={
            //   <Button
            //     size="xs"
            //     variant="subtle"
            //     onClick={() => {
            //       setBaseAmountOwed(Math.min(baseAmountOwed, MAX_AMOUNT));
            //       sessionStorage.setItem('loanAmount', baseAmountOwed.toString());
            //     }}
            //   >
            //     Reset
            //   </Button>
            // }
            rightSectionWidth={100}
          />
          <Stack gap={0}>
            <Slider
              px="xl"
              min={0}
              max={MAX_AMOUNT}
              step={1000}
              value={baseAmountOwed}
              onChange={(value) => {
                setBaseAmountOwed(Math.max(0, value));
              }}
              c={{ base: 'white', md: theme.colors.tertiary[0] }}
              mx={isMobile ? 'xs' : 0}
              size="xl"
            />
            {/* Min/Max hint */}
            <Group justify="space-between" px="xs">
              <Text fz="xs" c="dimmed">
                $0
              </Text>
              <Text fz="xs" c="dimmed">
                ${formatNumber(MAX_AMOUNT)}
              </Text>
            </Group>
          </Stack>
          {depositAmount > 0 && (
            <Box
              pos={isMobile ? 'relative' : 'relative'}
              left={isMobile ? '0' : '0'}
              w={isMobile ? '100%' : '100%'}
              ta="center"
            >
              <Alert color="orange">A minimum deposit of {depositAmount}% is required</Alert>
            </Box>
          )}
        </Stack>
      </Container>
    </Stack>
  );
}
