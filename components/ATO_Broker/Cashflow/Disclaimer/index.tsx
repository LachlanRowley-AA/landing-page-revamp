import { IconInfoCircle } from '@tabler/icons-react';
import { Alert, Text } from '@mantine/core';

export default function Disclaimer() {
  return (
    <Alert variant="light" color="blue" icon={<IconInfoCircle />} py="xs">
      <Text size="sm">
        This calculator provides estimates only and does not constitute a guarantee of the rates
        shown.
      </Text>
      <Text size="sm">
        The General Interest Charge (GIC) rate is currently 10.61%. Rate changes every quarter
        (7% + 90 day BAB yield)
      </Text>
    </Alert>
  );
}
