'use client';

import { useContext, useState } from 'react';
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

export default function BalloonSlider() {
  const theme = useMantineTheme();
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error('CalculatorContext is not provided');
  }

  const { balloonAmount, setBalloonAmount, isMobile } = ctx;
  const MAX_AMOUNT = 100;

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Stack align="center" justify="center">
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

      <Container size="lg" ta="center" style={{ height: '100%' }}>
        <Group align="center">
          {/* Main Stack (input + slider) */}
          <Stack align="center">
            <TextInput
              type="text"
              value={balloonAmount.toLocaleString()}
              onChange={(event) => {
                const raw = event.currentTarget.value;
                const parsed = Number(raw.replace(/,/g, ''));
                if (!isNaN(parsed)) {
                  setBalloonAmount(Math.min(parsed, MAX_AMOUNT));
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
                max={MAX_AMOUNT}
                step={1}
                value={balloonAmount}
                onChange={(value) => setBalloonAmount(Math.max(0, value))}
                color={balloonAmount >= 41 ? 'red' : balloonAmount >= 31 ? 'orange' : 'blue'}
                mx={isMobile ? 'xs' : 0}
                size="xl"
              />
              <Group justify="space-between" px="xs">
                <Text fz="xs" c="dimmed">
                  0%
                </Text>
                <Text fz="xs" c="dimmed">
                  ${formatNumber(MAX_AMOUNT)}
                </Text>
              </Group>
            </Stack>
          </Stack>
          {/* Change this to just be a grid */}
          {/* Alert on the right */}
          {balloonAmount > 30 && (
            <Box pos="absolute" left="75%" maw="20%">
              <Alert color="orange">
                We recommend talking to a specialist if you would like this balloon amount
              </Alert>
            </Box>
          )}
        </Group>
      </Container>
    </Stack>
  );
}
