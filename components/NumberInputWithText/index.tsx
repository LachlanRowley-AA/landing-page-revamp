'use client';

import { useState } from 'react';
import { ActionIcon, Box, Stack, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface NumberInputWithTextProps {
  formattedText: string;         // e.g. "GST registered for 2 or more years"
  value?: number;                // numeric value for tracking
  onIncrement?: (newValue: number) => void;
  onDecrement?: (newValue: number) => void;
}

export default function NumberInputWithText({
  formattedText,
  value = 0,
  onIncrement,
  onDecrement,
}: NumberInputWithTextProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleIncrement = () => {
    const newVal = internalValue + 1;
    setInternalValue(newVal);
    onIncrement?.(newVal);
  };

  const handleDecrement = () => {
    const newVal = Math.max(0, internalValue - 1);
    setInternalValue(newVal);
    onDecrement?.(newVal);
  };

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-sm)',
        padding: '8px 12px',
        minHeight: 40,
        width: 280,
      }}
    >
      <Text>{formattedText}</Text>

      <Stack gap={2} style={{ alignItems: 'center' }}>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleIncrement}
          aria-label="Increment"
        >
          <IconChevronDown style={{ transform: 'rotate(180deg)' }} />
        </ActionIcon>

        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleDecrement}
          aria-label="Decrement"
        >
          <IconChevronDown />
        </ActionIcon>
      </Stack>
    </Box>
  );
}
