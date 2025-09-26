'use client';

import { useContext, useEffect } from 'react';
import {
  Alert,
  Box,
  Container,
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
  const depositPercent = calc.MinDeposit;

  // Purchase price is derived when deposit applies
  const purchasePrice =
    depositPercent > 0
      ? baseAmountOwed / (1 - depositPercent / 100)
      : baseAmountOwed;

  useEffect(() => {
    sessionStorage.setItem('loanAmount', baseAmountOwed.toString());
  }, [baseAmountOwed]);

  const formatNumber = (num: number) =>
    Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleNumericInput = (
    raw: string,
    setter: (val: number) => void,
    cap = MAX_AMOUNT
  ) => {
    const parsed = Number(raw.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      const capped = Math.max(0, Math.min(parsed, cap));
      setter(capped);
    }
  };

  return (
    <Stack align="center" justify="center" gap="xs">
      <Container size="lg" ta="center" style={{ height: '100%' }} w='100%'>
        <Stack>
          {depositPercent > 0 ? (
            <>
              {/* Side-by-side finance amount + purchase price */}
              <Group grow align="flex-end">
                <Stack gap={2} w="100%">
                  <JumboTitle
                    order={isMobile ? 3 : 2}
                    fz="xs"
                    ta="center"
                    fw={600}
                    style={{ textWrap: 'balance' }}
                  >
                    Amount to Finance
                  </JumboTitle>
                  <TextInput
                    type="text"
                    value={baseAmountOwed.toLocaleString()}
                    onChange={(e) =>
                      handleNumericInput(e.currentTarget.value, setBaseAmountOwed)
                    }
                    leftSection="$"
                    size="md"
                    styles={{
                      input: {
                        fontSize: isMobile ? rem(24) : rem(28),
                        color: 'black',
                      },
                      section: {
                        fontSize: isMobile ? rem(24) : rem(28),
                        color: 'black',
                      },
                    }}
                    ta="center"
                    c={{ base: 'white', md: theme.colors.tertiary[0] }}
                  />
                </Stack>

                <Stack gap={2} w="100%">
                  <JumboTitle
                    order={isMobile ? 3 : 2}
                    fz="xs"
                    ta="center"
                    fw={600}
                    style={{ textWrap: 'balance' }}
                  >
                    Minimum Purchase Price
                  </JumboTitle>
                  <TextInput
                    type="text"
                    value={formatNumber(purchasePrice)}
                    leftSection="$"
                    size="md"
                    readOnly
                    disabled
                    styles={{
                      input: {
                        fontSize: isMobile ? rem(24) : rem(28),
                        color: 'gray',
                        backgroundColor: theme.colors.gray[1],
                        cursor: 'not-allowed',
                      },
                      section: {
                        fontSize: isMobile ? rem(24) : rem(28),
                        color: 'gray',
                      },
                    }}
                    ta="center"
                  />
                </Stack>
              </Group>

              {/* Slider for finance amount */}
              <Stack gap={0}>
                <Slider
                  px="xl"
                  min={0}
                  max={MAX_AMOUNT}
                  step={1000}
                  value={baseAmountOwed}
                  onChange={(value) => setBaseAmountOwed(Math.max(0, value))}
                  c={{ base: 'white', md: theme.colors.tertiary[0] }}
                  mx={isMobile ? 'xs' : 0}
                  size="xl"
                />
                <Group justify="space-between" px="xs">
                  <Text fz="xs" c="dimmed">
                    $0
                  </Text>
                  <Text fz="xs" c="dimmed">
                    ${formatNumber(MAX_AMOUNT)}
                  </Text>
                </Group>
              </Stack>

              <Box ta="center">
                <Alert color="orange">
                  A minimum deposit of {depositPercent}% is required
                </Alert>
              </Box>
            </>
          ) : (
            <>
              {/* Original flow: no deposit */}
              <JumboTitle
                order={isMobile ? 3 : 2}
                fz="xs"
                ta="center"
                fw={600}
                style={{ textWrap: 'balance' }}
              >
                Amount to Finance
              </JumboTitle>
              <TextInput
                type="text"
                value={baseAmountOwed.toLocaleString()}
                onChange={(e) =>
                  handleNumericInput(e.currentTarget.value, setBaseAmountOwed)
                }
                leftSection="$"
                size="md"
                styles={{
                  input: {
                    fontSize: isMobile ? rem(28) : rem(30),
                    color: 'black',
                  },
                  section: {
                    fontSize: isMobile ? rem(28) : rem(30),
                    color: 'black',
                  },
                }}
                ta="center"
                c={{ base: 'white', md: theme.colors.tertiary[0] }}
              />

              <Stack gap={0}>
                <Slider
                  px="xl"
                  min={0}
                  max={MAX_AMOUNT}
                  step={1000}
                  value={baseAmountOwed}
                  onChange={(value) => setBaseAmountOwed(Math.max(0, value))}
                  c={{ base: 'white', md: theme.colors.tertiary[0] }}
                  mx={isMobile ? 'xs' : 0}
                  size="xl"
                />
                <Group justify="space-between" px="xs">
                  <Text fz="xs" c="dimmed">
                    $0
                  </Text>
                  <Text fz="xs" c="dimmed">
                    ${formatNumber(MAX_AMOUNT)}
                  </Text>
                </Group>
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </Stack>
  );
}
