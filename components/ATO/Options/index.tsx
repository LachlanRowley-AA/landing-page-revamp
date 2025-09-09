'use client';

import { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { Box, Button, Card, Container, Group, Progress, Stack, Text } from '@mantine/core';
import { ATO_ContextProvider } from './Context';
import DateSelect from './DateSelect';
import FetchATOInterest from './FetchData';
import Graph from './Graph';
import Slider from './Slider';
import TaxSelect from './TaxSelect';
import ContactSpecialist from './ContactSpecialist';

const ATO_dates = [6, 12, 18, 24];
const loan_dates = [6, 12, 18, 24, 36, 48, 60];

export function Options() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % menus.length);
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));


  const menus = [
    { component: <Slider />, label: 'Adjust loan size' },
    { component: <TaxSelect onSelect={next} />, label: 'Select your business tax'},
    {
      component: <DateSelect dates={ATO_dates} setATO onSelect={next} />,
      label: 'Select ATO term',
    },
    {
      component: <DateSelect dates={loan_dates} setATO={false} onSelect={next} />,
      label: 'Select loan term',
    },
    { component: <Graph />, label: 'View results' },
    { component: <ContactSpecialist />, label: 'Talk to a specialist'}
  ];


  return (
    <ATO_ContextProvider>
      <FetchATOInterest />

      <Container size="sm" py="xl">
        <Card
          shadow="sm"
          radius="lg"
          withBorder
          padding="lg"
          style={{
            minHeight: 400, // lock base size
            minWidth: 800,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack gap="md" style={{ flex: 1 }}>
            {/* Progress indicator */}
            <Box>
              <Text size="sm" fw={500} mb="xs">
                Step {activeIndex + 1} of {menus.length}: {menus[activeIndex].label}
              </Text>
              <Progress value={((activeIndex + 1) / menus.length) * 100} radius="xl" />
            </Box>

            {/* Animated content, centered */}
            <Box
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
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
            <Group justify="space-between" mt="md">
              <Button
                variant="default"
                leftSection={<IconChevronLeft size={18} />}
                onClick={prev}
                disabled={activeIndex === 0}
              >
                Back
              </Button>
              <Button variant="filled" rightSection={<IconChevronRight size={18} />} onClick={next}>
                {activeIndex === menus.length - 1 ? 'Finish' : 'Continue'}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>
    </ATO_ContextProvider>
  );
}

export default Options;
