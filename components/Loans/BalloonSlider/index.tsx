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
import { useCriteria } from '../Criteria/CriteriaHandler';
import { useDisplay } from '../DisplayContext';

interface BalloonSliderProps {
  index: number;
}
export default function BalloonSlider({ index }: BalloonSliderProps) {
  const theme = useMantineTheme();
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error('CalculatorContext is not provided');
  }
  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;

  const { balloonAmount, setBalloonAmount, vehicleAgeToggle } = ctx;
  const calc = useCriteria()[index];
  const [maxBalloon, setMaxBalloon] = useState(calc.MaxBalloon ?? 0);

  useEffect(() => {
    const newMax = vehicleAgeToggle
      ? calc.MaxBalloon - calc.VehicleAgeImpact.BalloonDecrease
      : calc.MaxBalloon;

    setMaxBalloon(newMax);
    setBalloonAmount(Math.min(newMax, balloonAmount))
  }, [vehicleAgeToggle, calc.MaxBalloon, calc.VehicleAgeImpact.BalloonDecrease]);

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
                Balloon Amount
              </JumboTitle>
            </span>
          </Grid.Col>
        </Grid>
      </Stack>

      <Container size="lg" ta="center" style={{ height: '100%', width: '100%' }}>
        <Group align="center" w="100%">
          {/* Main Stack (input + slider) */}
          <Stack align="center" w="100%">
            <TextInput
              w="100%"
              type="number"
              value={balloonAmount.toLocaleString()}
              onChange={(event) => {
                const raw = event.currentTarget.value;
                const parsed = Number(raw.replace(/,/g, ''));
                if (!isNaN(parsed)) {
                  setBalloonAmount(Math.min(parsed, maxBalloon));
                }
              }}
              onKeyDown={(e) => {
                const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (allowed.includes(e.key)) {
                  return;
                }
                if (e.key === '.' && e.currentTarget.value.includes('.')) {
                  e.preventDefault();
                }
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onBlur={() => setBalloonAmount(Math.max(0, balloonAmount))}
              size="md"
              styles={{
                input: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
                label: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
                section: { fontSize: isMobile ? rem(28) : rem(30), color: 'black' },
              }}
              ta="center"
              c={{ base: 'white', md: theme.colors.tertiary[0] }}
              rightSection="%"
            />
            <Stack gap={0} w="100%">
              <Slider
                px="xl"
                min={0}
                max={maxBalloon}
                step={1}
                value={balloonAmount}
                onChange={(value) => setBalloonAmount(Math.max(0, value))}
                color={balloonAmount >= 41 ? 'red' : balloonAmount >= 31 ? 'orange' : 'blue'}
                mx={isMobile ? 'xs' : 0}
                size="xl"
                w="100%"
              />
              <Group justify="space-between" px="xs">
                <Text fz="xs" c="dimmed">
                  0%
                </Text>
                <Text fz="xs" c="dimmed">
                  {formatNumber(maxBalloon)}%
                </Text>
              </Group>
            </Stack>
          </Stack>
          {/* Change this to just be a grid */}
          {/* Alert on the right */}
          {balloonAmount === maxBalloon && (
            <Box
              pos={isMobile ? 'relative' : 'relative'}
              left={isMobile ? '0' : '0'}
              maw={isMobile ? '100%' : '100%'}
              w="100%"
            >
              <Alert color="orange">For bigger balloons, speak to a specialist</Alert>
            </Box>
          )}
        </Group>
      </Container>
    </Stack>
  );
}
