import { useContext } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import { ATO_OptionsContext } from '../Context';

export default function Disclaimer() {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }
  const { ATO_interestRate } = ctx;
  return (
    <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
      This calculator provides an estimate only. You are not guaranteed to receieve the rates
      provided. <p />
      This calculator uses the current GIC rate of {ATO_interestRate}%. The GIC may vary.
    </Alert>
  );
}
