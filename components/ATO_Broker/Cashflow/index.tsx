'use client';

import { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  Progress,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_ContextProvider } from './Context';
import DateSelect from './DateSelect';
import DepositSelect from './DepositSelect';
import Disclaimer from './Disclaimer';
import FetchATOInterest from './FetchData';
import Graph from './Graph';
import Slider from './Slider';
import TaxSelect from './TaxSelect';
import EffectiveRate from './Effective';

const ATO_dates = [6, 12, 18, 24];
const loan_dates = [6, 12, 18, 24, 36, 48, 60];

export function Options() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % menus.length);
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false, {
    getInitialValueInEffect: true,
  });

  const menus = [
    { component: <Slider />, label: 'Adjust loan size' },
    { component: <TaxSelect onSelect={next} />, label: 'Select your business tax' },
    {
      component: <DateSelect dates={ATO_dates} setATO onSelect={next} />,
      label: 'Select ATO term',
    },
    { component: <EffectiveRate />, label: 'Set effective interest rate' },
    {
      component: <DateSelect dates={loan_dates} setATO={false} onSelect={next} />,
      label: 'Select loan term',
    },
    { component: <DepositSelect onSelect={next} />, label: 'Deposit options' },
    { component: <Graph />, label: 'View results' },
  ];

  const content = (
    <Stack gap="md" style={{ flex: 1 }}>
      {/* Progress indicator */}
      <Group align="center">
        <Image src="/Default/logo_black.png" maw={{ base: '30vw', md: '10vw' }} />
        <JumboTitle
          order={2}
          fz="xs"
          ta="center"
          style={{ textWrap: 'balance' }}
          c={{ base: 'black', md: 'black' }}
          fw={600}
        >
          ATO Payment Plan vs Finance Comparison
        </JumboTitle>
      </Group>
      <Box>
        <Text size="sm" fw={500} mb="xs">
          Step {activeIndex + 1} of {menus.length}: {menus[activeIndex].label}
        </Text>
        <Progress value={((activeIndex + 1) / menus.length) * 100} radius="xl" />
      </Box>
      {activeIndex !== menus.length - 1 && <Disclaimer />}
      {/* Animated content, centered */}
      <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ width: '100%' }}
        >
          {menus[activeIndex].component}
        </motion.div>
      </Box>

      {/* Navigation */}
      <Group justify="space-between" mt={0}>
        <Button
          variant="default"
          leftSection={<IconChevronLeft size={18} />}
          onClick={prev}
          disabled={activeIndex === 0}
        >
          Back
        </Button>
        {(activeIndex === 0 || activeIndex === 3 || activeIndex === menus.length - 1) && (
          <Button
            size={activeIndex === menus.length - 1 ? 'xl' : 'md'}
            variant="filled"
            rightSection={<IconChevronRight size={18} />}
            onClick={() => {
                next();
            }}
          >
            Continue
          </Button>
        )}{' '}
      </Group>
    </Stack>
  );

  return (
    <ATO_ContextProvider isMobileProp={isMobile}>
      <FetchATOInterest />
      <Container size="xl" py={{ base: 0, md: 'xl' }} px="xs">
        {!isMobile ? (
          <Card
            shadow={isMobile ? '0' : 'md'}
            radius="lg"
            withBorder={!isMobile}
            p={{ base: 0, md: 'lg' }}
            mih={{ base: '100vh', md: '400px' }}
            miw={{ base: '100vw', md: '800px' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {content}
          </Card>
        ) : (
          <Container bg="white" py="md" mx={0}>
            {content}
          </Container>
        )}
      </Container>
    </ATO_ContextProvider>
  );
}

export default Options;
