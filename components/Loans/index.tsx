'use client';

import { useState } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconRosetteDiscountCheckFilled,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Progress,
  Stack,
  Text,
  Title,
  useMantineTheme,
  Divider,
  Paper,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContextProvider } from './Context';
import Criteria from './Criteria';
import Slider from './Slider';

export function Loans() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % menus.length);
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false, {
    getInitialValueInEffect: true,
  });

  const menus = [{ component: '', label: 'Adjust loan size' }];

  const Header = (
    <Group align="center" justify="center" mb="md">
      <Image src="/Default/logo_black.png" maw={{ base: '25vw', md: '8vw' }} py={0} my={0}/>
      <JumboTitle
        order={2}
        ta="center"
        style={{ textWrap: 'balance' }}
        fw={700}
        pb="xs"
      >
        Vehicle Finance Calculator
      </JumboTitle>
    </Group>
  );

  return (
    <CalculatorContextProvider>
      <Container size="lg" py="xl" px="xs">
        <Card
          shadow="md"
          radius="xl"
          withBorder
          p={{ base: 'md', md: 'xl' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          {Header}

          <Divider my="sm" />

          <Stack gap="lg">
            <Criteria />
            <Slider />
          </Stack>

          <Divider my="sm" />

          <Group justify="flex-end" mt="md">
            <Button
              size={isMobile ? 'md' : 'lg'}
              radius="xl"
              rightSection={<IconChevronRight size={18} />}
            >
              Calculate
            </Button>
          </Group>
        </Card>
      </Container>
    </CalculatorContextProvider>
  );
}

export default Loans;
