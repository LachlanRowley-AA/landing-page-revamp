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
        The General Interest Charge (GIC) rate of 10.61% is sourced from the Australian Taxation
        Office (ATO) and is subject to change.
      </Text>
      <Text size="sm">
        We are not affiliated with, endorsed by, or acting on behalf of the ATO.
      </Text>
      <Text size="sm">
        Finance plan rates are set independently and were last updated on 1 October 2025.
      </Text>
    </Alert>
  );
}
