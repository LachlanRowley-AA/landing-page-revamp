import { useContext } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert, Text } from '@mantine/core';
import { ATO_OptionsContext } from '../Context';

export default function Disclaimer() {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }
  const { ATO_interestRate } = ctx;
  return (
    <Alert variant="light" color="blue" icon={<IconInfoCircle />} py="xs">
      <Text size="sm" mb={0}>
        This calculator provides an estimate only. You are not guaranteed to receive the rates
        provided.
      </Text>
      <Text size="sm" mb={0}>
        This calculator uses the current GIC rate of {ATO_interestRate}%. The GIC may vary.
      </Text>
      <Text size="sm" mb={0}>
        Finance interest rates last updated: 29/09/2025
      </Text>
    </Alert>
  );
}
